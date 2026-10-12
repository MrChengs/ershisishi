import "server-only";

import { books } from "../books";
import { liveArray } from "@/lib/content/live";
import { loadCorpus } from "@/lib/content/load";
import type { Claim, HistoryPath, Locus, WorkId } from "./types";

export const pathPeople = liveArray(() => loadCorpus().pathPeople);
export const pathEvents = liveArray(() => loadCorpus().pathEvents);
export const pathJuans = liveArray(() => loadCorpus().pathJuans);
export const loci = liveArray(() => loadCorpus().loci);
export const claims = liveArray(() => loadCorpus().claims);
export const comparePairs = liveArray(() => loadCorpus().comparePairs);
export const corrections = liveArray(() => loadCorpus().corrections);
export const historyPaths = liveArray(() => loadCorpus().historyPaths);
export const companions = liveArray(() => loadCorpus().companions);

export const workTitle: Record<string, string> = new Proxy(
  {},
  {
    get(_target, slug) {
      if (typeof slug !== "string") return undefined;
      return (
        loadCorpus().books.find((book) => book.slug === slug)?.titleZh ?? slug
      );
    },
  },
);

export function getEdition() {
  return loadCorpus().config.edition;
}

export function getFirstEditor() {
  return loadCorpus().config.firstEditor;
}

export function getPath(id: string) {
  return historyPaths.find((path) => path.id === id);
}

export function juansForPath(pathId: string) {
  return pathJuans.filter((juan) => juan.pathIds.includes(pathId));
}

export function peopleForPath(pathId: string) {
  return pathPeople.filter((person) => person.pathIds.includes(pathId));
}

export function eventsForPath(pathId: string) {
  return pathEvents.filter((event) => event.pathIds.includes(pathId));
}

export function pairsForPath(pathId: string) {
  return comparePairs.filter((pair) => pair.pathId === pathId);
}

export function booksForPath(path: HistoryPath) {
  return path.bookSlugs
    .map((slug) => books.find((book) => book.slug === slug))
    .filter((book): book is NonNullable<typeof book> => Boolean(book));
}

export function getPerson(slug: string) {
  return pathPeople.find((person) => person.slug === slug);
}

export function getEvent(slug: string) {
  return pathEvents.find((event) => event.slug === slug);
}

export function getJuan(work: WorkId, number: number) {
  return pathJuans.find((juan) => juan.work === work && juan.number === number);
}

export function juanStaticParams() {
  const aliases = Object.entries(loadCorpus().config.bookSlugAliases ?? {});
  const params: { work: string; n: string }[] = [];
  for (const juan of pathJuans) {
    params.push({ work: juan.work, n: String(juan.number) });
    for (const [from, to] of aliases) {
      if (to === juan.work) {
        params.push({ work: from, n: String(juan.number) });
      }
    }
  }
  return params;
}

export function getLocus(id: string) {
  return loci.find((locus) => locus.id === id);
}

export function getClaim(id: string) {
  return claims.find((claim) => claim.id === id);
}

export function getPair(id: string) {
  return comparePairs.find((pair) => pair.id === id);
}

export function nodeLabel(kind: "person" | "event", slug: string) {
  if (kind === "person") return getPerson(slug)?.nameZh ?? slug;
  return getEvent(slug)?.nameZh ?? slug;
}

export function claimsForPerson(slug: string): Claim[] {
  return claims.filter(
    (claim) =>
      (claim.fromKind === "person" && claim.from === slug) ||
      (claim.toKind === "person" && claim.to === slug),
  );
}

export function claimsForEvent(slug: string): Claim[] {
  return claims.filter(
    (claim) =>
      claim.eventSlug === slug ||
      (claim.fromKind === "event" && claim.from === slug) ||
      (claim.toKind === "event" && claim.to === slug),
  );
}

export function claimsForPath(pathId: string): Claim[] {
  const people = new Set(peopleForPath(pathId).map((person) => person.slug));
  const events = new Set(eventsForPath(pathId).map((event) => event.slug));
  const inPath = (kind: "person" | "event", slug: string) =>
    kind === "person" ? people.has(slug) : events.has(slug);
  return claims.filter(
    (claim) => inPath(claim.fromKind, claim.from) && inPath(claim.toKind, claim.to),
  );
}

export function claimsForJuan(work: WorkId, number: number): Claim[] {
  const ids = new Set(
    loci
      .filter((locus) => locus.text === work && locus.juan === number)
      .map((locus) => locus.id),
  );
  return claims.filter((claim) => claim.locusIds.some((id) => ids.has(id)));
}

export function resolveLoci(ids: string[]): Locus[] {
  return ids
    .map(getLocus)
    .filter((locus): locus is Locus => Boolean(locus));
}

export function isWorkId(text: string): text is WorkId {
  return books.some((book) => book.slug === text);
}

export function juanHref(work: WorkId, number: number) {
  return `/juan/${work}/${number}`;
}

export function juanLabel(work: WorkId, number: number) {
  const juan = getJuan(work, number);
  return `${workTitle[work] ?? work} ${number} ${juan?.titleZh ?? ""}`.trim();
}

export type { Claim, Correction, HistoryPath, Locus, WorkId } from "./types";
