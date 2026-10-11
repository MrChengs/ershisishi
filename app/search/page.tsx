import type { Metadata } from "next";
import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";
import { searchKnowledge } from "@/data/search";

export const metadata: Metadata = {
  title: "检索",
  description: "检索二十四史书目、人物与知识条目。",
};

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const hits = searchKnowledge(q);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="font-serif text-xs tracking-[0.35em] text-cinnabar uppercase">
        Search
      </p>
      <h1 className="mt-3 font-serif-sc text-4xl tracking-[0.28em]">检索</h1>
      <p className="mt-4 leading-8 text-ink/80">
        在书名、史家、纪传人物与知识短文中查找。目前为本地全文匹配，便于离线维护。
      </p>
      <div className="mt-8">
        <SearchBox initial={q} large />
        {q ? (
          <p className="mt-6 text-sm text-ink-muted">
            「{q}」共 {hits.length} 条
          </p>
        ) : (
          <p className="mt-6 text-sm text-ink-muted">试一试：韩信、鸿门、项羽本纪</p>
        )}
        <ul className="mt-4 space-y-3">
          {hits.map((hit) => (
            <li key={`${hit.kind}-${hit.slug}`} className="paper-card rounded-sm p-4">
              <p className="font-serif-sc text-xs tracking-[0.3em] text-cinnabar">
                {hit.kind}
              </p>
              <Link
                href={hit.href}
                className="mt-1 block font-serif-sc text-xl tracking-widest"
              >
                {hit.titleZh}
                <span className="ml-2 font-serif text-sm italic text-ink-muted">
                  {hit.titleEn}
                </span>
              </Link>
              <p className="mt-2 text-sm leading-7 text-ink/75">{hit.snippet}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
