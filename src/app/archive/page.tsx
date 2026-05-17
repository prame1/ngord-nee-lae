'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { fetchYearlyArchive } from '@/app/actions';
import { Draw } from '@/lib/lotto';
import { parseThaiDate } from '@/lib/utils';
import { Calendar, ChevronRight, Target } from 'lucide-react';

const YEARS = ['2569', '2568', '2567', '2566'];

export default function ArchivePage() {
  const [selectedYear, setSelectedYear] = useState('2569');
  const [heatmapMode, setHeatmapMode] = useState<'all' | 'two' | 'three'>('two');
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeDigit, setActiveDigit] = useState<{digit: number, count: number} | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchYearlyArchive(selectedYear);
      setDraws(data);
      setLoading(false);
      setActiveDigit(null);
    };
    loadData();
  }, [selectedYear]);

  // Heatmap Data: Frequency of each digit (0-9) filtered by mode
  const digitHeatmap = useMemo(() => {
    const counts = Array(10).fill(0);
    draws.forEach(draw => {
      let numbersToCount: string[] = [];
      
      if (heatmapMode === 'all') {
        const mainPrizes = draw.prizes.flatMap(p => p.number);
        const runningNums = draw.runningNumbers?.flatMap(p => p.number) || [];
        numbersToCount = [...mainPrizes, ...runningNums];
      } else if (heatmapMode === 'two') {
        numbersToCount = draw.runningNumbers?.find(p => p.id === 'runningNumberBackTwo')?.number || [];
      } else if (heatmapMode === 'three') {
        const front = draw.runningNumbers?.find(p => p.id === 'runningNumberFrontThree')?.number || [];
        const back = draw.runningNumbers?.find(p => p.id === 'runningNumberBackThree')?.number || [];
        numbersToCount = [...front, ...back];
      }
      
      numbersToCount.forEach(numStr => {
        [...numStr].forEach(char => {
          const digit = parseInt(char);
          if (!isNaN(digit)) counts[digit]++;
        });
      });
    });

    const max = Math.max(...counts);
    const min = Math.min(...counts.filter(c => c > 0)) || 0;
    
    return counts.map((count, digit) => {
      const range = max - min;
      const intensity = range > 0 ? (count - min) / range : (count > 0 ? 1 : 0);
      return { digit, count, intensity };
    });
  }, [draws, heatmapMode]);

  const getHeatColor = (intensity: number) => {
    if (intensity === 0) return 'bg-slate-50 text-slate-300';
    if (intensity < 0.15) return 'bg-indigo-50 text-indigo-400';
    if (intensity < 0.3) return 'bg-indigo-200 text-indigo-800';
    if (intensity < 0.5) return 'bg-indigo-400 text-white';
    if (intensity < 0.7) return 'bg-indigo-600 text-white';
    if (intensity < 0.9) return 'bg-indigo-800 text-white shadow-sm';
    return 'bg-slate-900 text-white shadow-xl ring-2 ring-indigo-500 ring-offset-1';
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-4">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">สถิติรายปี</h1>
          <p className="text-slate-500 font-medium text-lg italic">"เจาะลึกทุกรางวัล สแกนทุกตัวเลขที่เคยออกจริง"</p>
        </div>

        {/* Year Tabs */}
        <div className="flex space-x-1 p-1.5 bg-slate-200/50 backdrop-blur rounded-2xl w-fit mx-auto md:mx-0 border border-slate-200">
          {YEARS.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-6 sm:px-8 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                selectedYear === year
                  ? 'bg-white text-blue-600 shadow-card scale-[1.02]'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {!loading && draws.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-top-4 duration-700 px-4">
          {/* Heatmap Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card-minimal space-y-6 sticky top-24 border-t-4 border-t-indigo-500 shadow-xl bg-white/80 backdrop-blur-sm">
              <div className="space-y-4 text-center">
                <div className="flex items-center justify-center gap-2">
                   <Target className="w-5 h-5 text-indigo-600" />
                   <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Digit Heatmap</h3>
                </div>
                
                {/* Heatmap Mode Tabs */}
                <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
                  {(['all', 'two', 'three'] as const).map((m) => (
                    <button 
                      key={m}
                      onClick={() => setHeatmapMode(m)}
                      className={`flex-1 text-[10px] font-black py-2 rounded-xl transition-all ${heatmapMode === m ? 'bg-white text-indigo-600 shadow-md scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {m === 'all' ? 'รวม' : m === 'two' ? '2 ตัว' : '3 ตัว'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2.5 relative">
                {digitHeatmap.map((item) => (
                  <button 
                    key={item.digit}
                    onClick={() => setActiveDigit(activeDigit?.digit === item.digit ? null : { digit: item.digit, count: item.count })}
                    className={`aspect-square flex flex-col items-center justify-center rounded-xl transition-all duration-300 hover:scale-110 group relative ${getHeatColor(item.intensity)} ${activeDigit?.digit === item.digit ? 'ring-4 ring-indigo-500 scale-110 z-20' : ''}`}
                  >
                    <span className="text-xl font-black">{item.digit}</span>
                    
                    {/* Desktop Hover Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 lg:group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-y-1 lg:group-hover:translate-y-0 z-50 hidden lg:block">
                      <div className="bg-slate-900 text-white px-3 py-2.5 rounded-2xl shadow-2xl border border-slate-700 min-w-[100px] text-center relative">
                        <div className="text-sm font-black leading-none mb-1">
                          {item.count.toLocaleString()}
                        </div>
                        <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">ครั้งในปี {selectedYear}</div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900"></div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Mobile Active Display */}
              {activeDigit && (
                <div className="lg:hidden p-4 bg-slate-900 text-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl font-black text-indigo-400">{activeDigit.digit}</div>
                      <div className="h-8 w-[1px] bg-slate-700"></div>
                      <div>
                        <div className="text-lg font-black">{activeDigit.count.toLocaleString()} ครั้ง</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">สถิติในปี {selectedYear}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveDigit(null)}
                      className="p-2 hover:bg-slate-800 rounded-full text-slate-500 font-bold text-xs uppercase"
                    >
                      ปิด
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>น้อย</span>
                <div className="flex gap-1 px-2 flex-1 justify-center">
                  {[0, 0.1, 0.25, 0.45, 0.65, 0.85, 1.0].map(i => (
                    <div key={i} className={`h-2.5 flex-1 rounded-full ${getHeatColor(i)}`}></div>
                  ))}
                </div>
                <span>มาก</span>
              </div>
              
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                <p className="text-[11px] text-indigo-700 leading-relaxed font-bold">
                  <span className="font-black underline uppercase">Insight:</span> {heatmapMode === 'two' ? 'เน้นเลขโดดที่ออกในเลขท้าย 2 ตัว' : heatmapMode === 'three' ? 'เน้นเลขโดดที่ออกในเลข 3 ตัว' : 'ภาพรวมเลขโดดจากทุกรางวัล'}
                </p>
              </div>
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-3 space-y-6">
            {draws.map((draw, idx) => {
              const p1 = draw.prizes.find(p => p.id === 'prizeFirst')?.number[0] || '------';
              const b2 = draw.runningNumbers?.find(p => p.id === 'runningNumberBackTwo')?.number[0] || '--';
              const f3 = draw.runningNumbers?.find(p => p.id === 'runningNumberFrontThree')?.number?.join(' ') || '--- ---';
              const b3 = draw.runningNumbers?.find(p => p.id === 'runningNumberBackThree')?.number?.join(' ') || '--- ---';

              return (
                <div key={idx} className="card-minimal group hover:border-blue-400 transition-all duration-300 p-0 overflow-hidden shadow-soft hover:shadow-card bg-white">
                  <div className="bg-slate-50 px-4 sm:px-8 py-3 sm:py-4 border-b border-slate-100 flex justify-between items-center group-hover:bg-blue-50/50 transition-colors">
                    <div className="flex items-center space-x-2 sm:space-x-3 text-blue-600">
                      <Calendar className="w-4 h-4 sm:w-5 h-5" />
                      <span className="text-sm sm:text-base font-black tracking-tight">{draw.date}</span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 items-center text-center md:text-left">
                    <div className="space-y-1">
                      <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">รางวัลที่ 1</span>
                      <div className="text-2xl sm:text-3xl font-mono font-black text-slate-800 tracking-tighter">{p1}</div>
                    </div>
                    <div className="space-y-1 border-l border-slate-100 pl-4 sm:pl-8">
                      <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">เลขท้าย 2 ตัว</span>
                      <div className="text-2xl sm:text-3xl font-mono font-black text-blue-600 tracking-tighter">{b2}</div>
                    </div>
                    <div className="space-y-1 border-l border-slate-100 pl-8 hidden md:block text-left">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">เลขหน้า 3 ตัว</span>
                      <div className="text-lg font-mono font-bold text-slate-600 tracking-wider">{f3}</div>
                    </div>
                    <div className="space-y-1 border-l border-slate-100 pl-8 hidden md:block text-left">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">เลขท้าย 3 ตัว</span>
                      <div className="text-lg font-mono font-bold text-slate-600 tracking-wider">{b3}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-40 space-y-6">
          <div className="relative">
            <div className="h-20 w-20 border-4 border-slate-100 rounded-full"></div>
            <div className="absolute top-0 h-20 w-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] animate-pulse">Scanning Archive...</p>
        </div>
      )}
    </div>
  );
}
