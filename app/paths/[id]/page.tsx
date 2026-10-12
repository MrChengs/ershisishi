import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  booksForPath,
  claimsForPath,
  eventsForPath,
  getPath,
  historyPaths,
  juansForPath,
  pairsForPath,
  peopleForPath,
  workTitle,
} from "@/data/graph";
import { RelationGraph } from "@/components/RelationGraph";
import { groupPathPeople } from "@/data/listPeople";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return historyPaths.map((path) => ({ id: path.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const path = getPath(id);
  if (!path) return { title: "未找到" };
  return { title: path.titleZh };
}

export default async function PathPage({ params }: Props) {
  const { id } = await params;
  const path = getPath(id);
  if (!path) notFound();

  const pathBooks = booksForPath(path);
  const juans = juansForPath(path.id);
  const people = peopleForPath(path.id);
  const events = eventsForPath(path.id);
  const pairs = pairsForPath(path.id);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="font-serif-sc text-xs tracking-[0.3em] text-cinnabar">
        <Link href="/paths" className="hover:text-ink">
          路径
        </Link>
        {" · "}
        {path.status === "extracting" ? "提取中" : "待提取"}
        {path.closedWorld ? " · 封闭名单" : ""}
      </p>
      <h1 className="mt-3 font-serif-sc text-4xl tracking-[0.28em]">{path.titleZh}</h1>
      <p className="mt-2 font-serif italic text-ink-muted">{path.titleEn}</p>
      <p className="mt-4 max-w-2xl leading-8">{path.summaryZh}</p>
      <p className="mt-4 font-serif-sc text-sm leading-8">
        所涉正史：
        {pathBooks.map((book) => (
          <Link
            key={book.slug}
            href={`/histories/${book.slug}`}
            className="ml-3 hover:text-cinnabar"
          >
            {book.titleZh}
          </Link>
        ))}
      </p>

      <h2 className="mt-12 font-serif-sc text-sm tracking-[0.3em] text-cinnabar">
        关系
      </h2>
      <div className="mt-4">
        <RelationGraph
          layout="path"
          claims={claimsForPath(path.id)}
          extraNodes={[
            ...people.map((person) => ({
              id: `person:${person.slug}`,
              kind: "person" as const,
              slug: person.slug,
              label: person.nameZh,
              href: `/people/${person.slug}`,
            })),
            ...events.map((event) => ({
              id: `event:${event.slug}`,
              kind: "event" as const,
              slug: event.slug,
              label: event.nameZh,
              href: `/event/${event.slug}`,
            })),
          ]}
        />
      </div>

      <h2 className="mt-12 font-serif-sc text-sm tracking-[0.3em] text-cinnabar">
        所含事件
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-muted">
        路径是大题。下面每一条才是较小的事，如垓下之战。主张挂在这些事上，不直接等于整条路径。
      </p>
      {events.length > 0 ? (
        <ol className="mt-6 space-y-3">
          {events.map((event) => (
            <li key={event.slug}>
              <Link
                href={`/event/${event.slug}`}
                className="paper-card flex items-baseline justify-between gap-4 rounded-sm px-5 py-4"
              >
                <span>
                  <span className="font-serif-sc text-xl tracking-widest">
                    {event.nameZh}
                  </span>
                  <span className="mt-1 block text-sm text-ink/75">{event.noteZh}</span>
                </span>
                <span className="shrink-0 font-serif text-sm text-ink-muted">
                  {event.yearApprox}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-4 text-ink-muted">此路径尚未挂上较小事件。</p>
      )}

      {people.length > 0 ? (
        <>
          <h2 className="mt-12 font-serif-sc text-sm tracking-[0.3em] text-cinnabar">
            人物
          </h2>
          {groupPathPeople(people).map(([dynasty, members]) => (
            <div key={dynasty} className="mt-4">
              <p className="text-sm text-ink-muted">{dynasty}</p>
              <p className="mt-1 font-serif-sc leading-8">
                {members.map((person) => (
                  <Link
                    key={person.slug}
                    href={`/people/${person.slug}`}
                    className="mr-4 hover:text-cinnabar"
                  >
                    {person.nameZh}
                  </Link>
                ))}
              </p>
            </div>
          ))}
        </>
      ) : null}

      {pairs.length > 0 ? (
        <>
          <h2 className="mt-12 font-serif-sc text-sm tracking-[0.3em] text-cinnabar">
            对读
          </h2>
          <ul className="mt-4 space-y-2 font-serif-sc text-lg">
            {pairs.map((pair) => (
              <li key={pair.id}>
                <Link href={`/compare/${pair.id}`} className="hover:text-cinnabar">
                  {pair.titleZh}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {juans.length > 0 ? (
        <>
          <h2 className="mt-12 font-serif-sc text-sm tracking-[0.3em] text-cinnabar">
            卷
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {juans.map((juan) => (
              <li key={`${juan.work}-${juan.number}`}>
                <Link
                  href={`/juan/${juan.work}/${juan.number}`}
                  className="flex justify-between border border-line bg-white/40 px-4 py-3 hover:border-cinnabar"
                >
                  <span className="font-serif-sc">
                    {workTitle[juan.work]} · {juan.titleZh}
                  </span>
                  <span className="text-xs text-ink-muted">{juan.extraction}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-12 text-ink-muted">此路径尚未抽卷、抽边。正史已挂上，主张仍空。</p>
      )}
    </div>
  );
}
