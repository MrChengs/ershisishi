import "server-only";

import { liveArray } from "@/lib/content/live";
import { loadCorpus } from "@/lib/content/load";
import type { Book } from "./types";

export const books = liveArray(() => loadCorpus().books);

export const bookGroups = liveArray(() => loadCorpus().config.bookGroups);

export function getBook(slug: string) {
  const corpus = loadCorpus();
  const canonical = corpus.config.bookSlugAliases?.[slug] ?? slug;
  return corpus.books.find((book) => book.slug === canonical);
}

export function bookSlugParams() {
  const corpus = loadCorpus();
  const slugs = new Set(corpus.books.map((book) => book.slug));
  for (const alias of Object.keys(corpus.config.bookSlugAliases ?? {})) {
    slugs.add(alias);
  }
  return [...slugs].map((slug) => ({ slug }));
}

export function totalJuan() {
  return loadCorpus().books.reduce((sum, book) => sum + book.juan, 0);
}

export function booksByWrittenStart(): Book[] {
  const { books, config } = loadCorpus();
  return [...books].sort((left, right) => {
    const startLeft =
      config.writtenStart[left.slug] ??
      config.compiledYear[left.slug] ??
      left.yearEnd;
    const startRight =
      config.writtenStart[right.slug] ??
      config.compiledYear[right.slug] ??
      right.yearEnd;
    if (startLeft !== startRight) return startLeft - startRight;
    return left.order - right.order;
  });
}

export type { Book };
