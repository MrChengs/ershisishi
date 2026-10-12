import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClaimCard } from "@/components/ClaimCard";
import {
  claimsForJuan,
  comparePairs,
  getPair,
  juanHref,
  juanLabel,
} from "@/data/graph";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return comparePairs.map((pair) => ({ id: pair.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const pair = getPair(id);
  if (!pair) return { title: "未找到" };
  return { title: pair.titleZh };
}

export default async function ComparePage({ params }: Props) {
  const { id } = await params;
  const pair = getPair(id);
  if (!pair) notFound();
  const left = claimsForJuan(pair.left.work, pair.left.number);
  const right = claimsForJuan(pair.right.work, pair.right.number);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="font-serif-sc text-xs tracking-[0.3em] text-cinnabar">对读</p>
      <h1 className="mt-3 font-serif-sc text-3xl tracking-[0.2em]">{pair.titleZh}</h1>
      {pair.slice ? (
        <p className="mt-2 text-sm text-ink-muted">切片：{pair.slice}</p>
      ) : null}
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <Column
          href={juanHref(pair.left.work, pair.left.number)}
          title={juanLabel(pair.left.work, pair.left.number)}
          claims={left}
        />
        <Column
          href={juanHref(pair.right.work, pair.right.number)}
          title={juanLabel(pair.right.work, pair.right.number)}
          claims={right}
        />
      </div>
    </div>
  );
}

function Column({
  href,
  title,
  claims,
}: {
  href: string;
  title: string;
  claims: ReturnType<typeof claimsForJuan>;
}) {
  return (
    <section>
      <Link href={href} className="font-serif-sc text-lg tracking-widest hover:text-cinnabar">
        {title}
      </Link>
      <div className="mt-4 space-y-4">
        {claims.length === 0 ? (
          <p className="text-sm text-ink-muted">此侧尚无抽出的主张。</p>
        ) : (
          claims.map((claim) => <ClaimCard key={claim.id} claim={claim} />)
        )}
      </div>
    </section>
  );
}
