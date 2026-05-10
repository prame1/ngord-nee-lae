'use client'

import React, { useState, useEffect } from 'react';
import { handleSearch } from '@/app/actions';
import { SearchResult } from '@/lib/lotto';
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

export default function RandomPage() {
  const [mode, setMode] = useState<'luck' | 'zodiac' | 'birthday'>('luck');
  const [isSpinning, setIsSearching] = useState(false);
  const [result, setResult] = useState<{ num: string, stats: SearchResult[] } | null>(null);

  // Inputs
  const [selectedZodiac, setSelectedZodiac] = useState('');
  const [birthday, setBirthday] = useState({ day: '', month: '' });

  const generateNumber = async () => {
    setIsSearching(true);
    setResult(null);

    // Artificial delay for excitement
    await new Promise(r => setTimeout(r, 1500));

    let finalNum = "";
    if (mode === 'luck') {
      finalNum = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    } else if (mode === 'zodiac') {
      // Semi-random based on zodiac index
      const idx = ZODIACS.findIndex(z => z.name === selectedZodiac);
      const seed = idx + new Date().getDate();
      finalNum = ((seed * 7) % 100).toString().padStart(2, '0');
    } else {
      // Birthday logic
      const d = parseInt(birthday.day) || 1;
      const m = parseInt(birthday.month) || 1;
      finalNum = ((d + m + 24) % 100).toString().padStart(2, '0');
    }

    const stats = await handleSearch(finalNum);
    setResult({ num: finalNum, stats });
    setIsSearching(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-indigo-50 rounded-3xl mb-2 shadow-sm">
          <Dices className="w-10 h-10 text-indigo-600" />
        </div>
        <div className="space-y-1">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">สุ่มเลขมงคล</h1>
          <p className="text-slate-500 font-bold">"ให้ดวงดาวและดวงใจนำทางคุณไปสู่เลขเด็ด"</p>
        </div>
      </section>

      {/* Mode Selector */}
      <div className="flex flex-wrap justify-center gap-4">
        <button 
          onClick={() => setMode('luck')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-2xl border-2 transition-all font-bold ${mode === 'luck' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200'}`}
        >
          <Sparkles className="w-4 h-4" />
          <span>สุ่มเสี่ยงดวง</span>
        </button>
        <button 
          onClick={() => setMode('zodiac')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-2xl border-2 transition-all font-bold ${mode === 'zodiac' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200'}`}
        >
          <Moon className="w-4 h-4" />
          <span>ตามราศีเกิด</span>
        </button>
        <button 
          onClick={() => setMode('birthday')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-2xl border-2 transition-all font-bold ${mode === 'birthday' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200'}`}
        >
          <Cake className="w-4 h-4" />
          <span>จากวันเกิด</span>
        </button>
      </div>

      {/* Inputs & Action */}
      <div className="card-minimal max-w-xl mx-auto space-y-8 p-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        <AnimatePresence mode="wait">
          {mode === 'zodiac' && (
            <motion.div 
              key="zodiac"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">เลือกราศีของคุณ</label>
              <select 
                value={selectedZodiac}
                onChange={(e) => setSelectedZodiac(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-lg font-bold outline-none focus:border-indigo-500 transition-colors"
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
              className="space-y-4"
            >
              <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">ใส่วันเกิดของคุณ</label>
              <div className="flex gap-4">
                <input 
                  placeholder="วันที่ (1-31)"
                  value={birthday.day}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    const num = parseInt(val);
                    if (val === '' || (num >= 1 && num <= 31)) {
                      setBirthday(prev => ({...prev, day: val.slice(0, 2)}));
                    }
                  }}
                  className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-lg font-bold text-center outline-none focus:border-indigo-500"
                />
                <input 
                  placeholder="เดือน (1-12)"
                  value={birthday.month}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    const num = parseInt(val);
                    if (val === '' || (num >= 1 && num <= 12)) {
                      setBirthday(prev => ({...prev, month: val.slice(0, 2)}));
                    }
                  }}
                  className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-lg font-bold text-center outline-none focus:border-indigo-500"
                />
              </div>
            </motion.div>
          )}

          {mode === 'luck' && (
            <motion.div 
              key="luck"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              <h3 className="text-2xl font-black text-slate-800">ดวงล้วนๆ ไม่มีผสม</h3>
              <p className="text-slate-400 font-medium">กดปุ่มด้านล่างเพื่อรับรหัสโชคดีจากจักรวาล</p>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={generateNumber}
          disabled={isSpinning || (mode === 'zodiac' && !selectedZodiac) || (mode === 'birthday' && (!birthday.day || !birthday.month))}
          className="w-full bg-slate-900 text-white rounded-2xl p-6 text-xl font-black shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:hover:scale-100 flex items-center justify-center space-x-3 group"
        >
          {isSpinning ? (
            <>
              <RefreshCcw className="w-6 h-6 animate-spin" />
              <span>กำลังคำนวณรหัสโชค...</span>
            </>
          ) : (
            <>
              <Dices className="w-6 h-6 group-hover:rotate-12 transition-transform" />
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
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative bg-white border-4 border-indigo-600 rounded-[3rem] px-16 py-8 shadow-2xl flex flex-col items-center">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Lucky Number</span>
                  <div className="text-8xl font-mono font-black text-slate-900 tracking-widest">{result.num}</div>
                </div>
              </div>

              {/* Data Backed Insight */}
              <div className={`card-minimal flex items-center space-x-6 p-6 border-l-8 ${result.stats.length > 0 ? 'border-l-green-500' : 'border-l-slate-200'}`}>
                <div className={`p-4 rounded-2xl ${result.stats.length > 0 ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                   <TrendingUp className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-slate-800">
                    {result.stats.length > 0 ? `ว้าว! เลขนี้เคยออกรางวัลมาแล้ว ${result.stats.length} ครั้ง` : 'เลขนี้ยังไม่เคยออกรางวัลเลย (อาจจะมางวดนี้!)'}
                  </h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
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
