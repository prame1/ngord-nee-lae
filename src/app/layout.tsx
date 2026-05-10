import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "งวดนี้แหละ | Ngord-Nee-Lae",
  description: "คู่คิดด้านข้อมูลเชิงสถิติสำหรับเลือกซื้อหวยงวดนี้",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-slate-50 flex flex-col" suppressHydrationWarning>
        {/* Navigation Bar */}
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
              <div className="flex space-x-3 sm:space-x-8 overflow-x-auto no-scrollbar">
                <Link href="/" className="text-[10px] sm:text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors whitespace-nowrap">
                  หน้าหลัก
                </Link>
                <Link href="/search" className="text-[10px] sm:text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors whitespace-nowrap">
                  ค้นหาเลข
                </Link>
                <Link href="/dream" className="text-[10px] sm:text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors whitespace-nowrap">
                  ทำนายฝัน
                </Link>
                <Link href="/archive" className="text-[10px] sm:text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors whitespace-nowrap">
                  สถิติรายปี
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="w-full bg-white border-t border-slate-200 py-10 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
            <p className="text-sm text-slate-600">
              ข้อมูลสถิติอ้างอิงจาก API โดย <a href="https://github.com/rayriffy" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline">rayriffy</a>
            </p>
            <div className="max-w-2xl mx-auto">
              <p className="text-xs text-slate-500 leading-relaxed">
                <span className="font-bold text-slate-600">วัตถุประสงค์:</span> เว็บไซต์นี้จัดทำขึ้นเพื่อใช้เป็นข้อมูลประกอบการตัดสินใจวิเคราะห์ตัวเลขจากสถิติย้อนหลังเท่านั้น 
                <span className="underline decoration-red-200">ไม่ได้มีเจตนาชักชวนหรือส่งเสริมให้เล่นการพนัน</span> โปรดใช้วิจารณญาณในการรับข้อมูล 
                ผลการออกรางวัลอย่างเป็นทางการกรุณาตรวจสอบกับสำนักงานสลากกินแบ่งรัฐบาล
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
