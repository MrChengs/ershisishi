import type { Metadata } from "next";
import Link from "next/link";
import { allRelatedPeople, groupPeopleByDynasty } from "@/data/listPeople";
import { peopleByRole } from "@/data/people";

export const metadata: Metadata = {
  title: "人物",
  description: "正史记述人物按朝代分列，史家单独成类。",
};

export default function PeoplePage() {
  const dynastyGroups = groupPeopleByDynasty(allRelatedPeople());
  const historians = peopleByRole("史家");

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="font-serif text-xs tracking-[0.35em] text-cinnabar uppercase">
        People
      </p>
      <h1 className="mt-3 font-serif-sc text-4xl tracking-[0.28em]">人物</h1>
      <p className="mt-4 max-w-2xl leading-8 text-ink/80">
        正史有纪、有传的人物按朝列出，不限于正在提取的路径或事件。史家仍单独成类，与朝代并列。路径上的人点进去是主张网络；其余是篇目入口。工作稿，可续补。
      </p>

      {dynastyGroups.map(([dynasty, members]) => (
        <section key={dynasty} className="mt-12">
          <h2 className="font-serif-sc text-xl tracking-[0.28em]">{dynasty}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((person) => (
              <Link
                key={person.slug}
                href={`/people/${person.slug}`}
                className="paper-card block rounded-sm p-4"
              >
                <p className="font-serif-sc text-xs tracking-[0.3em] text-cinnabar">
                  {person.kind}
                </p>
                <h3 className="mt-2 font-serif-sc text-xl tracking-widest">
                  {person.nameZh}
                </h3>
                <p className="mt-1 font-serif text-xs italic text-ink-muted">
                  {person.nameEn}
                </p>
                <p className="mt-2 text-sm text-ink-muted">{person.years}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section className="mt-14">
        <h2 className="font-serif-sc text-xl tracking-[0.28em]">史家</h2>
        <ul className="mt-4 columns-2 gap-8 text-sm leading-8 sm:columns-3">
          {historians.map((person) => (
            <li key={person.slug}>
              <Link href={`/people/${person.slug}`} className="hover:text-cinnabar">
                {person.nameZh}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
