export type WorkId = string;

export type CompanionId = "tongjian" | "zuozhuan" | "zhanguoce" | "lienuzhuan";

export type TextId = WorkId | CompanionId;

export type JuanType = "纪" | "表" | "书" | "志" | "世家" | "列传";

export type ExtractionStatus = "indexed" | "claims-extracted" | "deferred";

export type Layer = "正文" | "注" | "互证";

export type ClaimType =
  | "杀"
  | "诛"
  | "封"
  | "徙封"
  | "拜"
  | "迁"
  | "谏"
  | "计"
  | "叛"
  | "降"
  | "盟"
  | "约"
  | "败"
  | "破"
  | "亲属"
  | "隶属";

export type ClaimStatus =
  | "draft"
  | "published"
  | "qualified"
  | "disputed"
  | "legend";

export type NodeKind = "person" | "event";

export type JuanRecord = {
  work: WorkId;
  number: number;
  titleZh: string;
  type: JuanType;
  abstractZh: string;
  attestedPersonSlugs: string[];
  attestedEventSlugs: string[];
  extraction: ExtractionStatus;
  pathIds: string[];
};

export type GraphPerson = {
  slug: string;
  nameZh: string;
  nameEn: string;
  pinyin: string;
  years: string;
  dynasty: string;
  noteZh: string;
  pathIds: string[];
};

export type GraphEvent = {
  slug: string;
  nameZh: string;
  nameEn: string;
  yearApprox: string;
  noteZh: string;
  pathIds: string[];
};

export type Locus = {
  id: string;
  text: TextId;
  juan: number;
  juanTitle: string;
  layer: Layer;
  commentator?: string;
  edition: string;
  page: string;
  pageUnverified: boolean;
  excerpt: string;
};

export type Claim = {
  id: string;
  type: ClaimType;
  from: string;
  to: string;
  fromKind: NodeKind;
  toKind: NodeKind;
  eventSlug?: string;
  status: ClaimStatus;
  editor: string;
  locusIds: string[];
  companionLocusIds: string[];
};

export type ComparePair = {
  id: string;
  pathId: string;
  titleZh: string;
  left: { work: WorkId; number: number };
  right: { work: WorkId; number: number };
  slice?: string;
  focusPersonSlugs: string[];
  focusEventSlugs: string[];
};

export type PathStatus = "extracting" | "planned";

export type HistoryPath = {
  id: string;
  titleZh: string;
  titleEn: string;
  summaryZh: string;
  bookSlugs: string[];
  status: PathStatus;
  closedWorld: boolean;
};

export type Correction = {
  id: string;
  claimId: string;
  editor: string;
  mistakeZh: string;
  correctionZh: string;
  postedAt: string;
};
