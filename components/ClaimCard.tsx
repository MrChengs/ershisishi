import Link from "next/link";
import {
  isWorkId,
  juanHref,
  juanLabel,
  nodeLabel,
  resolveLoci,
  type Claim,
} from "@/data/graph";

export function ClaimCard({ claim }: { claim: Claim }) {
  const loci = resolveLoci(claim.locusIds);
  const companions = resolveLoci(claim.companionLocusIds);
  const fromHref =
    claim.fromKind === "person" ? `/people/${claim.from}` : `/event/${claim.from}`;
  const toHref =
    claim.toKind === "person" ? `/people/${claim.to}` : `/event/${claim.to}`;

  return (
    <article className="paper-card rounded-sm p-5">
      <p className="font-serif-sc text-xs tracking-[0.3em] text-cinnabar">
        {claim.type} · {claim.status} · {claim.editor}
      </p>
      <p className="mt-3 font-serif-sc text-xl tracking-widest">
        <Link href={fromHref} className="hover:text-cinnabar">
          {nodeLabel(claim.fromKind, claim.from)}
        </Link>
        <span className="mx-2 text-ink-muted">→</span>
        <Link href={toHref} className="hover:text-cinnabar">
          {nodeLabel(claim.toKind, claim.to)}
        </Link>
      </p>
      {claim.eventSlug ? (
        <p className="mt-2 text-sm text-ink-muted">
          事在{" "}
          <Link href={`/event/${claim.eventSlug}`} className="hover:text-cinnabar">
            {nodeLabel("event", claim.eventSlug)}
          </Link>
        </p>
      ) : null}
      <ul className="mt-4 space-y-3">
        {loci.map((locus) => (
          <li key={locus.id} className="border-t border-line pt-3 text-sm leading-7">
            <Link
              href={isWorkId(locus.text) ? juanHref(locus.text, locus.juan) : "/paths"}
              className="font-serif-sc text-cinnabar"
            >
              {isWorkId(locus.text)
                ? juanLabel(locus.text, locus.juan)
                : `${locus.juanTitle} ${locus.juan}`}
            </Link>
            <span className="ml-2 text-xs text-ink-muted">
              {locus.layer} · {locus.edition}
              {locus.pageUnverified ? " · 页码待核" : ` · ${locus.page}页`}
            </span>
            <p className="mt-1 text-ink/85">「{locus.excerpt}」</p>
          </li>
        ))}
        {companions.map((locus) => (
          <li key={locus.id} className="border-t border-dashed border-line pt-3 text-sm leading-7">
            <p className="font-serif-sc text-ink-muted">
              互证 · {locus.juanTitle} {locus.juan}
            </p>
            <p className="mt-1 text-ink/75">「{locus.excerpt}」</p>
          </li>
        ))}
      </ul>
    </article>
  );
}
