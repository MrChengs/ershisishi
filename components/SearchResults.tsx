"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { SearchRecord } from "@/data/types";

export function SearchResults({ index }: { index: SearchRecord[] }) {
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim();
  const needle = q.toLowerCase();
  const hits = needle
    ? index.filter((record) => record.needle.includes(needle))
    : [];

  if (!q) {
    return <p className="mt-6 text-sm text-ink-muted">试一试：韩信、鸿门、项羽本纪</p>;
  }

  return (
    <>
      <p className="mt-6 text-sm text-ink-muted">
        「{q}」共 {hits.length} 条
      </p>
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
    </>
  );
}
