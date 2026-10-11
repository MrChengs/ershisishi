"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function SearchBox({
  initial = "",
  large = false,
}: {
  initial?: string;
  large?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initial);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const q = value.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full gap-2">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="韩信、鸿门、淮阴侯……"
        className={`w-full border border-line bg-white/50 px-4 font-serif-sc outline-none ring-cinnabar/20 placeholder:text-ink-muted focus:ring-2 ${
          large ? "h-12 text-base" : "h-10 text-sm"
        }`}
      />
      <button
        type="submit"
        className={`border border-cinnabar bg-cinnabar px-4 font-serif-sc tracking-widest text-paper transition-opacity hover:opacity-90 ${
          large ? "h-12" : "h-10"
        }`}
      >
        检索
      </button>
    </form>
  );
}
