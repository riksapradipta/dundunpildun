"use client";

import { useEffect, useState, useRef } from "react";

export default function KineticReveal({ words = [], className = "" }) {
  const [visible, setVisible] = useState(0);
  const [done, setDone] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (visible < words.length) {
      const t = setTimeout(() => {
        if (mounted.current) setVisible((v) => v + 1);
      }, 400);
      return () => {
        mounted.current = false;
        clearTimeout(t);
      };
    } else {
      setDone(true);
    }
  }, [visible, words.length]);

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block transition-all duration-500"
          style={{
            opacity: i < visible ? 1 : 0,
            transform: i < visible ? "translateY(0) scale(1)" : "translateY(10px) scale(0.92)",
            filter: i < visible ? "blur(0)" : "blur(4px)",
          }}
        >
          {word}{" "}
        </span>
      ))}
    </span>
  );
}
