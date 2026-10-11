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
import type { SearchHit } from "./types";

function haystack(parts: (string | undefined)[]) {
  return parts.filter(Boolean).join(" ").toLowerCase();
}

export function searchKnowledge(query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const hits: SearchHit[] = [];
  const seenPeople = new Set<string>();

  for (const person of pathPeople) {
    const text = haystack([person.nameZh, person.nameEn, person.pinyin, person.noteZh]);
    if (text.includes(q)) {
      seenPeople.add(person.slug);
      hits.push({
        kind: "人",
        slug: person.slug,
        href: `/people/${person.slug}`,
        titleZh: person.nameZh,
        titleEn: person.nameEn,
        snippet: person.noteZh,
      });
    }
  }

  for (const event of pathEvents) {
    const text = haystack([event.nameZh, event.nameEn, event.noteZh]);
    if (text.includes(q)) {
      hits.push({
        kind: "事",
        slug: event.slug,
        href: `/event/${event.slug}`,
        titleZh: event.nameZh,
        titleEn: event.nameEn,
        snippet: event.noteZh,
      });
    }
  }

  for (const juan of pathJuans) {
    const text = haystack([juan.titleZh, workTitle[juan.work], juan.abstractZh]);
    if (text.includes(q)) {
      hits.push({
        kind: "卷",
        slug: `${juan.work}-${juan.number}`,
        href: `/juan/${juan.work}/${juan.number}`,
        titleZh: `${workTitle[juan.work]} · ${juan.titleZh}`,
        titleEn: "",
        snippet: juan.abstractZh,
      });
    }
  }

  for (const claim of claims) {
    const text = haystack([
      claim.type,
      nodeLabel(claim.fromKind, claim.from),
      nodeLabel(claim.toKind, claim.to),
    ]);
    if (text.includes(q)) {
      hits.push({
        kind: "主张",
        slug: claim.id,
        href: `/people/${claim.fromKind === "person" ? claim.from : claim.to}`,
        titleZh: `${nodeLabel(claim.fromKind, claim.from)} ${claim.type} ${nodeLabel(claim.toKind, claim.to)}`,
        titleEn: claim.status,
        snippet: `编者 ${claim.editor}`,
      });
    }
  }

  for (const book of books) {
    const text = haystack([
      book.titleZh,
      book.titleEn,
      book.pinyin,
      book.covers,
      book.compiledDynasty,
      book.summaryZh,
    ]);
    if (text.includes(q)) {
      hits.push({
        kind: "书",
        slug: book.slug,
        href: `/histories/${book.slug}`,
        titleZh: book.titleZh,
        titleEn: book.titleEn,
        snippet: book.summaryZh.slice(0, 90) + "…",
      });
    }
  }

  for (const person of people) {
    if (seenPeople.has(person.slug)) continue;
    const text = haystack([
      person.nameZh,
      person.nameEn,
      person.pinyin,
      person.summaryZh,
    ]);
    if (text.includes(q)) {
      hits.push({
        kind: "人",
        slug: person.slug,
        href: `/people/${person.slug}`,
        titleZh: person.nameZh,
        titleEn: person.nameEn,
        snippet: person.summaryZh.slice(0, 90) + "…",
      });
    }
  }

  for (const article of articles) {
    const text = haystack([article.titleZh, article.titleEn, article.summaryZh]);
    if (text.includes(q)) {
      hits.push({
        kind: "知识",
        slug: article.slug,
        href: `/knowledge/${article.slug}`,
        titleZh: article.titleZh,
        titleEn: article.titleEn,
        snippet: article.summaryZh,
      });
    }
  }

  return hits;
}
