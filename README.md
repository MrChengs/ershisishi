# 二十四史 · 正史知识库

站点首页：[https://mrchengs.github.io/ershisishi/](https://mrchengs.github.io/ershisishi/)

Public knowledge site for China’s Twenty-Four Histories (二十四史): books, historians, form, and reading paths.

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content

Structured knowledge lives in `data/`:

- `data/books.ts` — the twenty-four Standard Histories
- `data/people.ts` — historians and sample biographical figures
- `data/articles.ts` — essays on method and reading

Add a book, person, or article there, then link it with `related*Slugs`. See `/knowledge/maintain-the-knowledge` on the site.

## Deploy

GitHub Pages serves a static export of this site:

[https://mrchengs.github.io/ershisishi/](https://mrchengs.github.io/ershisishi/)

Pushes to `master` run `.github/workflows/pages.yml`. In the repository, set **Settings → Pages → Source** to **GitHub Actions**.
