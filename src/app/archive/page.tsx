'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { fetchYearlyArchive } from '@/app/actions';
import { Draw } from '@/lib/lotto';
import { parseThaiDate } from '@/lib/utils';
import { Calendar, ChevronRight } from 'lucide-react';

const YEARS = ['2569', '2568', '2567', '2566'];

export default function ArchivePage() {
  const [selectedYear, setSelectedYear] = useState('2568');
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchYearlyArchive(selectedYear);
      // Sort descending (latest first) using robust date parsing
      const sortedData = [...data].sort((a, b) => parseThaiDate(b.date) - parseThaiDate(a.date)); 
      setDraws(sortedData);
      setLoading(false);
    };
    loadData();
  }, [selectedYear]);

  // Heatmap Data: Frequency of each digit (0-9) in 1st Prize and Last 2 for that year
  const digitHeatmap = useMemo(() => {
    const counts = Array(10).fill(0);
    draws.forEach(draw => {
      const p1 = draw.prizes.find(p => p.id === 'prizeFirst')?.number[0] || '';
      const b2 = draw.runningNumbers?.find(p => p.id === 'runningNumberBackTwo')?.number[0] || '';
      [...p1, ...b2].forEach(d => {
        const num = parseInt(d);
        if (!isNaN(num)) counts[num]++;
      });
    });
    const max = Math.max(...counts, 1);
    return counts.map((count, digit) => ({ digit, count, intensity: count / max }));
  }, [draws]);

  const getHeatColor = (intensity: number) => {
    if (intensity === 0) return 'bg-slate-50 text-slate-300';
    if (intensity < 0.3) return 'bg-blue-100 text-blue-600';
    if (intensity < 0.6) return 'bg-blue-300 text-white';
    if (intensity < 0.8) return 'bg-blue-500 text-white shadow-sm';
    return 'bg-blue-700 text-white shadow-md ring-2 ring-blue-400 ring-offset-2';
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">สถิติรายปี</h1>
          <p className="text-slate-500 font-medium text-lg">เจาะลึกทุกเลขรางวัลย้อนหลัง พร้อมวิเคราะห์ความถี่ประจำปี</p>
        </div>

        {/* Year Tabs */}
        <div className="flex space-x-1 p-1.5 bg-slate-200/50 backdrop-blur rounded-2xl w-fit border border-slate-200">
          {YEARS.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-8 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
          {/* Heatmap Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card-minimal space-y-6 sticky top-24 border-t-4 border-t-blue-600">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Digit Heatmap</h3>
                <p className="text-xs text-slate-500">ความถี่ของตัวเลข (0-9) ที่ปรากฏในปีนี้</p>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {digitHeatmap.map((item) => (
                  <div 
                    key={item.digit}
                    className={`aspect-square flex flex-col items-center justify-center rounded-xl transition-all duration-300 hover:scale-110 cursor-help group relative overflow-hidden ${getHeatColor(item.intensity)}`}
                  >
                    <span className="text-xl font-black group-hover:opacity-20 transition-opacity">{item.digit}</span>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <span className="text-sm font-black bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>น้อย</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-blue-100 rounded-sm"></div>
                  <div className="w-3 h-3 bg-blue-300 rounded-sm"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                  <div className="w-3 h-3 bg-blue-700 rounded-sm"></div>
                </div>
                <span>มาก</span>
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
                <div key={idx} className="card-minimal group hover:border-blue-300 transition-all duration-300 p-0 overflow-hidden shadow-soft hover:shadow-card">
                  <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex justify-between items-center group-hover:bg-blue-50/50 transition-colors">
                    <div className="flex items-center space-x-3 text-blue-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-black tracking-tight">{draw.date}</span>
                    </div>
                  </div>

                  <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">รางวัลที่ 1</span>
                      <div className="text-2xl font-mono font-black text-slate-800 tracking-tighter">{p1}</div>
                    </div>
                    <div className="space-y-1 border-l border-slate-100 pl-6">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">เลขท้าย 2 ตัว</span>
                      <div className="text-2xl font-mono font-black text-blue-600 tracking-tighter">{b2}</div>
                    </div>
                    <div className="space-y-1 border-l border-slate-100 pl-6 hidden md:block">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">เลขหน้า 3 ตัว</span>
                      <div className="text-sm font-mono font-bold text-slate-600">{f3}</div>
                    </div>
                    <div className="space-y-1 border-l border-slate-100 pl-6 hidden md:block">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">เลขท้าย 3 ตัว</span>
                      <div className="text-sm font-mono font-bold text-slate-600">{b3}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <div className="relative">
            <div className="h-16 w-16 border-4 border-slate-100 rounded-full"></div>
            <div className="absolute top-0 h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] animate-pulse">Loading Archive...</p>
        </div>
      )}
    </div>
  );
}
