'use client'

import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-slate-50">
      {/* Soft Blue Blob */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 100, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[120px]"
      />

      {/* Soft Indigo Blob */}
      <motion.div
        animate={{
          x: [0, -150, 100, 0],
          y: [0, 100, -80, 0],
          scale: [1, 0.8, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-[130px]"
      />

      {/* Subtle Emerald Blob */}
      <motion.div
        animate={{
          x: [0, 80, -100, 0],
          y: [0, -120, 50, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-emerald-50/40 rounded-full blur-[100px]"
      />
    </div>
  );
}
