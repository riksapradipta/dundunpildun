"use client";;
import { useMemo } from "react";

import TextAnimator from "./text-animator";

const BASE_SPEC = {
  id: "kinetic-top-build",
  target: "per-word",
  enter: {
    durationMs: 360,
    staggerMs: 0,
    easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    from: {
      opacity: 0,
      yPx: -14,
      scale: 0.992,
      blurPx: 2.4,
    },
    to: {
      opacity: 1,
      yPx: 0,
      scale: 1,
      blurPx: 0,
    },
  },
  exit: {
    durationMs: 320,
    staggerMs: 0,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    from: {
      opacity: 1,
      yPx: 0,
      blurPx: 0,
    },
    to: {
      opacity: 0,
      yPx: 10,
      blurPx: 1.2,
    },
  },
  swap: {
    mode: "sequential",
    overlapMs: 0,
    microDelayMs: 220,
  },
  customRenderer: "kinetic-top-build",
  build: {
    firstWordDurationMs: 360,
    pushDurationMs: 500,
    entryOffsetYPx: -28,
    wordGapPx: 12,
    firstWordYPx: -14,
    entryScale: 0.992,
    entryBlurPx: 2.4,
    reflowBlurPx: 0.7,
    exitYPx: 10,
    exitBlurPx: 1.2,
    easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    exitEasing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

const DEFAULT_PHRASES = [
  ["Each", "word", "arrives"],
  ["Center", "holds", "still"],
  ["Builds", "one", "line"],
];

export default function KineticTopBuild({
  phrases,
  build,
  speed,
  holdMs,
  gapMs,
  yTravel,
  className
} = {}) {
  const spec = useMemo(() => ({
    ...BASE_SPEC,
    build: { ...BASE_SPEC.build, ...build },
  }), [build]);
  const effectivePhrases = useMemo(() => phrases ?? DEFAULT_PHRASES.map((p) => [...p]), [phrases]);
  return (
    <TextAnimator
      spec={spec}
      phrases={effectivePhrases}
      speed={speed}
      holdMs={holdMs}
      gapMs={gapMs}
      yTravel={yTravel}
      className={className} />
  );
}
