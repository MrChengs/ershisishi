# Content

The site reads this folder. TypeScript under `data/` only loads and queries it.

## Layout

| Path | Format | What it is |
| --- | --- | --- |
| `config.json` | JSON | Edition, editor, dynasty order, roles, claim types, book groups |
| `schema/` | JSON Schema | Shape of config, books, people |
| `books/*.json` | JSON | One file per history |
| `people/*.md` | Markdown + YAML | 史家 and 纪传人物. Body = `summaryZh` |
| `articles/*.md` | Markdown + YAML | Knowledge essays. `##` headings become sections |
| `graph/*.json` | JSON | Paths, claims, juans, loci, events |

Change `config.json` to add a dynasty, a person role, a claim type, or to rename content directories.

## Add a person

Copy any file in `people/`. Keep the slug in both the filename and the frontmatter. `role` must be listed in `config.personRoles`. `dynasty` should be in `config.dynastyOrder`.

```md
---
slug: example
nameZh: 例
nameEn: Example
pinyin: Lì
role: 纪传人物
years: —
dynasty: 西汉
summaryEn: A recorded figure.
bookSlugs:
  - han-shu
chapters:
  - bookSlug: han-shu
    chapter: 某传
---

正史有传的说明写在这里。
```

## Check

```bash
npm run content:check
```
