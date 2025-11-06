"use client";

import { useState, useEffect } from "react";

export function HeroCarousel({ images, defaultImage }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const displayImages = images.length > 0 ? images : [{ image_url: defaultImage }];

  useEffect(() => {
    if (displayImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayImages.length);
    }, 6000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [displayImages.length]);

  return (
    <div className="inset-0 fixed -z-10">
      {displayImages.map((image, index) => (
        <div
          key={image.id || index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1400 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url('${image.image_url}')`,
            willChange: "transform",
          }}
        >
          <div className="absolute inset-0 bg-black/80" />
        </div>
      ))}
    </div>
  );
}