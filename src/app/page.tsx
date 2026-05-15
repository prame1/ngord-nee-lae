'use client'

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { fetchFrequencyData, fetchLatestDrawData, fetchAllDraws, checkLotteryNumbers } from '@/app/actions';
import { RankedFrequencies, NumberFrequency, Draw, SearchResult } from '@/lib/lotto';
import { Trophy, Hash, Zap, Award, Star, Coins, Ticket, Flame, Filter, Sparkles, ArrowRight, TrendingUp, LayoutGrid, Hand, Calendar, ClipboardPaste, CheckCircle2, XCircle, AlertCircle, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const YEARS = [2569, 2568, 2567, 2566];

export default function HomePage() {
  const [data, setData] = useState<RankedFrequencies | null>(null);
  const [latestDraw, setLatestDraw] = useState<Draw | null>(null);
  const [allDrawDates, setAllDrawDates] = useState<string[]>([]);
  const [startYear, setStartYear] = useState(2567);
  const [endYear, setEndYear] = useState(2569);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'major' | 'others'>('major');

  // Lotto Checker State
  const [rawInput, setRawInput] = useState('');
  const [selectedDrawDate, setSelectedDrawDate] = useState('');
  const [checkResults, setCheckResults] = useState<{ number: string, prizes: SearchResult[] }[] | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [freq, latest, allDraws] = await Promise.all([
        fetchFrequencyData(startYear, endYear),
        fetchLatestDrawData(),
        fetchAllDraws()
      ]);
      setData(freq);
      setLatestDraw(latest);
      const dates = allDraws.map(d => d.date);
      setAllDrawDates(dates);
      if (latest) setSelectedDrawDate(latest.date);
      setLoading(false);
    };
    load();
  }, [startYear, endYear]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Allow only digits and whitespace/newlines
    const val = e.target.value.replace(/[^\d\s,]/g, '');
    setRawInput(val);
  };

  const extractNumbers = (text: string) => {
    // Strictly extract only 6-digit numbers
    const matches = text.match(/\b\d{6}\b/g) || [];
    return matches;
  };

  const handleCheck = async () => {
    const numbers = extractNumbers(rawInput);
    if (numbers.length === 0) return;
    
    setIsChecking(true);
    const results = await checkLotteryNumbers(numbers, selectedDrawDate);
    setCheckResults(results);
    setIsChecking(false);
  };

  const totalWon = useMemo(() => {
    if (!checkResults) return 0;
    return checkResults.reduce((sum, res) => {
      const prizeSum = res.prizes.reduce((pSum, p) => pSum + parseInt(p.reward), 0);
      return sum + prizeSum;
    }, 0);
  }, [checkResults]);

  // Seeded Random Logic: Only changes when the latest draw date changes
  const spiritualPicks = useMemo(() => {
    if (!latestDraw) return [];
    
    const seedStr = latestDraw.date;
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) {
      seed += seedStr.charCodeAt(i);
    }

    const seededRandom = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    const getNum = (s: number, digits: number) => {
      const r = seededRandom(s);
      return Math.floor(r * Math.pow(10, digits)).toString().padStart(digits, '0');
    };

    return [
      { label: 'เลขพุ่งแรง (2 ตัว)', number: getNum(seed + 1, 2), color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
      { label: 'นิมิตหมาย (3 ตัว)', number: getNum(seed + 2, 3), color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
      { label: 'โชคใหญ่ (6 ตัว)', number: getNum(seed + 3, 6), color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    ];
  }, [latestDraw]);

  const PrizeColumn = ({ title, icon: Icon, items, colorClass, delay }: { title: string, icon: any, items: NumberFrequency[], colorClass: string, delay: number }) => {
    const maxCount = useMemo(() => Math.max(...items.map(i => i.count), 1), [items]);

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="card-minimal !p-4 sm:!p-6 space-y-4 flex flex-col h-full hover:shadow-card transition-all border-t-4 border-t-transparent hover:border-t-current group"
      >
        <div className={`flex items-center space-x-3 ${colorClass}`}>
          <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <h2 className="text-base sm:text-lg font-black">{title}</h2>
        </div>
        <div className="flex-1 space-y-2">
          {items.length > 0 ? items.map((item, idx) => {
            const widthPct = (item.count / maxCount) * 100;
            const bgClass = colorClass.includes('yellow') ? 'bg-yellow-400' : 
                          colorClass.includes('blue') ? 'bg-blue-400' : 
                          colorClass.includes('emerald') ? 'bg-emerald-400' : 
                          colorClass.includes('purple') ? 'bg-purple-400' :
                          colorClass.includes('slate') ? 'bg-slate-400' :
                          colorClass.includes('indigo') ? 'bg-indigo-400' :
                          colorClass.includes('pink') ? 'bg-pink-400' : 'bg-orange-400';

            return (
              <div key={idx} className="relative flex justify-between items-center p-2 rounded-lg overflow-hidden group/item border border-slate-50 hover:border-slate-200 transition-all">
                <div 
                  className={`absolute left-0 top-0 bottom-0 opacity-10 transition-all duration-1000 ease-out ${bgClass}`}
                  style={{ width: `${widthPct}%` }}
                />
                <div className="flex items-center space-x-2 relative z-10">
                  <span className="text-[10px] font-black text-slate-300 w-3">{idx + 1}.</span>
                  <span className="font-mono text-sm sm:text-base font-black text-slate-700">{item.number}</span>
                </div>
                <div className="flex items-center space-x-1 relative z-10">
                  <span className="text-[10px] font-black text-slate-900">{item.count}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">ครั้ง</span>
                </div>
              </div>
            );
          }) : (
            <div className="py-10 text-center text-slate-400 text-xs italic">ไม่มีข้อมูลในช่วงปีนี้</div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-10 pb-20 max-w-6xl mx-auto px-4">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 pt-4 sm:pt-0"
      >
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight text-shadow-sm">
            งวดนี้แหละ <span className="text-blue-600">|</span> <span className="text-slate-400 font-light block sm:inline">Ngord-Nee-Lae</span>
          </h1>
          <p className="text-xs sm:text-xl text-slate-600 font-medium px-4 opacity-80">
            "คู่คิดด้านข้อมูลเชิงสถิติสำหรับเลือกซื้อหวยงวดนี้"
          </p>
        </div>

        {/* Lucky Randomizer CTA - Siamsee Theme */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="max-w-5xl mx-auto bg-gradient-to-r from-orange-500 to-amber-600 rounded-[2rem] sm:rounded-[2.5rem] p-1 text-white shadow-2xl shadow-orange-200 transition-transform"
        >
          <Link href="/random" className="flex flex-col md:flex-row items-center justify-between p-5 sm:p-8 sm:px-12 gap-6 bg-slate-900/10 rounded-[1.8rem] sm:rounded-[2.2rem] backdrop-blur-md relative overflow-hidden group">
            <div className="flex flex-col md:flex-row items-center md:space-x-8 gap-4 relative z-10">
              <div className="p-3 sm:p-5 bg-white/20 rounded-2xl sm:rounded-3xl group-hover:bg-white/30 transition-colors shadow-inner">
                <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-white animate-pulse" />
              </div>
              <div className="space-y-1 text-center md:text-left">
                <h2 className="text-xl sm:text-3xl font-black text-white">ตั้งจิตอธิษฐาน</h2>
                <p className="text-[10px] sm:text-lg text-orange-100 font-medium opacity-90">เขย่าเซียมซีรับเลขนำโชคเฉพาะคุณ</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-white text-orange-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-base shadow-xl group-hover:bg-orange-50 transition-all relative z-10 whitespace-nowrap active:scale-95">
              <span>เขย่าเลย</span>
              <ArrowRight className="w-4 h-4 sm:w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </motion.div>
      </motion.section>

      {/* Smart Lotto Checker Section */}
      <section className="max-w-4xl mx-auto space-y-6">
        <div className="card-minimal p-6 sm:p-10 space-y-8 bg-white/80 backdrop-blur-xl border-blue-100 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-2 text-blue-600">
                <ClipboardPaste className="w-5 h-5" />
                <h2 className="text-xl sm:text-2xl font-black">ตรวจผลรางวัล</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">กรอกเลขให้ครบ <span className="text-blue-600 font-bold">6 หลัก</span> (เว้นวรรคด้วย Spacebar เพื่อตรวจหลายใบพร้อมกัน)</p>
              <textarea 
                value={rawInput}
                onChange={(e) => {
                  // Strictly allow only digits and spaces
                  const val = e.target.value.replace(/[^\d\s]/g, '');
                  setRawInput(val);
                }}
                placeholder="ตัวอย่าง: 123456 987654 000111"
                className="w-full h-32 p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white outline-none transition-all font-mono text-lg resize-none shadow-inner"
              />
            </div>

            <div className="space-y-4 w-full md:w-64">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" /> เลือกงวดที่จะตรวจ
                </label>
                <select 
                  value={selectedDrawDate}
                  onChange={(e) => setSelectedDrawDate(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-slate-100 border-none font-black text-sm cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  {allDrawDates.map(date => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
              </div>
              
              <button 
                onClick={handleCheck}
                disabled={isChecking || !rawInput.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center space-x-2 active:scale-95"
              >
                {isChecking ? (
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>ตรวจรางวัลทันที</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Area */}
          <AnimatePresence>
            {checkResults && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="pt-6 border-t border-slate-100 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-800">สรุปผลการตรวจ</h3>
                  <div className={`px-4 py-2 rounded-full font-black text-sm ${totalWon > 0 ? 'bg-green-100 text-green-600 animate-bounce' : 'bg-slate-100 text-slate-400'}`}>
                    {totalWon > 0 ? `ยินดีด้วย! คุณได้รับเงินรางวัล ${totalWon.toLocaleString()} บาท` : 'ไม่ถูกรางวัลในงวดนี้'}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {checkResults.map((res, i) => (
                    <div key={i} className={`p-4 rounded-xl border-2 flex items-center justify-between ${res.prizes.length > 0 ? 'border-green-200 bg-green-50/50' : 'border-slate-50 bg-slate-50/30'}`}>
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl font-mono font-black text-slate-900 tracking-tighter">{res.number}</div>
                        {res.prizes.length > 0 ? (
                          <div className="space-y-0.5">
                            {res.prizes.map((p, pi) => (
                              <div key={pi} className="text-[10px] font-black text-green-600 uppercase">{p.prizeName}</div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-[10px] font-bold text-slate-300 uppercase">ไม่ถูกรางวัล</div>
                        )}
                      </div>
                      {res.prizes.length > 0 ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500 fill-green-50" />
                      ) : (
                        <XCircle className="w-6 h-6 text-slate-200" />
                      )}
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => setCheckResults(null)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors mx-auto block"
                >
                  ล้างผลการตรวจ
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Latest Results Section */}
      <AnimatePresence>
        {!loading && latestDraw && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-2 text-slate-400">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">งวดล่าสุด: {latestDraw.date}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Prize 1 */}
              <div className="card-minimal bg-slate-900 text-white border-none p-6 sm:p-8 flex flex-col items-center justify-center space-y-2 group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Trophy className="w-12 h-12 text-yellow-400" />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">รางวัลที่ 1</span>
                <div className="text-4xl sm:text-5xl font-mono font-black tracking-tighter text-yellow-400">
                  {latestDraw.prizes.find(p => p.id === 'prizeFirst')?.number[0] || '------'}
                </div>
              </div>

              {/* Back 2 */}
              <div className="card-minimal bg-white border-slate-200 p-6 sm:p-8 flex flex-col items-center justify-center space-y-2 group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-blue-600">
                  <Hash className="w-12 h-12" />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">เลขท้าย 2 ตัว</span>
                <div className="text-4xl sm:text-5xl font-mono font-black tracking-tighter text-slate-900">
                  {latestDraw.runningNumbers?.find(p => p.id === 'runningNumberBackTwo')?.number[0] || '--'}
                </div>
              </div>

              {/* 3 Digits (Front & Back) */}
              <div className="card-minimal bg-white border-slate-200 p-6 sm:p-8 flex flex-col items-center justify-center space-y-4 group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-emerald-600">
                  <Zap className="w-12 h-12" />
                </div>
                <div className="flex w-full justify-around gap-4">
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">เลขหน้า 3 ตัว</span>
                    <div className="text-2xl sm:text-3xl font-mono font-black text-slate-900">
                      {latestDraw.runningNumbers?.find(p => p.id === 'runningNumberFrontThree')?.number.join(' ') || '--- ---'}
                    </div>
                  </div>
                  <div className="w-px h-12 bg-slate-100"></div>
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">เลขท้าย 3 ตัว</span>
                    <div className="text-2xl sm:text-3xl font-mono font-black text-slate-900">
                      {latestDraw.runningNumbers?.find(p => p.id === 'runningNumberBackThree')?.number.join(' ') || '--- ---'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* The Spiritual Focal Point: Owner's Picks */}
      <AnimatePresence>
        {!loading && spiritualPicks.length > 0 && (
          <div className="space-y-8 py-4">
            <div className="flex flex-col items-center space-y-3">
              <div className="flex items-center space-x-3 text-orange-600">
                <Hand className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" />
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">เลขมงคลประจำงวด</h2>
              </div>
              <div className="max-w-2xl bg-white border border-orange-100 p-4 rounded-2xl shadow-sm mx-2">
                <p className="text-[11px] sm:text-sm text-slate-500 font-medium text-center leading-relaxed">
                  "เลขชุดนี้เกิดจากการตั้งจิตอธิษฐานและสุ่มหลังจาก <span className="text-orange-600 font-bold underline">เจ้าของเว็บได้ไปไหว้พระขอพรมา</span> 
                  โดยเลขจะคงอยู่ตลอดงวดและเปลี่ยนใหม่ทันทีเมื่อผลรางวัลรอบถัดไปออก"
                </p>
              </div>
            </div>

            <motion.section 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
            >
              {spiritualPicks.map((pick, i) => (
                <div key={i} className={`card-minimal border-2 ${pick.border} ${pick.bg} flex flex-col items-center justify-center p-8 sm:p-10 space-y-3 sm:space-y-4 shadow-2xl hover:scale-105 transition-transform group relative overflow-hidden ring-4 ring-white`}>
                   <div className="absolute top-[-20px] right-[-20px] p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                      <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 text-orange-400" />
                   </div>
                   <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] ${pick.color}`}>{pick.label}</span>
                   <div className="text-5xl sm:text-7xl font-mono font-black text-slate-900 tracking-tighter drop-shadow-sm">{pick.number}</div>
                   <div className="flex items-center gap-1.5 text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100 pt-3 mt-2 w-full justify-center">
                      <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-amber-400 fill-amber-400" />
                      Calculated by Faith
                      <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-amber-400 fill-amber-400" />
                   </div>
                </div>
              ))}
            </motion.section>
          </div>
        )}
      </AnimatePresence>

      {/* Advanced Filter & Tab System */}
      <section className="space-y-6 sm:space-y-8 pt-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 border-t border-slate-100 pt-10">
          {/* Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200 w-full sm:w-fit overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveTab('major')}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 sm:px-8 py-3 rounded-xl text-xs sm:text-sm font-black transition-all ${activeTab === 'major' ? 'bg-white text-blue-600 shadow-md scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Trophy className="w-4 h-4" />
              <span>รางวัลหลัก</span>
            </button>
            <button 
              onClick={() => setActiveTab('others')}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 sm:px-8 py-3 rounded-xl text-xs sm:text-sm font-black transition-all ${activeTab === 'others' ? 'bg-white text-blue-600 shadow-md scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>รางวัลอื่นๆ</span>
            </button>
          </div>

          {/* Year Filter */}
          <div className="flex items-center space-x-2 sm:space-x-4 bg-white p-2 rounded-2xl shadow-soft border border-slate-100 w-full sm:w-auto justify-center">
            <div className="flex items-center px-2 sm:px-4 space-x-2 text-slate-500 border-r border-slate-100">
              <Filter className="w-3 h-3 sm:w-4 h-4" />
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">พ.ศ.</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 px-2">
              <select 
                value={startYear} onChange={(e) => setStartYear(Number(e.target.value))}
                className="bg-slate-50 text-[10px] sm:text-xs font-black p-1.5 sm:p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {YEARS.slice().reverse().map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <span className="text-slate-300 font-bold">-</span>
              <select 
                value={endYear} onChange={(e) => setEndYear(Number(e.target.value))}
                className="bg-slate-50 text-[10px] sm:text-xs font-black p-1.5 sm:p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Rankings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card-minimal h-96 animate-pulse bg-slate-100/50 rounded-2xl"></div>
            ))}
          </div>
        ) : data && (
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === 'major' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8"
          >
            {activeTab === 'major' ? (
              <>
                <PrizeColumn title="รางวัลที่ 1" icon={Trophy} items={data.prize1} colorClass="text-yellow-600" delay={0.1} />
                <PrizeColumn title="เลขท้าย 2 ตัว" icon={Hash} items={data.back2} colorClass="text-blue-600" delay={0.15} />
                <PrizeColumn title="เลขหน้า 3 ตัว" icon={Zap} items={data.front3} colorClass="text-emerald-600" delay={0.2} />
                <PrizeColumn title="เลขท้าย 3 ตัว" icon={Award} items={data.back3} colorClass="text-purple-600" delay={0.25} />
              </>
            ) : (
              <>
                <PrizeColumn title="รางวัลที่ 2" icon={Star} items={data.prize2} colorClass="text-slate-600" delay={0.1} />
                <PrizeColumn title="รางวัลที่ 3" icon={Coins} items={data.prize3} colorClass="text-indigo-500" delay={0.15} />
                <PrizeColumn title="รางวัลที่ 4" icon={Ticket} items={data.prize4} colorClass="text-pink-500" delay={0.2} />
                <PrizeColumn title="รางวัลที่ 5" icon={Flame} items={data.prize5} colorClass="text-orange-500" delay={0.25} />
              </>
            )}
          </motion.div>
        )}
      </section>
    </div>
  );
}
