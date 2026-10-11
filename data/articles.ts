import "server-only";

import { liveArray } from "@/lib/content/live";
import { loadCorpus } from "@/lib/content/load";

export const articles = liveArray(() => loadCorpus().articles);

export function getArticle(slug: string) {
  return loadCorpus().articles.find((article) => article.slug === slug);
}
