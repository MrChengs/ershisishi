import "server-only";

import { articles } from "./articles";
import { books } from "./books";
import {
  claims,
  nodeLabel,
  pathEvents,
  pathJuans,
  pathPeople,
  workTitle,
} from "./graph";
import { people } from "./people";
import type { SearchHit, SearchRecord } from "./types";

export type { SearchRecord };

function haystack(parts: (string | undefined)[]) {
  return parts.filter(Boolean).join(" ").toLowerCase();
}

export function allSearchRecords(): SearchRecord[] {
  const hits: SearchRecord[] = [];
  const seenPeople = new Set<string>();

  for (const person of pathPeople) {
    seenPeople.add(person.slug);
    hits.push({
      kind: "人",
      slug: person.slug,
      href: `/people/${person.slug}`,
      titleZh: person.nameZh,
      titleEn: person.nameEn,
      snippet: person.noteZh,
      needle: haystack([person.nameZh, person.nameEn, person.pinyin, person.noteZh]),
    });
  }

  for (const event of pathEvents) {
    hits.push({
      kind: "事",
      slug: event.slug,
      href: `/event/${event.slug}`,
      titleZh: event.nameZh,
      titleEn: event.nameEn,
      snippet: event.noteZh,
      needle: haystack([event.nameZh, event.nameEn, event.noteZh]),
    });
  }

  for (const juan of pathJuans) {
    hits.push({
      kind: "卷",
      slug: `${juan.work}-${juan.number}`,
      href: `/juan/${juan.work}/${juan.number}`,
      titleZh: `${workTitle[juan.work]} · ${juan.titleZh}`,
      titleEn: "",
      snippet: juan.abstractZh,
      needle: haystack([juan.titleZh, workTitle[juan.work], juan.abstractZh]),
    });
  }

  for (const claim of claims) {
    hits.push({
      kind: "主张",
      slug: claim.id,
      href: `/people/${claim.fromKind === "person" ? claim.from : claim.to}`,
      titleZh: `${nodeLabel(claim.fromKind, claim.from)} ${claim.type} ${nodeLabel(claim.toKind, claim.to)}`,
      titleEn: claim.status,
      snippet: `编者 ${claim.editor}`,
      needle: haystack([
        claim.type,
        nodeLabel(claim.fromKind, claim.from),
        nodeLabel(claim.toKind, claim.to),
      ]),
    });
  }

  for (const book of books) {
    hits.push({
      kind: "书",
      slug: book.slug,
      href: `/histories/${book.slug}`,
      titleZh: book.titleZh,
      titleEn: book.titleEn,
      snippet: book.summaryZh.slice(0, 90) + "…",
      needle: haystack([
        book.titleZh,
        book.titleEn,
        book.pinyin,
        book.covers,
        book.compiledDynasty,
        book.summaryZh,
      ]),
    });
  }

  for (const person of people) {
    if (seenPeople.has(person.slug)) continue;
    hits.push({
      kind: "人",
      slug: person.slug,
      href: `/people/${person.slug}`,
      titleZh: person.nameZh,
      titleEn: person.nameEn,
      snippet: person.summaryZh.slice(0, 90) + "…",
      needle: haystack([
        person.nameZh,
        person.nameEn,
        person.pinyin,
        person.summaryZh,
      ]),
    });
  }

  for (const article of articles) {
    hits.push({
      kind: "知识",
      slug: article.slug,
      href: `/knowledge/${article.slug}`,
      titleZh: article.titleZh,
      titleEn: article.titleEn,
      snippet: article.summaryZh,
      needle: haystack([article.titleZh, article.titleEn, article.summaryZh]),
    });
  }

  return hits;
}

export function searchKnowledge(query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return allSearchRecords()
    .filter((record) => record.needle.includes(q))
    .map(({ needle: _needle, ...hit }) => hit);
}
