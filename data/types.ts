export type PersonRole = string;

export type BookGroup = string;

export type StructureItem = {
  name: string;
  count: number;
  note?: string;
};

export type Book = {
  slug: string;
  order: number;
  titleZh: string;
  titleEn: string;
  pinyin: string;
  compilers: { zh: string; en: string; slug?: string }[];
  compiledDynasty: string;
  compiledYear: string;
  covers: string;
  yearsCovered: string;
  yearStart: number;
  yearEnd: number;
  juan: number;
  genre: "通史" | "断代史";
  group: BookGroup;
  structure: StructureItem[];
  summaryZh: string;
  summaryEn: string;
  notes: string[];
  relatedBookSlugs: string[];
  relatedPersonSlugs: string[];
};

export type Person = {
  slug: string;
  nameZh: string;
  nameEn: string;
  pinyin: string;
  role: PersonRole;
  years: string;
  dynasty: string;
  summaryZh: string;
  summaryEn: string;
  bookSlugs: string[];
  chapters?: { bookSlug: string; chapter: string }[];
};

export type Article = {
  slug: string;
  titleZh: string;
  titleEn: string;
  kicker: string;
  summaryZh: string;
  summaryEn: string;
  body: { heading: string; paragraphs: string[] }[];
  relatedBookSlugs: string[];
  relatedPersonSlugs: string[];
  relatedArticleSlugs: string[];
};

export type SearchHit = {
  kind: "书" | "人" | "知识" | "卷" | "事" | "主张";
  slug: string;
  href: string;
  titleZh: string;
  titleEn: string;
  snippet: string;
};
