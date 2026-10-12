import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RelatedList } from "@/components/RelatedList";
import { bookSlugParams, getBook } from "@/data/books";
import { relatedArticles, relatedBooks, relatedPeople, peopleForBook } from "@/data/index";
import { articles } from "@/data/articles";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return bookSlugParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) return { title: "未找到" };
  return {
    title: book.titleZh,
    description: book.summaryZh.slice(0, 140),
  };
}

export default async function BookPage({ params }: Props) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();

  const linkedPeople = [
    ...relatedPeople(book.relatedPersonSlugs),
    ...peopleForBook(book.slug).filter(
      (person) => !book.relatedPersonSlugs.includes(person.slug),
    ),
  ];
  const linkedBooks = relatedBooks(book.relatedBookSlugs);
  const linkedArticles = relatedArticles(
    articles
      .filter((article) => article.relatedBookSlugs.includes(book.slug))
      .map((article) => article.slug),
  );

  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <p className="font-serif text-xs tracking-[0.3em] text-cinnabar">
        {String(book.order).padStart(2, "0")} / 24 · {book.group}
      </p>
      <h1 className="mt-3 font-serif-sc text-5xl tracking-[0.28em]">{book.titleZh}</h1>
      <p className="mt-3 font-serif text-lg italic text-ink-muted">
        {book.titleEn} · {book.pinyin}
      </p>

      <dl className="mt-8 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
        <Meta label="撰者" value={book.compilers.map((c) => c.zh).join("、")} />
        <Meta label="成书" value={`${book.compiledDynasty} ${book.compiledYear}`} />
        <Meta label="卷数" value={`${book.juan} 卷 · ${book.genre}`} />
        <Meta label="记载" value={`${book.covers}（${book.yearsCovered}）`} />
      </dl>

      <div className="hairline my-10" />

      <p className="text-base leading-8">{book.summaryZh}</p>
      <p className="mt-4 font-serif text-sm leading-7 italic text-ink-muted">
        {book.summaryEn}
      </p>

      <h2 className="mt-12 font-serif-sc text-sm tracking-[0.3em] text-cinnabar">
        体例
      </h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {book.structure.map((item) => (
          <li
            key={item.name}
            className="flex items-baseline justify-between border border-line bg-white/40 px-4 py-3"
          >
            <span className="font-serif-sc">
              {item.name}
              {item.note ? (
                <span className="ml-2 text-xs text-ink-muted">{item.note}</span>
              ) : null}
            </span>
            <span className="font-serif text-sm">{item.count}</span>
          </li>
        ))}
      </ul>

      <h2 className="mt-12 font-serif-sc text-sm tracking-[0.3em] text-cinnabar">
        识要
      </h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 leading-8">
        {book.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>

      <div className="mt-14">
        <RelatedList
          books={linkedBooks}
          people={linkedPeople}
          articles={linkedArticles}
        />
      </div>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-line pt-3">
      <dt className="text-xs tracking-widest text-ink-muted">{label}</dt>
      <dd className="mt-1 font-serif-sc leading-6">{value}</dd>
    </div>
  );
}
