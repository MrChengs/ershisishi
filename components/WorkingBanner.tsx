export function WorkingBanner() {
  return (
    <div className="border-b border-cinnabar/25 bg-cinnabar/8">
      <p className="mx-auto max-w-6xl px-5 py-2 font-serif-sc text-sm tracking-wide text-cinnabar">
        工作稿 · 有出处 · 非定论
        <span className="ml-3 hidden font-serif text-xs italic text-ink-muted sm:inline">
          A sourced working graph. It's a work in progress.
        </span>
      </p>
    </div>
  );
}
