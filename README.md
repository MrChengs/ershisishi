# 二十四史 · 正史知识库

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

Any Node host that runs Next.js (Vercel, etc.):

```bash
npm run build
npm start
```
