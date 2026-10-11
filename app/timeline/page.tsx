import type { Metadata } from "next";
import { TimelineView } from "@/components/TimelineView";
import { booksByWrittenStart } from "@/data/books";
import { loadCorpus } from "@/lib/content/load";

export const metadata: Metadata = {
  title: "年表",
  description: "二十四史记载范围与成书时间对照。",
};

export default function TimelinePage() {
  const corpus = loadCorpus();

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="font-serif text-xs tracking-[0.35em] text-cinnabar uppercase">
        Timeline
      </p>
      <h1 className="mt-3 font-serif-sc text-4xl tracking-[0.28em]">年表</h1>
      <p className="mt-4 max-w-2xl leading-8 text-ink/80">
        左侧书名按开撰先后排。「记载范围」看各书记了哪一段中国史；「成书时间」看这部书是什么时候写定的。两者差数百年甚至上千年，正是正史传统本身。
      </p>
      <div className="mt-10">
        <TimelineView
          books={corpus.books}
          compiledYear={corpus.config.compiledYear}
          writtenStart={corpus.config.writtenStart}
        />
      </div>
    </div>
  );
}
