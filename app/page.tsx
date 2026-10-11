import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";
import { booksForPath, historyPaths, workTitle } from "@/data/graph";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="font-serif text-xs tracking-[0.35em] text-cinnabar uppercase">
        Working graph
      </p>
      <h1 className="mt-4 font-serif-sc text-5xl font-semibold tracking-[0.28em] sm:text-6xl">
        二十四史
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-8">
        路径切开二十四史。一条路径是大题（楚汉相争），里面再含较小的事件（垓下之战）。边指向卷与段落。
      </p>
      <div className="mt-8 max-w-lg">
        <SearchBox large />
      </div>
      <div className="mt-6 font-serif-sc text-sm">
        <Link href="/paths" className="text-cinnabar">
          全部路径 →
        </Link>
        <span className="mx-3 text-ink-muted">/</span>
        <Link href="/timeline" className="text-cinnabar">
          年表 →
        </Link>
      </div>

      <section className="mt-16">
        <h2 className="font-serif-sc text-sm tracking-[0.3em] text-cinnabar">路径</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {historyPaths.map((path) => (
            <li key={path.id}>
              <Link
                href={`/paths/${path.id}`}
                className="paper-card block rounded-sm px-5 py-4"
              >
                <span className="font-serif-sc text-xs tracking-[0.25em] text-cinnabar">
                  {path.status === "extracting" ? "提取中" : "待提取"}
                </span>
                <span className="mt-1 block font-serif-sc text-xl tracking-widest">
                  {path.titleZh}
                </span>
                <span className="mt-2 block text-sm text-ink-muted">
                  {booksForPath(path)
                    .map((book) => workTitle[book.slug])
                    .join(" · ")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
