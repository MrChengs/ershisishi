import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  Claim,
  ComparePair,
  Correction,
  GraphEvent,
  GraphPerson,
  HistoryPath,
  JuanRecord,
  Locus,
} from "@/data/graph/types";
import type { Article, Book, Person } from "@/data/types";
import type { Companion, Corpus, SiteConfig } from "./types";

const CONTENT_ROOT = path.join(process.cwd(), "content");

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

function listFiles(dir: string, ext: string) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(ext))
    .map((name) => path.join(dir, name))
    .sort();
}

function parseArticleBody(markdown: string): Article["body"] {
  const sections: Article["body"] = [];
  const chunks = markdown.trim().split(/^## /m).filter(Boolean);
  for (const chunk of chunks) {
    const [headingLine, ...rest] = chunk.split(/\r?\n/);
    const heading = headingLine.trim();
    const paragraphs = rest
      .join("\n")
      .trim()
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.replace(/\s*\n\s*/g, "").trim())
      .filter(Boolean);
    if (heading) sections.push({ heading, paragraphs });
  }
  return sections;
}

function loadConfig(): SiteConfig {
  return readJson<SiteConfig>(path.join(CONTENT_ROOT, "config.json"));
}

function loadBooks(config: SiteConfig): Book[] {
  const dir = path.join(CONTENT_ROOT, config.roots.books);
  return listFiles(dir, ".json").map((file) => readJson<Book>(file));
}

function loadPeople(config: SiteConfig): Person[] {
  const dir = path.join(CONTENT_ROOT, config.roots.people);
  return listFiles(dir, ".md").map((file) => {
    const parsed = matter(fs.readFileSync(file, "utf8"));
    const data = parsed.data as Omit<Person, "summaryZh">;
    return {
      ...data,
      summaryZh: parsed.content.trim(),
    };
  });
}

function loadArticles(config: SiteConfig): Article[] {
  const dir = path.join(CONTENT_ROOT, config.roots.articles);
  return listFiles(dir, ".md").map((file) => {
    const parsed = matter(fs.readFileSync(file, "utf8"));
    const data = parsed.data as Omit<Article, "body">;
    return {
      ...data,
      body: parseArticleBody(parsed.content),
    };
  });
}

function graphFile<T>(config: SiteConfig, name: string, fallback: T): T {
  const file = path.join(CONTENT_ROOT, config.roots.graph, name);
  if (!fs.existsSync(file)) return fallback;
  return readJson<T>(file);
}

function readCorpus(): Corpus {
  const config = loadConfig();
  return {
    config,
    books: loadBooks(config),
    people: loadPeople(config),
    articles: loadArticles(config),
    historyPaths: graphFile<HistoryPath[]>(config, "paths.json", []),
    pathPeople: graphFile<GraphPerson[]>(config, "people.json", []),
    pathEvents: graphFile<GraphEvent[]>(config, "events.json", []),
    pathJuans: graphFile<JuanRecord[]>(config, "juans.json", []),
    loci: graphFile<Locus[]>(config, "loci.json", []).map((locus) => ({
      ...locus,
      edition: locus.edition || config.edition,
    })),
    claims: graphFile<Claim[]>(config, "claims.json", []).map((claim) => ({
      ...claim,
      editor: claim.editor || config.firstEditor,
    })),
    comparePairs: graphFile<ComparePair[]>(config, "pairs.json", []),
    corrections: graphFile<Correction[]>(config, "corrections.json", []),
    companions: graphFile<Companion[]>(config, "companions.json", []),
  };
}

let productionCache: Corpus | undefined;

export function loadCorpus(): Corpus {
  if (process.env.NODE_ENV === "production") {
    productionCache ??= readCorpus();
    return productionCache;
  }
  return readCorpus();
}

export function loadConfigOnly(): SiteConfig {
  return loadCorpus().config;
}

export function contentRoot() {
  return CONTENT_ROOT;
}
