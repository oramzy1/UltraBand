"use client";

import React, { useState, useRef } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "motion/react";
import Image from "next/image";
import { X } from "lucide-react";

export const AnimatedTooltip = ({ items }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [thumbRect, setThumbRect] = useState(null); 

  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);
  const animationFrameRef = useRef(null);
  const thumbRefs = useRef({}); // 👈 refs for thumbnails

  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );

  const handleMouseMove = (event) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(() => {
      const halfWidth = event.target.offsetWidth / 2;
      x.set(event.nativeEvent.offsetX - halfWidth);
    });
  };

  const handleOpen = (id) => {
    const rect = thumbRefs.current[id]?.getBoundingClientRect();
    if (rect) setThumbRect(rect);
    setActiveItem(id);
  };

  const handleClose = () => {
    setActiveItem(null);
    setThumbRect(null);
  };

  return (
    <>
      {items.map((item) => (
        <div
          className="group relative -mr-4"
          key={item.id}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                }}
                className="absolute -top-16 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md bg-black px-4 py-2 text-xs shadow-xl"
              >
                <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
                <div className="relative z-30 text-base font-bold text-white">
                  {item.name}
                </div>
                <div className="text-xs text-white">{item.designation}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Clickable Image */}
          <Image
            ref={(el) => (thumbRefs.current[item.id] = el)}
            onMouseMove={handleMouseMove}
            onClick={() => handleOpen(item.id)}
            height={100}
            width={100}
            src={item.image}
            alt={item.name}
            className="relative !m-0 h-38 w-38 rounded-full border-2 border-white object-cover object-top !p-0 transition duration-500 group-hover:z-30 group-hover:scale-105 cursor-pointer"
          />
        </div>
      ))}

      {/* Enlarged Card Modal */}
      <AnimatePresence>
        {activeItem !== null && thumbRect && (
          <>
            {/* Animated Card Container - This handles the backdrop click */}
            <motion.div
              key={activeItem}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={handleClose} // This will handle backdrop clicks
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              {/* Card Content */}
              <motion.div
                className="relative z-50 w-[90%] max-w-md rounded-2xl bg-neutral-900 p-6 text-center shadow-2xl"
                initial={{
                  x:
                    thumbRect.left +
                    thumbRect.width / 2 -
                    window.innerWidth / 2,
                  y:
                    thumbRect.top +
                    thumbRect.height / 2 -
                    window.innerHeight / 2,
                  scale: 0.3,
                }}
                animate={{
                  x: 0,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  x:
                    thumbRect.left +
                    thumbRect.width / 2 -
                    window.innerWidth / 2,
                  y:
                    thumbRect.top +
                    thumbRect.height / 2 -
                    window.innerHeight / 2,
                  scale: 0.3,
                }}
                onClick={(e) => e.stopPropagation()} // Prevent backdrop click when clicking card
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute right-1 top-1 rounded-full bg-white/30 p-2 text-white hover:bg-white/20 z-50"
                >
                  <X size={18} />
                </button>

                {(() => {
                  const item = items.find((it) => it.id === activeItem);
                  if (!item) return null;
                  return (
                    <>
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={400}
                        height={400}
                        className="mx-auto mb-4 rounded-xl object-cover"
                      />
                      <h2 className="text-xl font-bold text-white mb-2">
                        {item.name}
                      </h2>
                      <p className="text-sm text-gray-300">
                        {item.designation}
                      </p>
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
