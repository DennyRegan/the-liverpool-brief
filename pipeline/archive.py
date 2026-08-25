import os
import re
import sys
import json
import time
import shutil
import pathlib
from datetime import date

from dotenv import load_dotenv
from anthropic import Anthropic
from openai import OpenAI

# Paths are anchored to this file's own location, not to the folder the
# terminal happens to be in, so the script behaves the same wherever it
# is run from.
BASE = pathlib.Path(__file__).resolve().parent      # pipeline/
REPO = BASE.parent                                   # the-liverpool-brief/

PROMPTS_DIR = BASE / "prompts"
STYLE_DIR = BASE / "style"
OUTPUT_DIR = BASE / "output"
EXEMPLAR_DIR = REPO / "content" / "archive" / "liverpool"

load_dotenv(REPO / ".env")

claude = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"], max_retries=5)
gpt = OpenAI(api_key=os.environ["OPENAI_API_KEY"], max_retries=5)

CLAUDE_MODEL = "claude-sonnet-5"
GPT_MODEL = "gpt-5"

# These match the `category` values in the article frontmatter and the
# enum in ArchiveFeatureSchema. One vocabulary, not two.
CATEGORIES = ["match", "person", "season"]

# Categories whose articles belong to a multi-part series and therefore
# require --series. Everything else is a standalone article.
SERIES_CATEGORIES = ["person"]

# Seasons follow a fixed shape with a facts panel, so they get their own
# drafting prompt. Matches and people stay free-form.
DRAFT_PROMPTS = {"season": "draft-season.txt"}
DEFAULT_DRAFT_PROMPT = "draft.txt"

GPT_COOLDOWN = 65
MAX_EXEMPLARS = 3
MAX_TOKENS = 32000

# Sentinel lines the model is told to emit between its two outputs. The
# script splits on these rather than guessing where the article ends, so
# the prompt files and these constants must always agree.
GAPS_MARKER = "---GAPS---"
DISPOSITIONS_MARKER = "---DISPOSITIONS---"

_last_gpt_call = 0.0


def load_prompt(filename, **values):
    text = (PROMPTS_DIR / filename).read_text(encoding="utf-8")
    for key, value in values.items():
        text = text.replace("{" + key + "}", value)
    return text


def load_standards():
    return (STYLE_DIR / "standards.md").read_text(encoding="utf-8")


def load_series_brief(category, series):
    """Return the series brief, or empty string for a standalone article.

    The brief holds the agreed chronology, settled totals, spellings and
    any sensitive-period boundary. It rides on every call in the series
    so that part one and part four cannot quietly disagree.
    """
    if not series:
        return ""
    path = OUTPUT_DIR / category / series / "series.md"
    if not path.exists():
        raise SystemExit(
            f"\n  STOPPED: no series brief at {path}\n"
            "  Write it before drafting. Parts written without a brief\n"
            "  will contradict each other and nothing here will catch it.\n"
        )
    return path.read_text(encoding="utf-8")


def build_system_text(series_brief):
    parts = [load_standards()]
    if series_brief:
        parts.append(
            "--- SERIES BRIEF ---\n"
            "This is settled. Nothing you produce may contradict it.\n\n"
            + series_brief
        )
    return "\n\n".join(parts)


def load_exemplars():
    """Teach the house voice from articles already published on the site.

    Reading the live content folder rather than a copy means the
    exemplars are always current, and the frontmatter shape shown to the
    drafter is always the shape the site actually parses.
    """
    paths = sorted(EXEMPLAR_DIR.glob("*.md"))[:MAX_EXEMPLARS]
    if not paths:
        return "(no exemplars available)"
    print(f"       exemplars: {', '.join(p.name for p in paths)}")
    return "\n\n".join(
        f"--- {p.name} ---\n{p.read_text(encoding='utf-8')}" for p in paths
    )


