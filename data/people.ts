import "server-only";

import { liveArray } from "@/lib/content/live";
import { loadCorpus } from "@/lib/content/load";
import type { Person } from "./types";

export const people = liveArray(() => loadCorpus().people);

export const historians = liveArray(() =>
  loadCorpus().people.filter((person) => person.role === "史家"),
);

export function getPerson(slug: string) {
  return loadCorpus().people.find((person) => person.slug === slug);
}

export function peopleByRole(role: Person["role"]) {
  return loadCorpus().people.filter((person) => person.role === role);
}
