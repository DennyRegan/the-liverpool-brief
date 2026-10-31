# Matchday

Matchday is an article category for pieces tied to a single fixture. Opinion is unchanged and stays for pieces not tied to one game. Matchday pieces are ordinary files in `content/articles/liverpool/` at `/articles/[slug]`, and they also appear in Articles > All. The Matchday page (`/matchday`, in the Articles category row next to Opinion) groups them by fixture, newest fixture first.

## Adding a piece

Add frontmatter like this to a normal article file:

```yaml
category: "Matchday"
matchType: "Preview"        # Preview | Report | Opinion on a match
fixture:
  opponent: "Arsenal"
  date: "2026-11-01"        # the match date, not the publication date
  competition: "Premier League"
  venue: "Home"             # Home | Away
```

`date` stays the publication date. Pieces with the same opponent on the same fixture date group together; within a group they run Preview, Report, Opinion on a match. The heading is built from the fixture, home side first ("Liverpool v Arsenal, Premier League, 1 November 2026"; away games read "Arsenal v Liverpool, ...").

## Behaviour notes

- `matchType` and `fixture` are optional. A Matchday piece without a fixture appears under "Other Matchday pieces"; without a type it simply shows no type label.
- A misspelt `matchType`, an incomplete `fixture` or a `venue` other than Home/Away fails the build, like any other invalid frontmatter.
- The homepage selection is unchanged and does not include Matchday pieces.
