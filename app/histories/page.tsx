import type { Metadata } from "next";
import { BookCard } from "@/components/BookCard";
import { booksByWrittenStart, totalJuan } from "@/data/books";
import { loadCorpus } from "@/lib/content/load";

export const metadata: Metadata = {
  title: "书目",
  description: "二十四史全部书目：作者、卷数、记载范围与成书时代。",
};

function yearLabel(year: number) {
  return year < 0 ? `前${-year}` : `${year}`;
}

export default function HistoriesPage() {
  const { config } = loadCorpus();
  const sorted = booksByWrittenStart();

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="font-serif text-xs tracking-[0.35em] text-cinnabar uppercase">
        Catalogue
      </p>
      <h1 className="mt-3 font-serif-sc text-4xl tracking-[0.28em]">书目</h1>
      <p className="mt-4 max-w-2xl leading-8 text-ink/80">
        二十四部正史，共 {totalJuan()}{" "}
        卷。按开撰先后排列（史记太初元年至明史开馆）。卡片序号仍是二十四史的传统书次。
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((book) => (
          <div key={book.slug}>
            <p className="mb-2 font-serif text-xs text-ink-muted">
              {yearLabel(config.writtenStart[book.slug] ?? config.compiledYear[book.slug])}
              年开撰
            </p>
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </div>
  );
}
