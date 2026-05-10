'use client'

import React, { useState, useMemo } from 'react';
import { handleSearch } from '@/app/actions';
import { SearchResult } from '@/lib/lotto';
import { parseThaiDate } from '@/lib/utils';
import { Search as SearchIcon, TrendingUp, Calendar, Tag, CheckSquare, Square } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const PRIZE_GROUPS = [
  { id: 'p1', label: 'รางวัลที่ 1', ids: ['prizeFirst', 'prizeFirstNear'] },
  { id: 'b2', label: 'เลขท้าย 2 ตัว', ids: ['runningNumberBackTwo'] },
  { id: 't3', label: 'เลขหน้า/ท้าย 3 ตัว', ids: ['runningNumberFrontThree', 'runningNumberBackThree'] },
  { id: 'other', label: 'รางวัลอื่นๆ (2-5)', ids: ['prizeSecond', 'prizeThird', 'prizeForth', 'prizeFifth'] },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [allResults, setAllResults] = useState<SearchResult[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>(['p1', 'b2', 't3', 'other']);
  const [isSearching, setIsSearching] = useState(false);

  const onSearchChange = async (val: string) => {
    setQuery(val);
    if (val.length < 1) {
      setAllResults([]);
      return;
    }
    setIsSearching(true);
    const res = await handleSearch(val);
    setAllResults(res);
    setIsSearching(false);
  };

  const toggleGroup = (id: string) => {
    setSelectedGroups(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  // Filter and Sort results
  const filteredResults = useMemo(() => {
    const allowedIds = PRIZE_GROUPS
      .filter(g => selectedGroups.includes(g.id))
      .flatMap(g => g.ids);

    return allResults
      .filter(r => allowedIds.includes(r.prizeId))
      .sort((a, b) => parseThaiDate(b.date) - parseThaiDate(a.date));
  }, [allResults, selectedGroups]);

  // Data for visualization: Frequency by Year
  const chartData = useMemo(() => {
    const years: Record<string, number> = {};
    filteredResults.forEach(res => {
      const year = res.date.split(' ').pop() || 'Unknown';
      years[year] = (years[year] || 0) + 1;
    });
    return Object.entries(years)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredResults]);

  const COLORS = ['#2563eb', '#4f46e5', '#7c3aed', '#db2777', '#dc2626'];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Search Header */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">ค้นหาเลขเชิงลึก</h1>
          <p className="text-slate-500">วิเคราะห์สถิติตัวเลขที่พิมพ์ ว่าเคยออกรางวัลไหนมาบ้างแบบเจาะลึก</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Input */}
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
              <SearchIcon className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => onSearchChange(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="พิมพ์เลขที่ต้องการ (เช่น 12, 456)..."
              className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-soft focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg font-medium"
            />
            {isSearching && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {PRIZE_GROUPS.map(group => (
              <button
                key={group.id}
                onClick={() => toggleGroup(group.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl border-2 transition-all text-sm font-bold ${
                  selectedGroups.includes(group.id)
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                {selectedGroups.includes(group.id) ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                <span>{group.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {query.length > 0 && filteredResults.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Visualization Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card-minimal space-y-4 sticky top-24">
              <div className="flex items-center space-x-2 text-slate-800 font-bold">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>แนวโน้มความถี่รายปี</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 10 }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 10 }} 
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-700 leading-relaxed font-medium">
                  เลข <span className="font-bold">"{query}"</span> ออกบ่อยที่สุดในปี <span className="font-bold">{chartData.length > 0 ? chartData.reduce((prev, current) => (prev.count > current.count) ? prev : current).name : '-'}</span> 
                  {' '}พบข้อมูลทั้งหมด {filteredResults.length} ครั้งจากงวดที่เลือก
                </p>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                ผลการค้นหา ({filteredResults.length} งวดล่าสุด)
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredResults.map((res, idx) => (
                <div key={idx} className="card-minimal p-4 hover:border-blue-200 hover:shadow-card transition-all group border-l-4 border-l-blue-600">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2 text-blue-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs font-bold">{res.date}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-mono text-2xl font-bold tracking-widest text-slate-800">
                      {res.fullNumber.split(query).map((part, i, arr) => (
                        <React.Fragment key={i}>
                          {part}
                          {i < arr.length - 1 && <span className="text-blue-600 bg-blue-50 px-1 rounded ring-1 ring-blue-200">{query}</span>}
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2 text-slate-500">
                      <Tag className="w-3 h-3" />
                      <span className="text-xs font-bold uppercase tracking-tight">{res.prizeName}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-end">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Reward</span>
                    <span className="text-lg font-extrabold text-slate-900 leading-none">
                      ฿{Number(res.reward).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {query.length > 0 && filteredResults.length === 0 && !isSearching && (
        <div className="text-center py-20 card-minimal border-dashed bg-slate-50/50">
          <div className="text-slate-300 mb-2">
            <SearchIcon className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-slate-500 font-medium">ไม่พบข้อมูลสำหรับเลข "{query}" ในรางวัลที่เลือก</p>
          <p className="text-xs text-slate-400 mt-1">ลองเปลี่ยนรางวัลที่เลือก หรือลองค้นหาด้วยเลข 2-3 หลักแทน</p>
        </div>
      )}
    </div>
  );
}
