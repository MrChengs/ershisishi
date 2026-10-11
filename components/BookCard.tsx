import Link from "next/link";
import type { Book } from "@/data/types";

export function BookCard({ book }: { book: Book }) {
  return (
    <Link
      href={`/histories/${book.slug}`}
      className="paper-card group block rounded-sm p-5 transition-transform hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-serif text-xs tracking-[0.25em] text-cinnabar">
          {String(book.order).padStart(2, "0")}
        </p>
        <p className="font-serif text-xs text-ink-muted">{book.juan} 卷</p>
      </div>
      <h3 className="mt-3 font-serif-sc text-2xl tracking-widest">{book.titleZh}</h3>
      <p className="mt-1 font-serif text-sm italic text-ink-muted">{book.titleEn}</p>
      <p className="mt-4 text-sm leading-7 text-ink/80">
        {book.compilers.map((compiler) => compiler.zh).join("、")} · {book.compiledDynasty}
      </p>
      <p className="mt-1 text-sm text-ink-muted">记 {book.covers}</p>
    </Link>
  );
}
