import type { Metadata } from "next";
import Link from "next/link";
import { booksForPath, historyPaths, workTitle } from "@/data/graph";

export const metadata: Metadata = {
  title: "路径",
  description: "二十四史的工作路径。楚汉是其中一条。",
};

export default function PathsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="font-serif text-xs tracking-[0.35em] text-cinnabar uppercase">
        Paths
      </p>
      <h1 className="mt-3 font-serif-sc text-4xl tracking-[0.28em]">路径</h1>
      <p className="mt-4 max-w-2xl leading-8">
        路径是二十四史的切片，不是一部书的别名。楚汉是正在提取的一条；其余各史先占位，尚未抽边。
      </p>
      <ul className="mt-10 grid gap-4 md:grid-cols-2">
        {historyPaths.map((path) => {
          const pathBooks = booksForPath(path);
          return (
            <li key={path.id}>
              <Link
                href={`/paths/${path.id}`}
                className="paper-card block rounded-sm p-5"
              >
                <p className="font-serif-sc text-xs tracking-[0.3em] text-cinnabar">
                  {path.status === "extracting" ? "提取中" : "待提取"}
                </p>
                <h2 className="mt-2 font-serif-sc text-2xl tracking-widest">
                  {path.titleZh}
                </h2>
                <p className="mt-1 font-serif text-sm italic text-ink-muted">
                  {path.titleEn}
                </p>
                <p className="mt-3 text-sm leading-7 text-ink/80">{path.summaryZh}</p>
                <p className="mt-3 font-serif-sc text-sm text-ink-muted">
                  {pathBooks.map((book) => workTitle[book.slug]).join(" · ")}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
