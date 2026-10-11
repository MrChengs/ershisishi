import { loadCorpus } from "../lib/content/read";

const corpus = loadCorpus();
const errors: string[] = [];

function unique(kind: string, slugs: string[]) {
  const seen = new Set<string>();
  for (const slug of slugs) {
    if (seen.has(slug)) errors.push(`duplicate ${kind}: ${slug}`);
    seen.add(slug);
  }
}

unique("book", corpus.books.map((book) => book.slug));
unique("person", corpus.people.map((person) => person.slug));
unique("article", corpus.articles.map((article) => article.slug));
unique("path person", corpus.pathPeople.map((person) => person.slug));
unique("event", corpus.pathEvents.map((event) => event.slug));
unique("claim", corpus.claims.map((claim) => claim.id));
unique("locus", corpus.loci.map((locus) => locus.id));

const bookSlugs = new Set(corpus.books.map((book) => book.slug));
const roles = new Set(corpus.config.personRoles);
const dynasties = new Set(corpus.config.dynastyOrder);
const claimTypes = new Set(corpus.config.claimTypes);

for (const person of corpus.people) {
  if (!roles.has(person.role)) {
    errors.push(`${person.slug}: role ${person.role} is not in config.personRoles`);
  }
  if (!dynasties.has(person.dynasty)) {
    errors.push(`${person.slug}: dynasty ${person.dynasty} is not in config.dynastyOrder`);
  }
  for (const slug of person.bookSlugs) {
    if (!bookSlugs.has(slug)) errors.push(`${person.slug}: unknown book ${slug}`);
  }
}

for (const claim of corpus.claims) {
  if (!claimTypes.has(claim.type)) {
    errors.push(`${claim.id}: type ${claim.type} is not in config.claimTypes`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  `ok: ${corpus.books.length} books, ${corpus.people.length} people, ${corpus.articles.length} articles, ${corpus.claims.length} claims`,
);
