import Link from "next/link";
import type { ReactNode } from "react";
import type { Article, Book, Person } from "@/data/types";

export function RelatedList({
  books = [],
  people = [],
  articles = [],
}: {
  books?: Book[];
  people?: Person[];
  articles?: Article[];
}) {
  if (!books.length && !people.length && !articles.length) return null;

  return (
    <aside className="grid gap-8 sm:grid-cols-3">
      {books.length > 0 && (
        <RelatedColumn title="相关史书">
          {books.map((book) => (
            <Link key={book.slug} href={`/histories/${book.slug}`}>
              {book.titleZh}
              <span className="ml-2 text-ink-muted">{book.titleEn}</span>
            </Link>
          ))}
        </RelatedColumn>
      )}
      {people.length > 0 && (
        <RelatedColumn title="相关人物">
          {people.map((person) => (
            <Link key={person.slug} href={`/people/${person.slug}`}>
              {person.nameZh}
              <span className="ml-2 text-ink-muted">{person.role}</span>
            </Link>
          ))}
        </RelatedColumn>
      )}
      {articles.length > 0 && (
        <RelatedColumn title="相关知识">
          {articles.map((article) => (
            <Link key={article.slug} href={`/knowledge/${article.slug}`}>
              {article.titleZh}
            </Link>
          ))}
        </RelatedColumn>
      )}
    </aside>
  );
}

function RelatedColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h2 className="font-serif-sc text-sm tracking-[0.3em] text-cinnabar">{title}</h2>
      <div className="mt-3 flex flex-col gap-2 font-serif-sc text-base leading-7">
        {children}
      </div>
    </div>
  );
}
