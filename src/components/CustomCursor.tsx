'use client'

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the movement of the outer ring
  const ringX = useSpring(mouseX, { damping: 20, stiffness: 250 });
  const ringY = useSpring(mouseY, { damping: 20, stiffness: 250 });

  useEffect(() => {
    // Check if device has a pointer (mouse)
    const hasPointer = window.matchMedia('(pointer: fine)').matches;
    setIsPointer(hasPointer);

    if (!hasPointer) return;

    const moveMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('button') || 
        target.closest('a') ||
        target.getAttribute('role') === 'button'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveMouse);
    window.addEventListener('mouseover', handleHoverStart);

    return () => {
      window.removeEventListener('mousemove', moveMouse);
      window.removeEventListener('mouseover', handleHoverStart);
    };
  }, [mouseX, mouseY]);

  if (!isPointer) return null;

  return (
    <>
      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-blue-600 rounded-full pointer-events-none z-[9999]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 border-2 border-blue-600/30 rounded-full pointer-events-none z-[9998]"
        animate={{
          width: isHovering ? 60 : 32,
          height: isHovering ? 60 : 32,
          backgroundColor: isHovering ? "rgba(37, 99, 235, 0.05)" : "rgba(37, 99, 235, 0)",
        }}
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
}
