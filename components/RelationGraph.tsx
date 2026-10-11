"use client";

import { FormEvent, useEffect, useId, useMemo, useRef, useState } from "react";
import type { Claim, Correction } from "@/data/graph/types";
import { useGraphLedger } from "@/components/useGraphLedger";

type GraphNode = {
  id: string;
  kind: "person" | "event";
  slug: string;
  label: string;
  href: string;
};

type Props = {
  claims: Claim[];
  extraNodes?: GraphNode[];
  layout: "path" | "event";
  seededCorrections?: Correction[];
};

function mermaidSafeId(kind: string, slug: string) {
  return `${kind}_${slug.replace(/[^a-zA-Z0-9]/g, "_")}`;
}

function mermaidLabel(text: string) {
  return text.replace(/"/g, "#quot;");
}

function labelOf(nodes: GraphNode[], kind: string, slug: string) {
  return nodes.find((node) => node.kind === kind && node.slug === slug)?.label ?? slug;
}

function toMermaid(
  nodes: GraphNode[],
  claims: Claim[],
  layout: "path" | "event",
  disputed: string[],
  selectedId: string | null,
) {
  const people = nodes.filter((node) => node.kind === "person");
  const events = nodes.filter((node) => node.kind === "event");
  const lines: string[] = [
    layout === "event" ? "flowchart TB" : "flowchart TB",
    "classDef person fill:#f6f0de,stroke:#1c1610,color:#1c1610",
    "classDef event fill:#f6f0de,stroke:#9b2c28,stroke-dasharray:4 3,color:#1c1610",
  ];

  if (layout === "path") {
    if (people.length > 0) {
      lines.push("subgraph people[人物]");
      for (const node of people) {
        lines.push(
          `  ${mermaidSafeId(node.kind, node.slug)}["${mermaidLabel(node.label)}"]:::person`,
        );
      }
      lines.push("end");
    }
    if (events.length > 0) {
      lines.push("subgraph events[事件]");
      for (const node of events) {
        lines.push(
          `  ${mermaidSafeId(node.kind, node.slug)}["${mermaidLabel(node.label)}"]:::event`,
        );
      }
      lines.push("end");
    }
  } else {
    for (const node of events) {
      lines.push(`${mermaidSafeId(node.kind, node.slug)}["${mermaidLabel(node.label)}"]:::event`);
    }
    for (const node of people) {
      lines.push(`${mermaidSafeId(node.kind, node.slug)}["${mermaidLabel(node.label)}"]:::person`);
    }
  }

  claims.forEach((claim, index) => {
    const from = mermaidSafeId(claim.fromKind, claim.from);
    const to = mermaidSafeId(claim.toKind, claim.to);
    const arrow = disputed.includes(claim.id) || selectedId === claim.id ? "-.->" : "-->";
    lines.push(`${from} ${arrow}|"${claim.type}"| ${to}`);
    if (selectedId === claim.id) {
      lines.push(`linkStyle ${index} stroke:#9b2c28,stroke-width:2.5px`);
    } else if (disputed.includes(claim.id)) {
      lines.push(`linkStyle ${index} stroke:#b08948,stroke-width:1.5px,stroke-dasharray:6 4`);
    } else {
      lines.push(`linkStyle ${index} stroke:#9b2c28,stroke-width:1.2px`);
    }
  });

  for (const node of nodes) {
    lines.push(`click ${mermaidSafeId(node.kind, node.slug)} "${node.href}"`);
  }

  return lines.join("\n");
}

export function RelationGraph({
  claims,
  extraNodes = [],
  layout,
  seededCorrections = [],
}: Props) {
  const { ledger, ready, toggleDisputed, toggleRetracted, postCorrection } =
    useGraphLedger();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editor, setEditor] = useState("");
  const [mistake, setMistake] = useState("");
  const [fix, setFix] = useState("");
  const [error, setError] = useState<string | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const reactId = useId().replace(/:/g, "");

  const visibleClaims = useMemo(
    () =>
      ready ? claims.filter((claim) => !ledger.retracted.includes(claim.id)) : claims,
    [claims, ledger.retracted, ready],
  );

  const nodes = useMemo(() => {
    const map = new Map<string, GraphNode>();
    for (const extra of extraNodes) map.set(extra.id, extra);
    for (const claim of visibleClaims) {
      const fromId = `${claim.fromKind}:${claim.from}`;
      const toId = `${claim.toKind}:${claim.to}`;
      if (!map.has(fromId)) {
        map.set(fromId, {
          id: fromId,
          kind: claim.fromKind,
          slug: claim.from,
          label: claim.from,
          href:
            claim.fromKind === "person"
              ? `/people/${claim.from}`
              : `/event/${claim.from}`,
        });
      }
      if (!map.has(toId)) {
        map.set(toId, {
          id: toId,
          kind: claim.toKind,
          slug: claim.to,
          label: claim.to,
          href: claim.toKind === "person" ? `/people/${claim.to}` : `/event/${claim.to}`,
        });
      }
    }
    return [...map.values()];
  }, [extraNodes, visibleClaims]);

  const source = useMemo(
    () =>
      toMermaid(nodes, visibleClaims, layout, ledger.disputed, selectedId),
    [nodes, visibleClaims, layout, ledger.disputed, selectedId],
  );

  useEffect(() => {
    if (nodes.length === 0) return;
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;

    void (async () => {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        theme: "base",
        themeVariables: {
          fontFamily: "Noto Serif SC, serif",
          primaryColor: "#f6f0de",
          primaryTextColor: "#1c1610",
          primaryBorderColor: "#9b2c28",
          lineColor: "#9b2c28",
          secondaryColor: "#e7d7b4",
          tertiaryColor: "#f3ead6",
          clusterBkg: "#f3ead6",
          clusterBorder: "rgba(28,22,16,0.12)",
          titleColor: "#6a5e4e",
        },
        flowchart: {
          curve: "basis",
          htmlLabels: true,
          nodeSpacing: 48,
          rankSpacing: 64,
        },
      });
      try {
        const { svg, bindFunctions } = await mermaid.render(
          `relgraph-${reactId}-${Date.now().toString(36)}`,
          source,
        );
        if (cancelled || !hostRef.current) return;
        hostRef.current.innerHTML = svg;
        bindFunctions?.(hostRef.current);
        setError(null);
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : "Mermaid 无法绘制此图");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [nodes.length, reactId, source, visibleClaims.length]);

  const selected = visibleClaims.find((claim) => claim.id === selectedId) ?? null;
  const posted = [
    ...ledger.corrections.filter((item) => item.claimId === selectedId),
    ...seededCorrections.filter((item) => item.claimId === selectedId),
  ];

  function onPost(event: FormEvent) {
    event.preventDefault();
    if (!selected || !mistake.trim() || !fix.trim()) return;
    postCorrection({
      claimId: selected.id,
      editor: editor.trim() || "未署名",
      mistakeZh: mistake.trim(),
      correctionZh: fix.trim(),
    });
    setMistake("");
    setFix("");
  }

  if (nodes.length === 0) {
    return (
      <p className="text-sm text-ink-muted">此页尚无关系可画。抽出主张后图会在这里出现。</p>
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm leading-7 text-ink-muted">
        图由 Mermaid 根据主张画出。点图中人名可打开条目；点下方的边可存疑、撤回，或贴上人的勘误。
      </p>
      <div className="paper-card overflow-x-auto rounded-sm p-4">
        {error ? (
          <p className="text-sm text-cinnabar">{error}</p>
        ) : (
          <div ref={hostRef} className="mermaid-host min-h-48 [&_svg]:mx-auto [&_svg]:max-w-full" />
        )}
      </div>

      <ul className="mt-4 flex flex-wrap gap-2">
        {visibleClaims.map((claim) => (
          <li key={claim.id}>
            <button
              type="button"
              onClick={() => setSelectedId(claim.id)}
              className={`border px-3 py-1.5 font-serif-sc text-sm ${
                selectedId === claim.id
                  ? "border-cinnabar bg-cinnabar text-paper"
                  : ledger.disputed.includes(claim.id)
                    ? "border-gold text-gold"
                    : "border-line hover:border-cinnabar"
              }`}
            >
              {labelOf(nodes, claim.fromKind, claim.from)} {claim.type}{" "}
              {labelOf(nodes, claim.toKind, claim.to)}
            </button>
          </li>
        ))}
      </ul>

      {selected ? (
        <div className="paper-card mt-4 rounded-sm p-5">
          <p className="font-serif-sc text-xs tracking-[0.3em] text-cinnabar">
            {selected.type} · {selected.editor}
            {ledger.disputed.includes(selected.id) ? " · 存疑" : ""}
          </p>
          <p className="mt-2 font-serif-sc text-lg">
            {labelOf(nodes, selected.fromKind, selected.from)} →{" "}
            {labelOf(nodes, selected.toKind, selected.to)}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => toggleDisputed(selected.id)}
              className="border border-line px-3 py-1.5 font-serif-sc text-sm hover:border-cinnabar"
            >
              {ledger.disputed.includes(selected.id) ? "取消存疑" : "标为存疑"}
            </button>
            <button
              type="button"
              onClick={() => toggleRetracted(selected.id)}
              className="border border-line px-3 py-1.5 font-serif-sc text-sm hover:border-cinnabar"
            >
              {ledger.retracted.includes(selected.id) ? "恢复此边" : "撤回误边"}
            </button>
          </div>

          {posted.length > 0 ? (
            <ul className="mt-4 space-y-3 border-t border-line pt-4">
              {posted.map((item) => (
                <MistakeNote key={item.id} item={item} />
              ))}
            </ul>
          ) : null}

          <form onSubmit={onPost} className="mt-5 space-y-3 border-t border-line pt-4">
            <p className="font-serif-sc text-sm tracking-widest">贴一条勘误</p>
            <input
              value={editor}
              onChange={(event) => setEditor(event.target.value)}
              placeholder="署名"
              className="h-10 w-full border border-line bg-white/50 px-3 font-serif-sc text-sm outline-none"
            />
            <textarea
              value={mistake}
              onChange={(event) => setMistake(event.target.value)}
              placeholder="错在何处（人的误读、误连、误记）"
              rows={2}
              className="w-full border border-line bg-white/50 px-3 py-2 font-serif-sc text-sm outline-none"
            />
            <textarea
              value={fix}
              onChange={(event) => setFix(event.target.value)}
              placeholder="应如何改"
              rows={2}
              className="w-full border border-line bg-white/50 px-3 py-2 font-serif-sc text-sm outline-none"
            />
            <button
              type="submit"
              className="border border-cinnabar bg-cinnabar px-4 py-2 font-serif-sc text-sm tracking-widest text-paper"
            >
              公开贴上
            </button>
          </form>
        </div>
      ) : (
        <p className="mt-3 text-sm text-ink-muted">点一条边，开始勘误。</p>
      )}
    </div>
  );
}

function MistakeNote({ item }: { item: Correction }) {
  return (
    <li className="text-sm leading-7">
      <p className="font-serif-sc text-cinnabar">
        勘误 · {item.editor} · {item.postedAt.slice(0, 10)}
      </p>
      <p>误：{item.mistakeZh}</p>
      <p>正：{item.correctionZh}</p>
    </li>
  );
}
