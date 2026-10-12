import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClaimCard } from "@/components/ClaimCard";
import { getBook } from "@/data/books";
import {
  claimsForJuan,
  getJuan,
  juanStaticParams,
  pathPeople,
  workTitle,
} from "@/data/graph";

type Props = { params: Promise<{ work: string; n: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return juanStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { work, n } = await params;
  const book = getBook(work);
  if (!book) return { title: "未找到" };
  const juan = getJuan(book.slug, Number(n));
  if (!juan) return { title: "未找到" };
  return { title: `${workTitle[juan.work]} · ${juan.titleZh}` };
}

export default async function JuanPage({ params }: Props) {
  const { work, n } = await params;
  const book = getBook(work);
  if (!book) notFound();
  const juan = getJuan(book.slug, Number(n));
  if (!juan) notFound();
  const related = claimsForJuan(juan.work, juan.number);

  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <p className="font-serif-sc text-xs tracking-[0.3em] text-cinnabar">
        {workTitle[juan.work]} · 第 {juan.number} 卷 · {juan.type} · {juan.extraction}
      </p>
      <h1 className="mt-3 font-serif-sc text-4xl tracking-[0.28em]">{juan.titleZh}</h1>
      <p className="mt-6 leading-8">{juan.abstractZh}</p>
      <h2 className="mt-10 font-serif-sc text-sm tracking-[0.3em] text-cinnabar">
        封闭名单中见于此卷
      </h2>
      <p className="mt-3 font-serif-sc leading-8">
        {juan.attestedPersonSlugs.map((slug) => {
          const person = pathPeople.find((item) => item.slug === slug);
          return (
            <Link key={slug} href={`/people/${slug}`} className="mr-4 hover:text-cinnabar">
              {person?.nameZh ?? slug}
            </Link>
          );
        })}
      </p>
      <div className="hairline my-10" />
      {related.length === 0 ? (
        <p className="text-ink-muted">此卷目前只作索引，尚未提取主张。</p>
      ) : (
        <div className="space-y-4">
          {related.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      )}
    </article>
  );
}
