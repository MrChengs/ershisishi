import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-ink-muted sm:flex-row sm:items-end sm:justify-between">
        <p className="font-serif-sc">工作稿 · 有出处 · 非定论</p>
        <p className="font-serif">
          <Link href="/about" className="hover:text-cinnabar">
            关于
          </Link>
          <span className="mx-2">/</span>
          <Link href="/paths" className="hover:text-cinnabar">
            路径
          </Link>
          <span className="mx-2">/</span>
          <Link href="/timeline" className="hover:text-cinnabar">
            年表
          </Link>
        </p>
      </div>
    </footer>
  );
}
