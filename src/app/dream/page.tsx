'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { fetchBeliefs, handleSearch } from '@/app/actions';
import { DreamArticle } from '@/lib/beliefs';
import { SearchResult } from '@/lib/lotto';
import { Sparkles, Search, ArrowLeft, TrendingUp, Calendar, Hash } from 'lucide-react';

export default function DreamPage() {
  const [dreams, setDreams] = useState<DreamArticle[]>([]);
  const [selectedDream, setSelectedDream] = useState<DreamArticle | null>(null);
  const [query, setQuery] = useState('');
  const [stats, setStats] = useState<Record<string, SearchResult[]>>({});
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await fetchBeliefs();
      setDreams(res);
      setLoading(false);
    };
    load();
  }, []);

  const filteredDreams = useMemo(() => {
    return dreams.filter(d => 
      !query || d.title.includes(query) || d.category.includes(query)
    );
  }, [dreams, query]);

  const openDream = async (dream: DreamArticle) => {
    setSelectedDream(dream);
    setLoadingStats(true);
    
    const newStats: Record<string, SearchResult[]> = {};
    for (const num of dream.luckyNumbers) {
      const res = await handleSearch(num);
      newStats[num] = res;
    }
    setStats(newStats);
    setLoadingStats(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (selectedDream) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
        <button 
          onClick={() => setSelectedDream(null)}
          className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับไปดูรายการฝันทั้งหมด</span>
        </button>

        <div className="card-minimal space-y-6 sm:space-y-8 border-t-8 border-t-blue-600 p-6 sm:p-8 shadow-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                {selectedDream.category}
              </span>
              <h1 className="text-2xl sm:text-5xl font-black text-slate-900 tracking-tight">{selectedDream.title}</h1>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              {selectedDream.luckyNumbers.map((num, idx) => (
                <div key={idx} className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-3 sm:p-4 min-w-[70px] sm:min-w-[80px] text-center shadow-md shadow-blue-200">
                  <div className="text-xl sm:text-2xl font-mono font-black">{num}</div>
                  <div className="text-[8px] font-bold opacity-70 uppercase tracking-tighter">เด็ด</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6 sm:p-8 bg-blue-50/50 rounded-2xl sm:rounded-3xl border border-blue-100/50 relative overflow-hidden">
             <Sparkles className="absolute top-[-10px] right-[-10px] w-16 sm:w-24 h-16 sm:h-24 text-blue-100/30" />
            <h3 className="text-[10px] sm:text-sm font-black text-blue-400 uppercase mb-4 tracking-widest flex items-center gap-2">
              <span className="w-6 sm:w-8 h-[2px] bg-blue-200"></span>
              ความหมายของฝันนี้
            </h3>
            <p className="text-lg sm:text-xl text-slate-700 leading-relaxed font-medium relative z-10">
              "{selectedDream.description}"
            </p>
          </div>
        </div>

        {/* Statistical Insights - Clearer Version */}
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
             <div className="flex items-center space-x-2 text-slate-800">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl sm:text-2xl font-black">วิเคราะห์ความเป็นไปได้</h2>
            </div>
            <p className="text-slate-500 text-[10px] sm:text-sm font-medium italic">
              *เปรียบเทียบเลขจากการทำนาย กับผลสลากจริงในช่วงปี 2566 - 2569 เพื่อดูว่าเลขไหน "เคยออกจริง" บ่อยที่สุด
            </p>
          </div>

          {loadingStats ? (
            <div className="py-20 text-center animate-pulse space-y-6 bg-white rounded-3xl border border-slate-100">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
                <div className="relative bg-white border-2 border-blue-600 rounded-full w-full h-full flex items-center justify-center">
                   <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-slate-800 font-black text-lg">กำลังประมวลผลข้อมูลทางสถิติ...</p>
                <p className="text-slate-400 text-xs uppercase tracking-widest">Scanning all draws in archive</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {selectedDream.luckyNumbers.map((num, idx) => {
                const results = stats[num] || [];
                const isHot = results.length > 0;
                
                return (
                  <div key={idx} className={`card-minimal flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all border-l-8 ${isHot ? 'border-l-green-500 bg-white' : 'border-l-slate-200 bg-slate-50/50 grayscale-[0.5]'} hover:shadow-card p-6`}>
                    <div className="flex items-center space-x-4 sm:space-x-8">
                      <div className="flex flex-col items-center">
                        <div className={`text-3xl sm:text-4xl font-mono font-black ${isHot ? 'text-blue-600' : 'text-slate-400'}`}>{num}</div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">ตัวเลข</span>
                      </div>
                      
                      <div className="space-y-1">
                         <div className={`text-base sm:text-lg font-black ${isHot ? 'text-green-600' : 'text-slate-500'}`}>
                           {isHot ? `พบสถิติออกรางวัล ${results.length} ครั้ง` : 'ยังไม่พบในประวัติการออกรางวัล'}
                         </div>
                         <p className="text-[10px] sm:text-xs text-slate-400 font-medium max-w-md">
                           {isHot 
                            ? 'เป็นตัวเลขที่มีประวัติการออกรางวัลจริงในรอบ 3 ปีที่ผ่านมา ถือว่าเป็นเลขที่น่าจับตามอง'
                            : 'ในช่วง 3 ปีนี้ เลขนี้ยังไม่เคยปรากฏในรางวัลหลัก อาจจะเป็นเลขที่เงียบมานาน'}
                         </p>
                      </div>
                    </div>

                    {isHot && (
                      <div className="flex flex-col gap-2 min-w-full sm:min-w-[240px]">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 mb-1">งวดล่าสุดที่ออก</span>
                        {results.slice(0, 2).map((r, rIdx) => (
                          <div key={rIdx} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <div className="flex items-center space-x-2 text-slate-600">
                              <Calendar className="w-3 h-3" />
                              <span className="text-[10px] font-bold">{r.date}</span>
                            </div>
                            <span className="text-[10px] font-black text-blue-600 px-2 py-0.5 bg-blue-50 rounded">{r.prizeName}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center justify-center p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl mb-2 shadow-sm">
          <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600" />
        </div>
        <div className="space-y-2 px-4">
          <h1 className="text-3xl sm:text-6xl font-black tracking-tighter text-slate-900 leading-tight">
            คลังคำทำนายฝัน
          </h1>
          <p className="text-sm sm:text-xl text-slate-500 font-semibold max-w-2xl mx-auto">
            "เพราะทุกฝันมีความหมาย และทุกหมายเลขมีสถิติ"
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative group px-4">
          <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
            <Search className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ลองพิมพ์ 'งู' หรือ 'ปลา'..."
            className="block w-full pl-12 sm:pl-16 pr-6 sm:pr-8 py-4 sm:py-6 bg-white border-2 border-slate-100 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-card focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-lg sm:text-2xl font-bold placeholder:text-slate-300"
          />
        </div>
      </section>

      {/* Article Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card-minimal h-64 animate-pulse bg-slate-100/50 rounded-[2rem]"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4">
          {filteredDreams.map((dream) => (
            <div 
              key={dream.id}
              onClick={() => openDream(dream)}
              className="card-minimal flex flex-col justify-between group hover:border-blue-300 hover:shadow-xl transition-all cursor-pointer border-t-4 border-t-transparent hover:border-t-blue-500 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                 <Sparkles className="w-6 sm:w-8 h-6 sm:h-8 text-blue-400" />
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest">
                    {dream.category}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                  {dream.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 font-medium leading-relaxed">
                  {dream.description}
                </p>
              </div>

              <div className="mt-6 sm:mt-8 flex items-center justify-between">
                <div className="flex -space-x-2 sm:-space-x-3">
                  {dream.luckyNumbers.slice(0, 4).map((n, i) => (
                    <div key={i} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-600 border-2 sm:border-4 border-white flex items-center justify-center text-[10px] sm:text-sm font-black text-white z-10 shadow-lg group-hover:scale-110 transition-transform">
                      {n}
                    </div>
                  ))}
                  {dream.luckyNumbers.length > 4 && (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-100 border-2 sm:border-4 border-white flex items-center justify-center text-[8px] sm:text-[10px] font-black text-slate-400 z-0">
                      +{dream.luckyNumbers.length - 4}
                    </div>
                  )}
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                   <ArrowLeft className="w-4 h-4 sm:w-5 h-5 rotate-180" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredDreams.length === 0 && (
        <div className="text-center py-40 card-minimal border-dashed bg-slate-50/50 rounded-[3rem]">
          <p className="text-slate-300 font-black text-2xl italic tracking-tighter">ไม่พบบทความสำหรับ "{query}"</p>
          <p className="text-slate-400 font-bold mt-2">ลองค้นหาด้วยคำอื่นๆ ดูนะครับ</p>
        </div>
      )}
    </div>
  );
}
