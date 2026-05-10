'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { handleSearch } from '@/app/actions';
import { SearchResult } from '@/lib/lotto';
import { THAI_MONTHS } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices, Sparkles, Moon, Cake, ArrowRight, RefreshCcw, TrendingUp } from 'lucide-react';

const ZODIACS = [
  { name: 'ราศีเมษ', icon: '♈' }, { name: 'ราศีพฤษภ', icon: '♉' },
  { name: 'ราศีเมถุน', icon: '♊' }, { name: 'ราศีกรกฎ', icon: '♋' },
  { name: 'ราศีสิงห์', icon: '♌' }, { name: 'ราศีกันย์', icon: '♍' },
  { name: 'ราศีตุลย์', icon: '♎' }, { name: 'ราศีพิจิก', icon: '♏' },
  { name: 'ราศีธนู', icon: '♐' }, { name: 'ราศีมังกร', icon: '♑' },
  { name: 'ราศีกุมภ์', icon: '♒' }, { name: 'ราศีมีน', icon: '♓' },
];

const THAI_MONTH_NAMES = Object.keys(THAI_MONTHS);

export default function RandomPage() {
  const [mode, setMode] = useState<'luck' | 'zodiac' | 'birthday'>('luck');
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<{ num: string, stats: SearchResult[] } | null>(null);

  // Inputs
  const [selectedZodiac, setSelectedZodiac] = useState('');
  const [birthday, setBirthday] = useState({ day: '1', month: 'มกราคม' });

  const getDaysInMonth = (monthName: string) => {
    if (monthName === 'กุมภาพันธ์') return 29;
    if (monthName.endsWith('ยน')) return 30;
    return 31;
  };

  const daysCount = useMemo(() => getDaysInMonth(birthday.month), [birthday.month]);

  const generateNumber = async () => {
    setIsSpinning(true);
    setResult(null);

    // Artificial delay for excitement
    await new Promise(r => setTimeout(r, 1500));

    let finalNum = "";
    if (mode === 'luck') {
      finalNum = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    } else if (mode === 'zodiac') {
      const idx = ZODIACS.findIndex(z => z.name === selectedZodiac);
      const seed = idx + new Date().getDate();
      finalNum = ((seed * 7) % 100).toString().padStart(2, '0');
    } else {
      const d = parseInt(birthday.day);
      const mIdx = THAI_MONTH_NAMES.indexOf(birthday.month) + 1;
      finalNum = ((d + mIdx + 24) % 100).toString().padStart(2, '0');
    }

    const stats = await handleSearch(finalNum);
    setResult({ num: finalNum, stats });
    setIsSpinning(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12 pb-20 animate-in fade-in duration-700 px-4 sm:px-6">
      {/* Header */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-indigo-50 rounded-3xl mb-2 shadow-sm">
          <Dices className="w-10 h-10 text-indigo-600" />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">สุ่มเลขมงคล</h1>
          <p className="text-xs sm:text-base text-slate-500 font-bold px-4">"ให้ดวงดาวและดวงใจนำทางคุณไปสู่เลขเด็ด"</p>
        </div>
      </section>

      {/* Mode Selector */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
        <button 
          onClick={() => setMode('luck')}
          className={`flex items-center space-x-2 px-3 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl border-2 transition-all text-[10px] sm:text-sm font-bold ${mode === 'luck' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200'}`}
        >
          <Sparkles className="w-4 h-4" />
          <span>สุ่มเสี่ยงดวง</span>
        </button>
        <button 
          onClick={() => setMode('zodiac')}
          className={`flex items-center space-x-2 px-3 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl border-2 transition-all text-[10px] sm:text-sm font-bold ${mode === 'zodiac' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200'}`}
        >
          <Moon className="w-4 h-4" />
          <span>ตามราศีเกิด</span>
        </button>
        <button 
          onClick={() => setMode('birthday')}
          className={`flex items-center space-x-2 px-3 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl border-2 transition-all text-[10px] sm:text-sm font-bold ${mode === 'birthday' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200'}`}
        >
          <Cake className="w-4 h-4" />
          <span>จากวันเกิด</span>
        </button>
      </div>

      {/* Inputs & Action */}
      <div className="card-minimal max-w-xl mx-auto space-y-6 sm:space-y-8 p-5 sm:p-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        <AnimatePresence mode="wait">
          {mode === 'zodiac' && (
            <motion.div 
              key="zodiac"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <label className="block text-[10px] sm:text-sm font-black text-slate-400 uppercase tracking-widest text-center">เลือกราศีของคุณ</label>
              <select 
                value={selectedZodiac}
                onChange={(e) => setSelectedZodiac(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-base sm:text-lg font-bold outline-none focus:border-indigo-500 transition-colors cursor-pointer appearance-none text-center"
              >
                <option value="">-- กรุณาเลือก --</option>
                {ZODIACS.map(z => <option key={z.name} value={z.name}>{z.icon} {z.name}</option>)}
              </select>
            </motion.div>
          )}

          {mode === 'birthday' && (
            <motion.div 
              key="birthday"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-4 w-full"
            >
              <label className="block text-[10px] sm:text-sm font-black text-slate-400 uppercase tracking-widest text-center">วันเกิดของคุณ</label>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <div className="flex-1 space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block text-center">วันที่</span>
                  <select 
                    value={birthday.day}
                    onChange={(e) => setBirthday(prev => ({...prev, day: e.target.value}))}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 sm:p-4 text-sm sm:text-lg font-bold outline-none focus:border-indigo-500 cursor-pointer appearance-none text-center"
                  >
                    {[...Array(daysCount)].map((_, i) => (
                      <option key={i+1} value={i+1}>{i+1}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-[2] space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block text-center">เดือน</span>
                  <select 
                    value={birthday.month}
                    onChange={(e) => {
                      const newMonth = e.target.value;
                      const maxDays = getDaysInMonth(newMonth);
                      setBirthday(prev => ({
                        month: newMonth,
                        day: parseInt(prev.day) > maxDays ? maxDays.toString() : prev.day
                      }));
                    }}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 sm:p-4 text-sm sm:text-lg font-bold outline-none focus:border-indigo-500 cursor-pointer appearance-none text-center"
                  >
                    {THAI_MONTH_NAMES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {mode === 'luck' && (
            <motion.div 
              key="luck"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 text-center">ดวงล้วนๆ ไม่มีผสม</h3>
              <p className="text-xs sm:text-base text-slate-400 font-medium text-center">กดปุ่มด้านล่างเพื่อรับรหัสโชคดีจากจักรวาล</p>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={generateNumber}
          disabled={isSpinning || (mode === 'zodiac' && !selectedZodiac) || (mode === 'birthday' && (!birthday.day || !birthday.month))}
          className="w-full bg-slate-900 text-white rounded-2xl p-4 sm:p-6 text-base sm:text-xl font-black shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:hover:scale-100 flex items-center justify-center space-x-3 group mt-4"
        >
          {isSpinning ? (
            <>
              <RefreshCcw className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
              <span>กำลังคำนวณรหัสโชค...</span>
            </>
          ) : (
            <>
              <Dices className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform" />
              <span>เริ่มสุ่มเลขเด็ด</span>
            </>
          )}
        </button>
      </div>

      {/* Result Display */}
      <AnimatePresence>
        {result && !isSpinning && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="flex flex-col items-center space-y-6">
              <div className="relative w-full max-w-sm">
                <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative bg-white border-4 border-indigo-600 rounded-[2rem] sm:rounded-[3rem] px-8 sm:px-16 py-6 sm:py-8 shadow-2xl flex flex-col items-center">
                  <span className="text-[8px] sm:text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2 text-center">Lucky Number</span>
                  <div className="text-6xl sm:text-8xl font-mono font-black text-slate-900 tracking-widest">{result.num}</div>
                </div>
              </div>

              {/* Data Backed Insight */}
              <div className={`card-minimal w-full max-w-2xl flex flex-col sm:flex-row items-center sm:space-x-6 p-5 sm:p-6 border-l-8 ${result.stats.length > 0 ? 'border-l-green-500' : 'border-l-slate-200'} gap-4 sm:gap-0`}>
                <div className={`p-4 rounded-2xl ${result.stats.length > 0 ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'} flex-shrink-0`}>
                   <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-base sm:text-xl font-black text-slate-800">
                    {result.stats.length > 0 ? `ว้าว! เลขนี้เคยออกรางวัลมาแล้ว ${result.stats.length} ครั้ง` : 'เลขนี้ยังไม่เคยออกรางวัลเลย (อาจจะมางวดนี้!)'}
                  </h4>
                  <p className="text-[11px] sm:text-sm text-slate-500 font-medium leading-relaxed">
                    จากการวิเคราะห์ฐานข้อมูลย้อนหลัง 3 ปี {result.stats.length > 0 ? 'พบว่าเคยปรากฏในหลายรางวัลที่น่าสนใจ' : 'นี่เป็นเลขที่อาจจะเป็นม้ามืดสำหรับคุณ'}
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
