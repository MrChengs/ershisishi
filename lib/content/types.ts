import type { Article, Book, Person } from "@/data/types";
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

export type SiteConfig = {
  edition: string;
  firstEditor: string;
  roots: {
    books: string;
    people: string;
    articles: string;
    graph: string;
  };
  personRoles: string[];
  bookGroups: { id: string; label: string; caption: string }[];
  dynastyOrder: string[];
  claimTypes: string[];
  juanTypes: string[];
  layers: string[];
  pathStatuses: string[];
  claimStatuses: string[];
  compiledYear: Record<string, number>;
  writtenStart: Record<string, number>;
  bookSlugAliases?: Record<string, string>;
};

export type Companion = {
  id: string;
  titleZh: string;
  jobZh: string;
};

export type Corpus = {
  config: SiteConfig;
  books: Book[];
  people: Person[];
  articles: Article[];
  historyPaths: HistoryPath[];
  pathPeople: GraphPerson[];
  pathEvents: GraphEvent[];
  pathJuans: JuanRecord[];
  loci: Locus[];
  claims: Claim[];
  comparePairs: ComparePair[];
  corrections: Correction[];
  companions: Companion[];
};
