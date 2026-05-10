'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchFrequencyData } from '@/app/actions';
import { RankedFrequencies } from '@/lib/lotto';
import { Trophy, Hash, Zap, Award, Star, Coins, Ticket, Flame, Filter, Dices, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const YEARS = [2569, 2568, 2567, 2566];

export default function HomePage() {
  const [data, setData] = useState<RankedFrequencies | null>(null);
  const [startYear, setStartYear] = useState(2567);
  const [endYear, setEndYear] = useState(2569);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetchFrequencyData(startYear, endYear);
      setData(res);
      setLoading(false);
    };
    load();
  }, [startYear, endYear]);

  const PrizeColumn = ({ title, icon: Icon, items, colorClass, delay }: { title: string, icon: any, items: any[], colorClass: string, delay: number }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="card-minimal space-y-4 flex flex-col h-full hover:shadow-card transition-shadow border-t-4 border-t-transparent hover:border-t-current"
    >
      <div className={`flex items-center space-x-3 ${colorClass}`}>
        <Icon className="w-5 h-5" />
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      <div className="flex-1 space-y-2">
        {items.length > 0 ? items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg group hover:bg-white border border-transparent hover:border-slate-200 transition-all">
            <div className="flex items-center space-x-3">
              <span className="text-[10px] font-bold text-slate-400 w-4">{idx + 1}.</span>
              <span className="font-mono text-base font-bold text-slate-700">{item.number}</span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-500">
              {item.count} ครั้ง
            </span>
          </div>
        )) : (
          <div className="py-10 text-center text-slate-400 text-xs italic">ไม่มีข้อมูลในช่วงปีนี้</div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
            งวดนี้แหละ <span className="text-blue-600">|</span> <span className="text-slate-400 font-light">Ngord-Nee-Lae</span>
          </h1>
          <p className="text-xl text-slate-600 font-medium">
            "คู่คิดด้านข้อมูลเชิงสถิติสำหรับเลือกซื้อหวยงวดนี้"
          </p>
        </div>

        {/* Lucky Randomizer CTA */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-1 text-white shadow-xl shadow-blue-100 transition-transform"
        >
          <Link href="/random" className="flex flex-col md:flex-row items-center justify-between p-6 px-10 gap-6 bg-slate-900/10 rounded-[1.4rem] backdrop-blur-sm relative overflow-hidden group">
            <div className="flex items-center space-x-6 text-left relative z-10">
              <div className="p-4 bg-white/20 rounded-2xl group-hover:bg-white/30 transition-colors">
                <Dices className="w-10 h-10 text-white animate-bounce" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white">คิดเลขไม่ออก?</h2>
                <p className="text-blue-100 font-medium">ให้เราช่วยสุ่มเลขมงคลจากราศีและวันเกิดของคุณ</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-2xl font-black text-sm shadow-lg group-hover:bg-blue-50 transition-colors relative z-10">
              <span>เริ่มสุ่มเลขเลย</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </motion.div>

        {/* Filter UI */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center space-x-4 bg-white p-2 rounded-2xl shadow-soft border border-slate-100"
        >
          <div className="flex items-center px-4 space-x-2 text-slate-500 border-r border-slate-100">
            <Filter className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">ช่วงปี (พ.ศ.)</span>
          </div>
          <div className="flex items-center space-x-2 px-2">
            <select 
              value={startYear} 
              onChange={(e) => setStartYear(Number(e.target.value))}
              className="bg-slate-50 text-sm font-bold p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              {YEARS.slice().reverse().map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <span className="text-slate-300 font-bold">ถึง</span>
            <select 
              value={endYear} 
              onChange={(e) => setEndYear(Number(e.target.value))}
              className="bg-slate-50 text-sm font-bold p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </motion.div>
      </motion.section>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card-minimal h-96 animate-pulse bg-slate-100/50"></div>
          ))}
        </div>
      ) : data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <PrizeColumn title="รางวัลที่ 1" icon={Trophy} items={data.prize1} colorClass="text-yellow-600" delay={0.1} />
          <PrizeColumn title="เลขท้าย 2 ตัว" icon={Hash} items={data.back2} colorClass="text-blue-600" delay={0.15} />
          <PrizeColumn title="เลขหน้า 3 ตัว" icon={Zap} items={data.front3} colorClass="text-emerald-600" delay={0.2} />
          <PrizeColumn title="เลขท้าย 3 ตัว" icon={Award} items={data.back3} colorClass="text-purple-600" delay={0.25} />
          <PrizeColumn title="รางวัลที่ 2" icon={Star} items={data.prize2} colorClass="text-slate-600" delay={0.3} />
          <PrizeColumn title="รางวัลที่ 3" icon={Coins} items={data.prize3} colorClass="text-indigo-500" delay={0.35} />
          <PrizeColumn title="รางวัลที่ 4" icon={Ticket} items={data.prize4} colorClass="text-pink-500" delay={0.4} />
          <PrizeColumn title="รางวัลที่ 5" icon={Flame} items={data.prize5} colorClass="text-orange-500" delay={0.45} />
        </div>
      )}
    </div>
  );
}