def ask_claude(prompt, system):
    # Streamed because a long article can take more than ten minutes to
    # write, and the SDK refuses non-streaming requests that might.
    with claude.messages.stream(
        model=CLAUDE_MODEL,
        max_tokens=MAX_TOKENS,
        system=system,
        messages=[{"role": "user", "content": prompt}],
    ) as stream:
        response = stream.get_final_message()

    if response.stop_reason == "max_tokens":
        raise SystemExit(
            "\n  STOPPED: the response was cut off before it finished.\n"
            f"  It reached the {MAX_TOKENS} token ceiling mid-article.\n"
            "  Raise MAX_TOKENS near the top of this file and re-run.\n"
            "  Nothing was saved for this stage.\n"
        )
    return "\n".join(b.text for b in response.content if b.type == "text")


def ask_gpt_with_search(prompt, system):
    global _last_gpt_call
    wait = GPT_COOLDOWN - (time.time() - _last_gpt_call)
    if wait > 0:
        print(f"       waiting {wait:.0f}s for the token limit to clear...")
        time.sleep(wait)
    response = gpt.responses.create(
        model=GPT_MODEL,
        tools=[{"type": "web_search"}],
        instructions=system,
        input=prompt,
    )
    _last_gpt_call = time.time()
    return response.output_text


def save(folder, filename, text):
    folder.mkdir(parents=True, exist_ok=True)
    path = folder / filename
    path.write_text(text, encoding="utf-8")
    print(f"       saved {path.relative_to(REPO)}")
    return path


def stage(folder, filename, produce):
    """Return the contents of filename, producing it only if absent.

    This is what makes a re-run pick up where the last one stopped
    instead of paying for completed stages again.
    """
    path = folder / filename
    if path.exists():
        print(f"       reusing {path.relative_to(REPO)}")
        return path.read_text(encoding="utf-8")
    text = produce()
    save(folder, filename, text)
    return text


def split_on(text, marker):
    """Split a two-part response on its sentinel line.

    Returns (before, after). `after` is None when the marker is absent,
    which lets each caller decide whether that is tolerable.
    """
    if marker not in text:
        return text.strip(), None
    before, after = text.split(marker, 1)
    return before.strip(), after.strip()


def slugify(topic):
    return re.sub(r"[^a-z0-9]+", "-", topic.lower()).strip("-")[:60]


def usage():
    print('Usage: python pipeline/archive.py "Topic" <category> [--series <slug>] [--fresh]')
    print(f"Categories: {', '.join(CATEGORIES)}")
    print(f"--series is required for: {', '.join(SERIES_CATEGORIES)}")
    print("--fresh discards saved stages and starts again from research.")
    sys.exit(1)


def parse_args(argv):
    fresh = "--fresh" in argv
    series = None
    rest = []
    i = 0
    while i < len(argv):
        if argv[i] == "--fresh":
            i += 1
        elif argv[i] == "--series":
            if i + 1 >= len(argv):
                usage()
            series = slugify(argv[i + 1])
            i += 2
        else:
            rest.append(argv[i])
            i += 1
    return rest, series, fresh


