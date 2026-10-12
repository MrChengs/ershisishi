import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchBox } from "@/components/SearchBox";
import { SearchResults } from "@/components/SearchResults";
import { allSearchRecords } from "@/data/search";

export const metadata: Metadata = {
  title: "检索",
  description: "检索二十四史书目、人物与知识条目。",
};

export default function SearchPage() {
  const index = allSearchRecords();

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
        <SearchBox large />
        <Suspense
          fallback={<p className="mt-6 text-sm text-ink-muted">检索中……</p>}
        >
          <SearchResults index={index} />
        </Suspense>
      </div>
    </div>
  );
}
