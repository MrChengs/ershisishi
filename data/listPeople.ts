import "server-only";

import { liveArray } from "@/lib/content/live";
import { loadCorpus } from "@/lib/content/load";
import type { GraphPerson } from "./graph/types";
import { pathPeople } from "./graph";
import { people } from "./people";

export const dynastyOrder = liveArray(() => loadCorpus().config.dynastyOrder);

export type ListedPerson = {
  slug: string;
  nameZh: string;
  nameEn: string;
  years: string;
  dynasty: string;
  kind: string;
};

export function allRelatedPeople(): ListedPerson[] {
  const fromPath: ListedPerson[] = pathPeople.map((person) => ({
    slug: person.slug,
    nameZh: person.nameZh,
    nameEn: person.nameEn,
    years: person.years,
    dynasty: person.dynasty,
    kind: "路径",
  }));
  const seen = new Set(fromPath.map((person) => person.slug));
  const rest: ListedPerson[] = people
    .filter((person) => !seen.has(person.slug))
    .map((person) => ({
      slug: person.slug,
      nameZh: person.nameZh,
      nameEn: person.nameEn,
      years: person.years,
      dynasty: person.dynasty,
      kind: person.role,
    }));
  return [...fromPath, ...rest];
}

export function groupPeopleByDynasty(list: ListedPerson[]) {
  const buckets = new Map<string, ListedPerson[]>();
  for (const dynasty of dynastyOrder) buckets.set(dynasty, []);
  for (const person of list) {
    if (!buckets.has(person.dynasty)) buckets.set(person.dynasty, []);
    buckets.get(person.dynasty)!.push(person);
  }
  return [...buckets.entries()].filter(([, members]) => members.length > 0);
}

export function groupPathPeople(list: GraphPerson[]) {
  return groupPeopleByDynasty(
    list.map((person) => ({
      slug: person.slug,
      nameZh: person.nameZh,
      nameEn: person.nameEn,
      years: person.years,
      dynasty: person.dynasty,
      kind: "路径",
    })),
  );
}
