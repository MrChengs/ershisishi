import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RelatedList } from "@/components/RelatedList";
import { articles, getArticle } from "@/data/articles";
import { relatedArticles, relatedBooks, relatedPeople } from "@/data/index";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "未找到" };
  return { title: article.titleZh, description: article.summaryZh };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <p className="font-serif-sc text-xs tracking-[0.3em] text-cinnabar">
        {article.kicker}
      </p>
      <h1 className="mt-3 font-serif-sc text-4xl tracking-[0.28em]">{article.titleZh}</h1>
      <p className="mt-3 font-serif text-lg italic text-ink-muted">{article.titleEn}</p>
      <p className="mt-6 leading-8 text-ink/80">{article.summaryZh}</p>
      <div className="hairline my-10" />
      {article.body.map((section) => (
        <section key={section.heading} className="mb-10">
          <h2 className="font-serif-sc text-xl tracking-[0.2em]">{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="mt-4 leading-8">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
      <RelatedList
        books={relatedBooks(article.relatedBookSlugs)}
        people={relatedPeople(article.relatedPersonSlugs)}
        articles={relatedArticles(article.relatedArticleSlugs)}
      />
    </article>
  );
}
