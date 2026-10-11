import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "关于",
  description: "有出处的工作稿，不是权威定本。",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-serif-sc text-4xl tracking-[0.28em]">关于</h1>
      <div className="hairline my-8" />
      <p className="leading-8">
        本站维护的是二十四史的工作稿。组织单位是路径：一条路径切过一部或几部正史，人物与事件的边指向卷与段落。有出处，有署名，不是定论，也不替代中华书局点校本。
      </p>
      <p className="mt-4 leading-8">
        正史正文（及标明的古注）才是主张的根据。《资治通鉴》《左传》《战国策》、刘向《列女传》等只作互证，不能单独支撑一条边。
      </p>
      <p className="mt-4 leading-8">
        路径是大题（如楚汉相争），里面再含较小的事件（如垓下之战）。主张挂在人与事上，不把整条路径当成一场仗。楚汉是第一条正在提取的路径，不是二十四史的全部。
      </p>
      <p className="mt-8 font-serif-sc">
        <Link href="/paths" className="text-cinnabar">
          全部路径 →
        </Link>
      </p>
    </article>
  );
}
