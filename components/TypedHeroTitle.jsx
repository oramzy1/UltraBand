"use client";

import { useEffect, useRef } from "react";
import Typed from "typed.js";

export default function TypedHeroTitle({ defaultText }) {
  const el = useRef(null);
  const typedInstance = useRef(null);

  useEffect(() => {
    if (el.current) {
      typedInstance.current = new Typed(el.current, {
        strings: [defaultText, "We Are", "Ultra Band Music"],
        typeSpeed: 100,
        backSpeed: 40,
        backDelay: 1500,
        startDelay: 500,
        loop: false,
        showCursor: true,
        cursorChar: "|",
      });
    }

    return () => {
      typedInstance.current?.destroy();
    };
  }, [defaultText]);

  return (
    <span
      ref={el}
      className="text-2xl md:text-5xl font-bold mb-6 inline-block"
    ></span>
  );
}
