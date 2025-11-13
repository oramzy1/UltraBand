"use client";

import { useState, useEffect } from "react";

export function HeroCarousel<>({ images, defaultImage }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const displayImages = images.length > 0 ? images : [{ image_url: defaultImage }];

  useEffect(() => {
    if (displayImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [displayImages.length]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {displayImages.map((image: { id: any; image_url: any; }, index: number) => (
        <div
          key={image.id || index}
          className={`absolute inset-0 w-full transition-opacity duration-1000 
            ${index === currentIndex ? "opacity-100" : "opacity-0"} 
            bg-center bg-no-repeat 
            bg-contain sm:bg-cover 
            h-[300px] sm:h-full`}
          style={{
            backgroundImage: `url('${image.image_url}')`,
            willChange: "transform",
          }}
        >
          {/* Overlay to darken image */}
          <div className="absolute inset-0 bg-black/70 sm:bg-black/60" />
        </div>
      ))}
    </div>
  );
}
