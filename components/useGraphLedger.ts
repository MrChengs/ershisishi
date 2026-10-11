"use client";

import { useCallback, useEffect, useState } from "react";
import type { Correction } from "@/data/graph/types";

const STORAGE = "ershisishi-graph-ledger-v1";

export type GraphLedger = {
  disputed: string[];
  retracted: string[];
  corrections: Correction[];
};

const empty: GraphLedger = {
  disputed: [],
  retracted: [],
  corrections: [],
};

function read(): GraphLedger {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(STORAGE);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as GraphLedger;
    return {
      disputed: parsed.disputed ?? [],
      retracted: parsed.retracted ?? [],
      corrections: parsed.corrections ?? [],
    };
  } catch {
    return empty;
  }
}

export function useGraphLedger() {
  const [ledger, setLedger] = useState<GraphLedger>(empty);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLedger(read());
    setReady(true);
  }, []);

  const persist = useCallback((next: GraphLedger) => {
    setLedger(next);
    window.localStorage.setItem(STORAGE, JSON.stringify(next));
  }, []);

  const toggleDisputed = useCallback(
    (claimId: string) => {
      persist({
        ...ledger,
        disputed: ledger.disputed.includes(claimId)
          ? ledger.disputed.filter((id) => id !== claimId)
          : [...ledger.disputed, claimId],
      });
    },
    [ledger, persist],
  );

  const toggleRetracted = useCallback(
    (claimId: string) => {
      persist({
        ...ledger,
        retracted: ledger.retracted.includes(claimId)
          ? ledger.retracted.filter((id) => id !== claimId)
          : [...ledger.retracted, claimId],
      });
    },
    [ledger, persist],
  );

  const postCorrection = useCallback(
    (entry: Omit<Correction, "id" | "postedAt">) => {
      const posted: Correction = {
        ...entry,
        id: `local-${Date.now()}`,
        postedAt: new Date().toISOString(),
      };
      persist({
        ...ledger,
        corrections: [posted, ...ledger.corrections],
      });
    },
    [ledger, persist],
  );

  return {
    ledger,
    ready,
    toggleDisputed,
    toggleRetracted,
    postCorrection,
  };
}
