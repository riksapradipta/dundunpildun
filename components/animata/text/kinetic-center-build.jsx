"use client";;
import { useMemo } from "react";

import TextAnimator from "./text-animator";

const BASE_SPEC = {
  id: "kinetic-center-build",
  target: "per-word",
  enter: {
    durationMs: 360,
    staggerMs: 0,
    easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    from: {
      opacity: 0,
      yPx: 6,
      scale: 0.992,
      blurPx: 3.5,
    },
    to: {
      opacity: 1,
      yPx: 0,
      scale: 1,
      blurPx: 0,
    },
  },
  exit: {
    durationMs: 260,
    staggerMs: 0,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    from: {
      opacity: 1,
      yPx: 0,
      blurPx: 0,
    },
    to: {
      opacity: 0,
      yPx: -6,
      blurPx: 2.5,
    },
  },
  swap: {
    mode: "sequential",
    overlapMs: 0,
    microDelayMs: 220,
  },
  customRenderer: "kinetic-center-build",
  build: {
    firstWordDurationMs: 340,
    pushDurationMs: 430,
    entryOffsetPx: 88,
    wordGapPx: 10,
    firstWordYPx: 6,
    entryScale: 0.992,
    entryBlurPx: 3.5,
    reflowBlurPx: 0.8,
    exitYPx: -6,
    exitBlurPx: 2.5,
    easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    exitEasing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

const DEFAULT_PHRASES = [
  ["Each", "word", "arrives"],
  ["Center", "holds", "still"],
  ["Builds", "one", "line"],
];

export default function KineticCenterBuild({
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
