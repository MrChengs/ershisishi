import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClaimCard } from "@/components/ClaimCard";
import { RelationGraph } from "@/components/RelationGraph";
import {
  claimsForEvent,
  getEvent,
  getPath,
  nodeLabel,
  pathEvents,
} from "@/data/graph";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return pathEvents.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return { title: "未找到" };
  return { title: event.nameZh };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();
  const related = claimsForEvent(slug);
  const parentPaths = event.pathIds
    .map((id) => getPath(id))
    .filter((path): path is NonNullable<typeof path> => Boolean(path));

  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <p className="font-serif-sc text-xs tracking-[0.3em] text-cinnabar">
        {parentPaths.map((path) => (
          <Link key={path.id} href={`/paths/${path.id}`} className="hover:text-ink">
            {path.titleZh}
          </Link>
        ))}
        {" · 事件 · "}
        {event.yearApprox}
      </p>
      <h1 className="mt-3 font-serif-sc text-5xl tracking-[0.28em]">{event.nameZh}</h1>
      <p className="mt-3 font-serif italic text-ink-muted">{event.nameEn}</p>
      <p className="mt-6 leading-8">{event.noteZh}</p>
      <h2 className="mt-10 font-serif-sc text-sm tracking-[0.3em] text-cinnabar">
        关系
      </h2>
      <div className="mt-4">
        <RelationGraph
          layout="event"
          claims={related}
          extraNodes={[
            {
              id: `event:${event.slug}`,
              kind: "event" as const,
              slug: event.slug,
              label: event.nameZh,
              href: `/event/${event.slug}`,
            },
            ...related.flatMap((claim) => {
              const nodes = [];
              if (claim.fromKind === "person") {
                nodes.push({
                  id: `person:${claim.from}`,
                  kind: "person" as const,
                  slug: claim.from,
                  label: nodeLabel("person", claim.from),
                  href: `/people/${claim.from}`,
                });
              }
              if (claim.toKind === "person") {
                nodes.push({
                  id: `person:${claim.to}`,
                  kind: "person" as const,
                  slug: claim.to,
                  label: nodeLabel("person", claim.to),
                  href: `/people/${claim.to}`,
                });
              }
              return nodes;
            }),
          ]}
        />
      </div>
      <div className="hairline my-10" />
      <h2 className="font-serif-sc text-sm tracking-[0.3em] text-cinnabar">
        指向此事的主张
      </h2>
      {related.length === 0 ? (
        <p className="mt-6 text-ink-muted">此事已挂在路径下，主张尚未抽出。</p>
      ) : (
        <div className="mt-6 space-y-4">
          {related.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      )}
    </article>
  );
}
