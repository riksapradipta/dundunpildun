import { cn } from "@/lib/utils";

export default function Marquee({
  children,
  vertical = false,
  repeat = 5,
  pauseOnHover = false,
  reverse = false,
  className,
  applyMask = true,
  ...props
}) {
  return (
    <div
      {...props}
      className={cn(
        "group/marquee relative flex h-full w-full p-2 [--duration:10s] [--gap:12px] [gap:var(--gap)]",
        {
          "flex-col": vertical,
          "flex-row": !vertical,
        },
        className,
      )}
    >
      <style>{`
        @keyframes marquee-x {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-100% - var(--gap))); }
        }
        @keyframes marquee-y {
          from { transform: translateY(0); }
          to { transform: translateY(calc(-100% - var(--gap))); }
        }
        .marquee-horizontal {
          animation: marquee-x var(--duration) infinite linear;
        }
        .marquee-vertical {
          animation: marquee-y var(--duration) infinite linear;
        }
        .group\\/marquee:hover .marquee-pause-on-hover {
          animation-play-state: paused;
        }
      `}</style>
      {Array.from({ length: repeat }).map((_, index) => (
        <div
          key={`item-${index}`}
          className={cn("flex shrink-0 [gap:var(--gap)]", {
            "marquee-pause-on-hover": pauseOnHover,
            "marquee-horizontal flex-row": !vertical,
            "marquee-vertical flex-col": vertical,
          })}
          style={reverse ? { animationDirection: "reverse" } : undefined}
        >
          {children}
        </div>
      ))}
      {applyMask && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 z-10 h-full w-full from-white/80 from-5% via-transparent via-50% to-white/80 to-95% dark:from-gray-800/80 dark:via-transparent dark:to-gray-800/80",
            {
              "bg-linear-to-b": vertical,
              "bg-linear-to-r": !vertical,
            },
          )}
        />
      )}
    </div>
  );
}
