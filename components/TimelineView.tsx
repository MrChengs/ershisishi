"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Book } from "@/data/types";

type Mode = "coverage" | "compiled";

const RANGE_START = -2600;
const RANGE_END = 1800;
const SPAN = RANGE_END - RANGE_START;

function leftPct(year: number) {
  return ((year - RANGE_START) / SPAN) * 100;
}

function widthPct(start: number, end: number) {
  return ((end - start) / SPAN) * 100;
}

export function TimelineView({
  books,
  compiledYear,
  writtenStart,
}: {
  books: Book[];
  compiledYear: Record<string, number>;
  writtenStart: Record<string, number>;
}) {
  const [mode, setMode] = useState<Mode>("coverage");

  const rows = useMemo(() => {
    const ranked = [...books].sort((left, right) => {
      const startLeft =
        writtenStart[left.slug] ?? compiledYear[left.slug] ?? left.yearEnd;
      const startRight =
        writtenStart[right.slug] ?? compiledYear[right.slug] ?? right.yearEnd;
      if (startLeft !== startRight) return startLeft - startRight;
      return left.order - right.order;
    });
    return ranked.map((book) => {
      if (mode === "coverage") {
        return {
          book,
          start: book.yearStart,
          end: book.yearEnd,
        };
      }
      const year = compiledYear[book.slug] ?? book.yearEnd;
      return { book, start: year, end: year + 20 };
    });
  }, [books, compiledYear, mode, writtenStart]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <ModeButton active={mode === "coverage"} onClick={() => setMode("coverage")}>
          记载范围
        </ModeButton>
        <ModeButton active={mode === "compiled"} onClick={() => setMode("compiled")}>
          成书时间
        </ModeButton>
      </div>

      <div className="mt-6 overflow-x-auto">
        <div className="min-w-[720px]">
          <Scale />
          <div className="mt-4 space-y-2">
            {rows.map(({ book, start, end }) => (
              <BookRow key={book.slug} book={book} start={start} end={end} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-3 py-1.5 font-serif-sc text-sm tracking-widest ${
        active
          ? "border-cinnabar bg-cinnabar text-paper"
          : "border-line bg-white/40 text-ink hover:border-cinnabar"
      }`}
    >
      {children}
    </button>
  );
}

function Scale() {
  const ticks = [
    { year: -2000, label: "前2000" },
    { year: -221, label: "秦" },
    { year: 220, label: "汉末" },
    { year: 618, label: "唐" },
    { year: 960, label: "宋" },
    { year: 1368, label: "明" },
    { year: 1644, label: "1644" },
  ];
  return (
    <div className="relative h-8 border-b border-line">
      {ticks.map((tick) => (
        <span
          key={tick.year}
          className="absolute -translate-x-1/2 font-serif text-[11px] text-ink-muted"
          style={{ left: `${leftPct(tick.year)}%` }}
        >
          {tick.label}
        </span>
      ))}
    </div>
  );
}

function BookRow({
  book,
  start,
  end,
}: {
  book: Book;
  start: number;
  end: number;
}) {
  return (
    <div className="grid grid-cols-[7rem_1fr] items-center gap-3">
      <Link
        href={`/histories/${book.slug}`}
        className="font-serif-sc text-sm tracking-widest hover:text-cinnabar"
      >
        {book.titleZh}
      </Link>
      <div className="relative h-7 bg-paper-deep/40">
        <Link
          href={`/histories/${book.slug}`}
          title={`${book.titleZh} ${start}–${end}`}
          className="absolute top-1 h-5 bg-cinnabar/75 hover:bg-cinnabar"
          style={{
            left: `${leftPct(start)}%`,
            width: `${Math.max(widthPct(start, end), 0.8)}%`,
          }}
        />
      </div>
    </div>
  );
}
