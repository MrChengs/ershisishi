import "server-only";

import type { Article, Book, Person } from "./types";
import { articles } from "./articles";
import { books, getBook } from "./books";
import { getPerson, people } from "./people";

export function relatedBooks(slugs: string[]): Book[] {
  return slugs.map(getBook).filter((book): book is Book => Boolean(book));
}

export function relatedPeople(slugs: string[]): Person[] {
  return slugs
    .map(getPerson)
    .filter((person): person is Person => Boolean(person));
}

export function relatedArticles(slugs: string[]): Article[] {
  return slugs
    .map((slug) => articles.find((article) => article.slug === slug))
    .filter((article): article is Article => Boolean(article));
}

export function peopleForBook(slug: string): Person[] {
  return people.filter((person) => person.bookSlugs.includes(slug));
}

export { articles, books, people };
