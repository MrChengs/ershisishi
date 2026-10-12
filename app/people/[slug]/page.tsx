import Link from "next/link";
import { ClaimCard } from "@/components/ClaimCard";
import { getPerson, pathPeople, claimsForPerson, comparePairs, getPath } from "@/data/graph";
import { getPerson as getHistorian, people as historians } from "@/data/people";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  const graph = pathPeople.map((person) => ({ slug: person.slug }));
  const hist = historians
    .filter((person) => !pathPeople.some((g) => g.slug === person.slug))
    .map((person) => ({ slug: person.slug }));
  return [...graph, ...hist];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const person = getPerson(slug) ?? getHistorian(slug);
  if (!person) return { title: "未找到" };
  return { title: person.nameZh };
}

export default async function PersonPage({ params }: Props) {
  const { slug } = await params;
  const graphPerson = getPerson(slug);
  if (graphPerson) {
    const relatedClaims = claimsForPerson(slug);
    const pairs = comparePairs.filter((pair) =>
      pair.focusPersonSlugs.includes(slug),
    );
    return (
      <article className="mx-auto max-w-3xl px-5 py-12">
        <p className="font-serif-sc text-xs tracking-[0.3em] text-cinnabar">
          {graphPerson.pathIds.map((pathId) => (
            <Link key={pathId} href={`/paths/${pathId}`} className="mr-3 hover:text-ink">
              {getPath(pathId)?.titleZh ?? pathId}
            </Link>
          ))}
          · 人物
        </p>
        <h1 className="mt-3 font-serif-sc text-5xl tracking-[0.28em]">
          {graphPerson.nameZh}
        </h1>
        <p className="mt-3 font-serif text-lg italic text-ink-muted">
          {graphPerson.nameEn} · {graphPerson.pinyin} · {graphPerson.years}
        </p>
        <p className="mt-6 leading-8">{graphPerson.noteZh}</p>
        {pairs.length > 0 ? (
          <p className="mt-4 text-sm">
            对读：{" "}
            {pairs.map((pair) => (
              <Link
                key={pair.id}
                href={`/compare/${pair.id}`}
                className="mr-3 text-cinnabar"
              >
                {pair.titleZh}
              </Link>
            ))}
          </p>
        ) : null}
        <div className="hairline my-10" />
        <h2 className="font-serif-sc text-sm tracking-[0.3em] text-cinnabar">
          主张（自我网络）
        </h2>
        <div className="mt-6 space-y-4">
          {relatedClaims.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      </article>
    );
  }

  const historian = getHistorian(slug);
  if (!historian) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <p className="font-serif-sc text-xs tracking-[0.3em] text-cinnabar">
        {historian.role} · {historian.dynasty}
      </p>
      <h1 className="mt-3 font-serif-sc text-5xl tracking-[0.28em]">
        {historian.nameZh}
      </h1>
      <p className="mt-3 font-serif text-lg italic text-ink-muted">
        {historian.nameEn} · {historian.years}
      </p>
      {historian.chapters?.length ? (
        <p className="mt-4 font-serif-sc text-sm leading-8">
          {historian.chapters.map((chapter) => (
            <span key={`${chapter.bookSlug}-${chapter.chapter}`} className="mr-4">
              {chapter.chapter}
            </span>
          ))}
        </p>
      ) : null}
      <div className="hairline my-10" />
      <p className="leading-8">{historian.summaryZh}</p>
    </article>
  );
}
