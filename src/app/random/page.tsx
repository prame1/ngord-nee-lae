'use client'

import React, { useState } from 'react';
import { handleSearch } from '@/app/actions';
import { SearchResult } from '@/lib/lotto';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCcw, TrendingUp, Flower2, Info } from 'lucide-react';

export default function RandomPage() {
  const [digitMode, setDigitMode] = useState<'2' | '3' | '6'>('2');
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<{ num: string, stats: SearchResult[] } | null>(null);

  const generateNumber = async () => {
    setIsSpinning(true);
    setResult(null);

    // Siamsee Shaking Animation Delay
    await new Promise(r => setTimeout(r, 2500));

    let finalNum = "";
    if (digitMode === '2') {
      finalNum = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    } else if (digitMode === '3') {
      finalNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    } else {
      finalNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    }

    const stats = await handleSearch(finalNum);
    setResult({ num: finalNum, stats });
    setIsSpinning(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700 px-4 sm:px-6">
      {/* Header */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-5 bg-orange-50 rounded-full mb-2 shadow-sm border border-orange-100 text-orange-600 animate-pulse">
          <Flower2 className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">เซียมซีนำโชค</h1>
          <p className="text-sm sm:text-lg text-slate-500 font-bold px-4">"ตั้งจิตอธิษฐาน เขย่ากระบอกรับเลขเด็ดประจำตัวคุณ"</p>
        </div>
      </section>

      {/* Mode Selector */}
      <div className="flex justify-center gap-3">
        {(['2', '3', '6'] as const).map((d) => (
          <button
            key={d}
            onClick={() => setDigitMode(d)}
            className={`px-8 py-3 rounded-2xl border-2 font-black transition-all ${
              digitMode === d 
              ? 'bg-orange-500 border-orange-600 text-white shadow-lg scale-105' 
              : 'bg-white border-slate-100 text-slate-400 hover:border-orange-200'
            }`}
          >
            {d} หลัก
          </button>
        ))}
      </div>

      {/* Inputs & Action */}
      <div className="card-minimal max-w-xl mx-auto space-y-8 p-8 sm:p-12 text-center relative overflow-hidden bg-white/50 backdrop-blur-md border-orange-100">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400"></div>
        
        {/* Siamsee Stick Container */}
        <div className="relative h-48 flex items-center justify-center">
          <AnimatePresence>
            {!isSpinning ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-24 h-32 bg-orange-100 rounded-t-full border-4 border-orange-200 relative">
                  <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="w-2 h-20 bg-orange-400 rounded-full"></div>
                    ))}
                  </div>
                </div>
                <p className="text-sm font-bold text-orange-600 uppercase tracking-widest">พร้อมเขย่าเซียมซี</p>
              </motion.div>
            ) : (
              <motion.div 
                animate={{ 
                  rotate: [0, -10, 10, -10, 10, 0],
                  y: [0, -5, 5, -5, 5, 0]
                }}
                transition={{ duration: 0.4, repeat: Infinity }}
                className="flex flex-col items-center gap-4"
              >
                 <div className="w-24 h-32 bg-orange-200 rounded-t-full border-4 border-orange-300 relative shadow-xl">
                  <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 flex gap-1 animate-bounce">
                    <div className="w-2 h-24 bg-orange-600 rounded-full"></div>
                    <div className="w-2 h-24 bg-orange-500 rounded-full -translate-y-2"></div>
                    <div className="w-2 h-24 bg-orange-600 rounded-full translate-y-1"></div>
                  </div>
                </div>
                <p className="text-sm font-black text-orange-600 animate-pulse">กำลังเขย่าบันดาลโชค...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={generateNumber}
          disabled={isSpinning}
          className="w-full bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 text-xl sm:text-2xl font-black shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center space-x-4 group"
        >
          {isSpinning ? (
            <>
              <RefreshCcw className="w-8 h-8 animate-spin text-orange-400" />
              <span>รอรับพร...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-8 h-8 text-orange-400 group-hover:rotate-12 transition-transform" />
              <span>ตั้งจิตอธิษฐาน</span>
            </>
          )}
        </button>
      </div>

      {/* Result Display */}
      <AnimatePresence>
        {result && !isSpinning && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex flex-col items-center space-y-6">
              <div className="relative w-full max-w-sm">
                <div className="absolute inset-0 bg-orange-400 blur-[80px] opacity-20 animate-pulse"></div>
                {/* Stick Result Design */}
                <div className="relative bg-[#fff9f2] border-4 border-orange-500 rounded-xl px-12 sm:px-16 py-12 sm:py-16 shadow-2xl flex flex-col items-center border-b-[12px]">
                  <div className="absolute top-4 left-4 w-8 h-8 rounded-full border-2 border-orange-200 flex items-center justify-center text-[10px] font-black text-orange-300">#Luck</div>
                  <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.4em] mb-6">เลขมงคลประจำตัว</span>
                  <div className={`font-mono font-black text-slate-900 tracking-widest ${digitMode === '6' ? 'text-5xl sm:text-7xl' : 'text-8xl sm:text-9xl'}`}>
                    {result.num}
                  </div>
                </div>
              </div>

              {/* Data Backed Insight */}
              <div className={`card-minimal w-full max-w-2xl flex flex-col sm:flex-row items-center sm:space-x-8 p-8 border-l-8 ${result.stats.length > 0 ? 'border-l-green-500' : 'border-l-slate-200'} gap-6 sm:gap-0`}>
                <div className={`p-5 rounded-2xl ${result.stats.length > 0 ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'} flex-shrink-0`}>
                   <TrendingUp className="w-10 h-10" />
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <h4 className="text-2xl font-black text-slate-800">
                    {result.stats.length > 0 ? `บารมีเข้าเป้า! เคยออกรางวัลมาแล้ว ${result.stats.length} ครั้ง` : 'เลขใหม่แกะกล่อง (ยังไม่เคยออกรางวัล)'}
                  </h4>
                  <p className="text-base text-slate-500 font-medium leading-relaxed">
                    จากการวิเคราะห์ข้อมูล 3 ปีล่าสุด {result.stats.length > 0 ? 'พบว่าตัวเลขนี้เคยให้โชคมาแล้วในหลายงวดครับ' : 'ถือเป็นเลขม้ามืดที่ยังไม่มีประวัติในงวดที่ผ่านมาครับ'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
