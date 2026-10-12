"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LegacyChuHanPath() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/paths/chu-han");
  }, [router]);

  return (
    <p className="mx-auto max-w-3xl px-5 py-12 font-serif-sc">
      <Link href="/paths/chu-han" className="text-cinnabar">
        前往楚汉路径
      </Link>
    </p>
  );
}
