import { ArrowRight } from "lucide-react";

export default function SlideArrowButton({
  text = "Get Started",
  primaryColor = "#6f3cff",
  className = "",
  ...props
}) {
  return (
    <button
      className={`group/slide relative rounded-full border border-white bg-white p-1 text-sm font-semibold ${className}`}
      {...props}
    >
      <div
        className="absolute left-0 top-0 flex h-full w-8 items-center justify-end rounded-full transition-all duration-200 ease-in-out group-hover/slide:w-full"
        style={{ backgroundColor: primaryColor }}
      >
        <span className="mr-2 text-white transition-all duration-200 ease-in-out">
          <ArrowRight size={14} />
        </span>
      </div>
      <span className="relative left-3 z-10 whitespace-nowrap px-5 font-semibold text-black transition-all duration-200 ease-in-out group-hover/slide:-left-2 group-hover/slide:text-white">
        {text}
      </span>
    </button>
  );
}
