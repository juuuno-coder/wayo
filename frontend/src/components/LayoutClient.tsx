"use client";

import { usePathname } from "next/navigation";
import BottomNav from "./BottomNav";
import FloatingActionButton from "./FloatingActionButton";
import { Smartphone, RefreshCw } from "lucide-react";
import { useState } from "react";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [refreshKey, setRefreshKey] = useState(0);

  const isAdminPage = pathname?.startsWith("/admin");
  const isSideApp = pathname?.startsWith("/wayo") || pathname?.startsWith("/invitations");

  // 1. 관리자 페이지는 전체 화면
  if (isAdminPage) {
    return <>{children}</>;
  }

  // 2. 사이드 앱 (WAYO/초대장) 내부 진입 시 - 심플 레이아웃 (iframe 내부에서 보여질 화면)
  if (isSideApp) {
     return (
        <div className="min-h-screen bg-white">
           {children}
        </div>
     );
  }

  // 3. 메인 앱 개발 환경 (듀얼 스크린 + PC 설명)
  return (
    <div className="min-h-screen bg-[#F3F4F6] flex justify-center overflow-x-hidden p-4 lg:p-8">
      <div className="w-full max-w-[1600px] flex gap-8 items-center relative">
        
        {/* Left: PC Branding Area */}
        <div className="flex-1 hidden xl:flex flex-col justify-center animate-in fade-in slide-in-from-left duration-1000">
           <div className="max-w-xl">
            <div className="mb-10">
              <h1 className="text-6xl font-black tracking-tighter text-gray-900 mb-4 drop-shadow-sm">
                가보자고<span className="text-green-500">!</span>
              </h1>
              <p className="text-2xl text-gray-800 font-bold leading-tight">
                전국의 모든 이벤트를
                <br />
                <span className="text-green-600 underline decoration-green-200 underline-offset-8">한눈에 모아보는</span> 플랫폼
              </p>
            </div>

            {/* Search Bar (PC) */}
            <div className="mb-8 group">
              <div className="relative transform transition-all hover:scale-[1.01]">
                <input
                  type="text"
                  placeholder="어떤 이벤트를 찾으시나요?"
                  className="w-full px-6 py-5 rounded-2xl border-none shadow-[0_10px_40px_rgba(0,0,0,0.06)] focus:shadow-[0_15px_50px_rgba(0,0,0,0.1)] focus:outline-none text-lg bg-white/80 backdrop-blur-md transition-all"
                />
                <button className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-green-500 text-white px-8 py-3.5 rounded-xl font-black text-base hover:bg-green-600 active:scale-95 transition-all shadow-lg shadow-green-200">
                  검색
                </button>
              </div>
            </div>

            {/* Keywords */}
            <div className="mb-10">
              <div className="flex flex-wrap gap-2.5">
                {['축제', '전시회', '공모전', '박람회', '서울', '부산'].map((keyword) => (
                  <button
                    key={keyword}
                    className="px-4 py-2 bg-white/70 hover:bg-white rounded-full text-sm font-bold text-gray-600 hover:text-green-600 transition-all shadow-sm border border-gray-100"
                  >
                    #{keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-10 border-t border-gray-200 pt-8">
              <div>
                <p className="text-3xl font-black text-gray-900">1,200<span className="text-green-500">+</span></p>
                <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Events</p>
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900">50K<span className="text-green-500">+</span></p>
                <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Visitors</p>
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900">4.8<span className="text-green-500">★</span></p>
                <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Dual Mobile Screens */}
        <div className="flex gap-6 lg:gap-10 shrink-0 animate-in zoom-in-95 duration-500">
          
          {/* Gabojago App */}
          <div className="relative group">
             <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                <Smartphone size={14} /> Gabojago
             </div>
             <div className="w-[360px] h-[780px] bg-white rounded-[40px] overflow-hidden border-[6px] border-gray-800 shadow-2xl relative">
                <main className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide bg-[#F3F4F6]">
                  {children}
                  <div className="h-24"></div> 
                </main>
                <BottomNav />
                <FloatingActionButton />
             </div>
          </div>

          {/* WAYO Project */}
          <div className="relative group hidden 2xl:block">
             <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-pink-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                <Smartphone size={14} /> WAYO Project
             </div>
             
             <button 
               onClick={() => setRefreshKey(prev => prev + 1)}
               className="absolute -right-10 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-gray-600 transition-colors"
               title="Reload"
             >
               <RefreshCw size={20} />
             </button>

             <div className="w-[360px] h-[780px] bg-white rounded-[40px] overflow-hidden border-[6px] border-gray-800 shadow-2xl relative">
                <iframe 
                  key={refreshKey}
                  src="/wayo" 
                  className="w-full h-full border-none bg-white"
                  title="WAYO App"
                />
             </div>
          </div>

        </div>
      </div>
      
      {/* Background Decoration */}
      <div className="hidden lg:block fixed left-0 bottom-0 w-1/2 h-1/3 bg-linear-to-t from-green-50/50 to-transparent -z-10"></div>
    </div>
  );
}
