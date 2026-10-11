import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/data/articles";

export const metadata: Metadata = {
  title: "知识",
  description: "二十四史的体例、官修传统与阅读门径。",
};

export default function KnowledgePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="font-serif text-xs tracking-[0.35em] text-cinnabar uppercase">
        Knowledge
      </p>
      <h1 className="mt-3 font-serif-sc text-4xl tracking-[0.28em]">知识</h1>
      <p className="mt-4 max-w-2xl leading-8 text-ink/80">
        书目之外的义理层：这套书是什么、怎么写成、怎么读、本站如何增补。
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/knowledge/${article.slug}`}
            className="paper-card block rounded-sm p-6"
          >
            <p className="font-serif-sc text-xs tracking-[0.3em] text-cinnabar">
              {article.kicker}
            </p>
            <h2 className="mt-2 font-serif-sc text-2xl tracking-widest">
              {article.titleZh}
            </h2>
            <p className="mt-1 font-serif text-sm italic text-ink-muted">
              {article.titleEn}
            </p>
            <p className="mt-4 leading-7 text-ink/80">{article.summaryZh}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
