'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'หน้าหลัก' },
  { href: '/search', label: 'ค้นหาเลข' },
  { href: '/dream', label: 'ทำนายฝัน' },
  { href: '/archive', label: 'สถิติรายปี' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 relative bg-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                <img src="/favicon.svg" alt="Logo" className="w-6 h-6 invert" />
              </div>
              <span className="text-lg sm:text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
                งวดนี้แหละ
              </span>
            </Link>
          </div>
          <div className="flex space-x-1 sm:space-x-4 overflow-x-auto no-scrollbar ml-4">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl text-[10px] sm:text-sm font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-105'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
