"use client";

import SlideArrowButton from "@/components/animata/button/slide-arrow-button";

export default function FloatingSaweria() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <SlideArrowButton
        text="Jatah bandar"
        primaryColor="#f97316"
        className="shadow-lg"
        onClick={() => window.open("https://saweria.co/riksapradipta", "_blank", "noopener,noreferrer")}
      />
    </div>
  );
}
