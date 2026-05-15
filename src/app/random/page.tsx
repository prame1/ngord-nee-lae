'use client'

import React, { useState } from 'react';
import { handleSearch } from '@/app/actions';
import { SearchResult } from '@/lib/lotto';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCcw, TrendingUp, Flower2, Info, RotateCcw } from 'lucide-react';

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
    let allowedPrizeIds: string[] | undefined = undefined;

    if (digitMode === '2') {
      finalNum = Math.floor(Math.random() * 100).toString().padStart(2, '0');
      allowedPrizeIds = ['runningNumberBackTwo'];
    } else if (digitMode === '3') {
      finalNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      allowedPrizeIds = ['runningNumberFrontThree', 'runningNumberBackThree'];
    } else {
      finalNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      allowedPrizeIds = ['prizeFirst'];
    }

    const stats = await handleSearch(finalNum, allowedPrizeIds);
    setResult({ num: finalNum, stats });
    setIsSpinning(false);
  };

  const resetResult = () => {
    setResult(null);
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
            onClick={() => {
              setDigitMode(d);
              setResult(null);
            }}
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

      {/* Main Interaction Card */}
      <div className="card-minimal max-w-2xl mx-auto space-y-8 p-8 sm:p-12 text-center relative overflow-hidden bg-white/50 backdrop-blur-md border-orange-100 min-h-[500px] flex flex-col justify-center">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400"></div>
        
        <AnimatePresence mode="wait">
          {!result && !isSpinning && (
            <motion.div 
              key="initial"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="relative h-48 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-32 bg-orange-100 rounded-t-full border-4 border-orange-200 relative">
                    <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 flex gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="w-2 h-20 bg-orange-400 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm font-bold text-orange-600 uppercase tracking-widest">พร้อมเขย่าเซียมซี</p>
                </div>
              </div>

              <button 
                onClick={generateNumber}
                className="w-full bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 text-xl sm:text-2xl font-black shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-4 group"
              >
                <Sparkles className="w-8 h-8 text-orange-400 group-hover:rotate-12 transition-transform" />
                <span>ตั้งจิตอธิษฐาน</span>
              </button>
            </motion.div>
          )}

          {isSpinning && (
            <motion.div 
              key="spinning"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="relative h-48 flex items-center justify-center">
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
              </div>
              <button disabled className="w-full bg-slate-100 text-slate-400 rounded-3xl p-6 text-xl sm:text-2xl font-black flex items-center justify-center space-x-4 cursor-wait">
                <RefreshCcw className="w-8 h-8 animate-spin text-orange-400" />
                <span>รอรับพร...</span>
              </button>
            </motion.div>
          )}

          {result && !isSpinning && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
              className="space-y-10"
            >
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-sm">
                  <div className="absolute inset-0 bg-orange-400 blur-[60px] opacity-20 animate-pulse"></div>
                  <div className="relative bg-[#fff9f2] border-4 border-orange-500 rounded-xl px-12 py-10 shadow-2xl flex flex-col items-center border-b-[12px]">
                    <div className="absolute top-4 left-4 w-8 h-8 rounded-full border-2 border-orange-200 flex items-center justify-center text-[10px] font-black text-orange-300">#Luck</div>
                    <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.4em] mb-4">เลขมงคลประจำตัว</span>
                    <div className={`font-mono font-black text-slate-900 tracking-widest ${digitMode === '6' ? 'text-5xl sm:text-6xl' : 'text-7xl sm:text-8xl'}`}>
                      {result.num}
                    </div>
                  </div>
                </div>
              </div>

              {/* In-place Stats */}
              <div className={`p-6 rounded-2xl text-left border-l-4 ${result.stats.length > 0 ? 'bg-green-50 border-green-500' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl flex-shrink-0 ${result.stats.length > 0 ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-slate-800 text-lg">
                      {result.stats.length > 0 ? `บารมีเข้าเป้า! เคยออกรางวัลมาแล้ว ${result.stats.length} ครั้ง` : 'เลขใหม่แกะกล่อง'}
                    </p>
                    <p className="text-sm text-slate-500 font-medium">
                      {result.stats.length > 0 ? 'ตัวเลขนี้มีประวัติการให้โชคในรอบ 3 ปีที่ผ่านมา' : 'ถือเป็นเลขม้ามืดที่รอการพิสูจน์ในงวดนี้ครับ'}
                    </p>
                  </div>
                </div>
              </div>

              <button 
                onClick={resetResult}
                className="w-full bg-slate-900 text-white rounded-3xl p-6 text-xl font-black shadow-xl hover:bg-slate-800 transition-colors flex items-center justify-center space-x-4"
              >
                <RotateCcw className="w-6 h-6 text-orange-400" />
                <span>เสี่ยงทายใหม่</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Disclaimer / Info */}
      <section className="max-w-xl mx-auto text-center px-4">
        <div className="flex items-center justify-center space-x-2 text-slate-400 mb-2">
          <Info className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-tighter">โปรดใช้วิจารณญาณ</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed font-medium">
          การเสี่ยงทายเซียมซีเป็นเพียงความเชื่อส่วนบุคคลและเพื่อความบันเทิงเท่านั้น ข้อมูลสถิติอ้างอิงจากผลสลากกินแบ่งรัฐบาลย้อนหลัง 3 ปี
        </p>
      </section>
    </div>
  );
}
