import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="font-serif-sc text-xs tracking-[0.3em] text-cinnabar">404</p>
      <h1 className="mt-4 font-serif-sc text-3xl tracking-[0.28em]">未找到此条</h1>
      <p className="mt-4 leading-8 text-ink-muted">
        知识库里还没有这一页。可以从书目或检索回去。
      </p>
      <p className="mt-8 font-serif-sc">
        <Link href="/" className="text-cinnabar">
          回首页
        </Link>
        <span className="mx-3 text-ink-muted">/</span>
        <Link href="/search" className="text-cinnabar">
          检索
        </Link>
      </p>
    </div>
  );
}
