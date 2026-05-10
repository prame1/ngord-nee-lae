import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AnimatedBackground from "@/components/AnimatedBackground";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";

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
      <body className="antialiased min-h-screen bg-slate-50 flex flex-col relative" suppressHydrationWarning>
        <AnimatedBackground />
        <CustomCursor />
        
        {/* Navigation Bar */}
        <Navbar />

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
