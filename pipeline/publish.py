import re
import sys
import shutil
import pathlib

# Anchored to this file's location so it does not matter which folder
# the terminal is in.
BASE = pathlib.Path(__file__).resolve().parent      # pipeline/
REPO = BASE.parent                                   # the-liverpool-brief/

OUTPUT_DIR = BASE / "output"
CONTENT_DIR = REPO / "content" / "archive" / "liverpool"

REQUIRED_FRONTMATTER = [
    "title",
    "date",
    "historicalPeriod",
    "decade",
    "excerpt",
    "slug",
    "category",
]


def find_article(slug):
    """Locate the article folder anywhere under output/.

    Folders sit at output/<category>/<slug>/ for standalone pieces and
    output/<category>/<series>/<slug>/ for series parts, so search rather
    than making the caller remember which.
    """
    matches = [p for p in OUTPUT_DIR.rglob(slug) if p.is_dir()]
    if not matches:
        raise SystemExit(f"\n  No folder named '{slug}' under {OUTPUT_DIR}\n")
    if len(matches) > 1:
        listing = "\n    ".join(str(m) for m in matches)
        raise SystemExit(
            f"\n  More than one folder named '{slug}':\n    {listing}\n"
            "  Rename one before publishing.\n"
        )
    return matches[0]


def check_dispositions(folder):
    """Refuse to publish while a finding is unresolved.

    A contested finding means the writer declined a fact-checker's
    correction and left it for Denny. Publishing over that would bury
    the one judgement the pipeline deliberately escalates.
    """
    path = folder / "05-dispositions.md"
    if not path.exists():
        raise SystemExit(
            "\n  STOPPED: no 05-dispositions.md in this folder.\n"
            "  There is no record of how the fact-check findings were\n"
            "  handled, so this article has not completed the pipeline.\n"
        )

    text = path.read_text(encoding="utf-8")
    contested = re.findall(r"^\*\*(\w+) — contested\*\*", text, re.MULTILINE)

    if contested:
        raise SystemExit(
            f"\n  STOPPED: {len(contested)} contested finding(s): "
            f"{', '.join(contested)}\n"
            "  These are the corrections the writer declined to make and\n"
            "  left for you to resolve. Read 05-dispositions.md, settle them\n"
            "  in 04-final.md, then change 'contested' to 'resolved' for each.\n"
        )


def check_frontmatter(text):
    if not text.startswith("---"):
        raise SystemExit(
            "\n  STOPPED: 04-final.md does not begin with YAML frontmatter.\n"
            "  The site cannot parse it. Check the top of the file.\n"
        )

    parts = text.split("---", 2)
    if len(parts) < 3:
        raise SystemExit("\n  STOPPED: frontmatter is not closed with '---'.\n")

    block = parts[1]
    missing = [
        key for key in REQUIRED_FRONTMATTER
        if not re.search(rf"^{key}:", block, re.MULTILINE)
    ]
    if missing:
        raise SystemExit(
            f"\n  STOPPED: frontmatter is missing: {', '.join(missing)}\n"
            "  ArchiveFeatureSchema will reject this and the build will fail.\n"
        )

    match = re.search(r'^slug:\s*"?([^"\n]+)"?', block, re.MULTILINE)
    return match.group(1).strip() if match else None


def main():
    if len(sys.argv) < 2:
        print("Usage: python pipeline/publish.py <slug> [--force]")
        print("Copies output/**/<slug>/04-final.md into content/archive/liverpool/")
        sys.exit(1)

    slug = sys.argv[1]
    force = "--force" in sys.argv

    folder = find_article(slug)
    print(f"\n  Found {folder.relative_to(REPO)}")

    check_dispositions(folder)

    final = folder / "04-final.md"
    if not final.exists():
        raise SystemExit(f"\n  STOPPED: no 04-final.md in {folder}\n")

    text = final.read_text(encoding="utf-8")
    frontmatter_slug = check_frontmatter(text)

    # The site derives the slug from the filename, so the filename is
    # what actually decides the published URL. Warn on a mismatch rather
    # than silently picking one.
    if frontmatter_slug and frontmatter_slug != slug:
        print(f"  Note: frontmatter slug is '{frontmatter_slug}', "
              f"publishing as '{slug}.md' (the filename wins).")

    destination = CONTENT_DIR / f"{slug}.md"

    if destination.exists() and not force:
        raise SystemExit(
            f"\n  STOPPED: {destination.relative_to(REPO)} already exists.\n"
            "  Re-run with --force to overwrite it.\n"
        )

    CONTENT_DIR.mkdir(parents=True, exist_ok=True)
    shutil.copy2(final, destination)

    print(f"  Published to {destination.relative_to(REPO)}")
    print("\n  Next: npm run dev, check it renders, then commit and push.\n")


if __name__ == "__main__":
    main()