def main():
    args, series, fresh = parse_args(sys.argv[1:])

    if len(args) < 2:
        usage()

    topic = args[0]
    category = args[1].lower()

    if category not in CATEGORIES:
        print(f"Unknown category '{category}'. Use: {', '.join(CATEGORIES)}")
        sys.exit(1)

    if category in SERIES_CATEGORIES and not series:
        print(f"Category '{category}' needs --series <slug>, "
              "e.g. --series kenny-dalglish")
        sys.exit(1)

    slug = slugify(topic)

    if series:
        folder = OUTPUT_DIR / category / series / slug
    else:
        folder = OUTPUT_DIR / category / slug

    if fresh and folder.exists():
        shutil.rmtree(folder)
        print(f"  --fresh: discarded {folder.relative_to(REPO)}")

    series_brief = load_series_brief(category, series)
    system_text = build_system_text(series_brief)

    print(f"\n  Topic:    {topic}")
    print(f"  Category: {category}")
    if series:
        print(f"  Series:   {series}")
    print()

    # ---------------------------------------------------------------
    print("  1/4  researching (slow - live web search)...")
    packet = stage(
        folder,
        "01-research.md",
        lambda: ask_gpt_with_search(
            load_prompt("research.txt", topic=topic, category=category),
            system_text,
        ),
    )

    # ---------------------------------------------------------------
    print("  2/4  drafting...")
    draft_path = folder / "02-draft.md"

    if draft_path.exists():
        print(f"       reusing {draft_path.relative_to(REPO)}")
        draft = draft_path.read_text(encoding="utf-8")
    else:
        draft_prompt = DRAFT_PROMPTS.get(category, DEFAULT_DRAFT_PROMPT)
        print(f"       prompt: {draft_prompt}")
        raw = ask_claude(
            load_prompt(
                draft_prompt,
                topic=topic,
                category=category,
                exemplars=load_exemplars(),
                packet=packet,
                today=date.today().isoformat(),
                slug=slug,
            ),
            system_text,
        )
        draft, gaps = split_on(raw, GAPS_MARKER)
        save(folder, "02-draft.md", draft)
        # The gaps list records what the packet did not support. The
        # fact-checker will never surface this, because an absence is
        # not a finding - only the writer knows what it could not say.
        if gaps:
            save(folder, "02-gaps.md", gaps)
        else:
            print("       no gaps list returned")

    # ---------------------------------------------------------------
    print("  3/4  fact-checking (re-opening cited sources)...")
    report_path = folder / "03-check.json"

    if report_path.exists():
        print(f"       reusing {report_path.relative_to(REPO)}")
        report = json.loads(report_path.read_text(encoding="utf-8"))
    else:
        raw = ask_gpt_with_search(
            load_prompt("check.txt", article=draft), system_text
        )
        cleaned = raw.strip()
        if cleaned.startswith("```"):
            cleaned = re.sub(r"^```[a-z]*\n?|```$", "", cleaned).strip()

        try:
            report = json.loads(cleaned)
        except json.JSONDecodeError:
            save(folder, "03-check-RAW.txt", raw)
            raise SystemExit(
                "\n  STOPPED: fact-checker did not return valid JSON.\n"
                "  Nothing corrected. Read the RAW file before going further.\n"
                "  Research and draft are saved - re-running resumes from here.\n"
            )

        save(folder, "03-check.json", json.dumps(report, indent=2))

    # A report can parse cleanly and still be the wrong shape. Both
    # guards below stop rather than infer: a check that never ran must
    # not be indistinguishable from a clean one.
    if "issues" not in report:
        raise SystemExit(
            "\n  STOPPED: the fact-check report has no 'issues' key.\n"
            "  The JSON parsed, but it is not the expected shape, so\n"
            "  nothing was checked. Read 03-check.json before re-running.\n"
        )

    if report.get("searches_run", 0) == 0:
        raise SystemExit(
            "\n  STOPPED: the fact-checker ran zero searches.\n"
            "  Nothing was verified. Do not treat this draft as checked.\n"
        )

    issues = report["issues"]
    high = sum(1 for i in issues if i.get("severity") == "high")
    print(f"       {len(issues)} issue(s), {high} high severity, "
          f"{report['searches_run']} searches")

    # ---------------------------------------------------------------
    final_path = folder / "04-final.md"

    if final_path.exists():
        print("  4/4  already applied")
        final = final_path
    elif issues:
        print("  4/4  applying corrections...")
        raw = ask_claude(
            load_prompt(
                "correct.txt",
                article=draft,
                issues=json.dumps(issues, indent=2),
            ),
            system_text,
        )
        article, dispositions = split_on(raw, DISPOSITIONS_MARKER)

        # Without dispositions there is no record of how each finding
        # was handled, and the writer has effectively marked its own
        # work at the last stage. That is the one thing this design
        # exists to prevent, so it is a hard stop.
        if dispositions is None:
            save(folder, "04-final-RAW.txt", raw)
            raise SystemExit(
                "\n  STOPPED: no dispositions block in the correction response.\n"
                "  There is no record of how each finding was handled, so the\n"
                "  article was not saved. Read the RAW file and re-run stage 4.\n"
            )

        final = save(folder, "04-final.md", article)
        save(folder, "05-dispositions.md", dispositions)
    else:
        print("  4/4  nothing to correct")
        final = save(folder, "04-final.md", draft)
        save(folder, "05-dispositions.md",
             "No findings returned. Nothing corrected.\n")

    print(f"\n  Done. Read 05-dispositions.md, then "
          f"{final.relative_to(REPO)}.\n")


if __name__ == "__main__":
    main()