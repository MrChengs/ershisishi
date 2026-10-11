import Link from "next/link";

const links = [
  { href: "/search", label: "检索", en: "Search" },
  { href: "/paths", label: "路径", en: "Paths" },
  { href: "/histories", label: "书目", en: "Books" },
  { href: "/timeline", label: "年表", en: "Timeline" },
  { href: "/people", label: "人物", en: "People" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center border-2 border-seal text-[15px] font-semibold tracking-[0.2em] text-seal font-serif-sc">
            史
          </span>
          <span>
            <span className="block font-serif-sc text-lg leading-none tracking-widest">
              二十四史
            </span>
            <span className="mt-1 block font-serif text-[11px] tracking-[0.18em] text-ink-muted uppercase">
              Working graph
            </span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-1 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-serif-sc tracking-widest text-ink/80 transition-colors hover:text-cinnabar"
            >
              {link.label}
              <span className="ml-1 hidden font-serif text-[10px] uppercase tracking-wider text-ink-muted sm:inline">
                {link.en}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
