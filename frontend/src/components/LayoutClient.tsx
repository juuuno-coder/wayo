"use client";

import { usePathname } from "next/navigation";
import BottomNav from "./BottomNav";
import FloatingActionButton from "./FloatingActionButton";
import { Smartphone, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function LayoutClient({
  children,
  initialState
}: {
  children: React.ReactNode,
  initialState?: { isWayoHost: boolean }
}) {
  const pathname = usePathname();
  const { isLoggedIn, user, isLoading } = useAuth();
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isWayoDomain, setIsWayoDomain] = useState(initialState?.isWayoHost ?? false);

  useEffect(() => {
    // Check if current domain is Wayo (excluding gabojago subdomain)
    // This client-side check is kept for runtime updates if needed, 
    // but the initial state comes from the server.
    const hostname = window.location.hostname;
    setIsWayoDomain(
      (hostname.includes('wayo.co.kr') || hostname === 'localhost') &&
      !hostname.includes('gabojago')
    );
  }, []);

  useEffect(() => {
    // Strict onboarding: If logged in but no nickname, force onboarding
    // Skip if already on the onboarding page or login/signup/logout related paths
    const publicPaths = ["/login", "/signup", "/onboarding/nickname"];
    if (!isLoading && isLoggedIn && !user?.nickname && !publicPaths.includes(pathname || "")) {
      router.push("/onboarding/nickname");
    }
  }, [isLoggedIn, user, isLoading, pathname, router]);

  const isAdminPage = pathname?.startsWith("/admin");
  const isInvitationRoute = pathname?.startsWith("/invitations");
  const isProfilePage = pathname === "/profile";
  const isLoginPage = pathname === "/login";
  const isSignupPage = pathname === "/signup";
  const isLikesPage = pathname === "/likes";
  const isFeaturesPage = pathname === "/features";
  const isFaqPage = pathname === "/faq";

  // Wayo Landing: ONLY root path on Wayo domain shows full PC version
  const isWayoLanding = isWayoDomain && pathname === "/";

  // 1. Pages that MUST be full screen on PC
  // For Wayo, we want most pages to be native web experiences except the initial landing.
  const isFullScreenPage = isAdminPage || isWayoLanding || isProfilePage || isLoginPage || isSignupPage || isLikesPage || isInvitationRoute || isFeaturesPage || isFaqPage;

  if (isFullScreenPage) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        {children}
      </div>
    );
  }

  // 3. 브랜딩 레이아웃 (PC 사이드바 + 모바일 프레임)
  // 브랜드별 설정
  const theme = isWayoDomain ? {
    name: "WAYO",
    primary: "bg-[#E02424]",
    text: "text-[#E02424]",
    bg: "bg-[#FDF2F2]",
    accent: "text-red-600",
    description: "마음을 담은 정교한 초대장",
    subDescription: "당신의 공간으로 지금 바로 와요",
    keywords: ['초대장', '동창회', '청첩장', '돌잔치', '생일파티'],
    stats: { events: "500+", visitors: "10K+", rating: "4.9" }
  } : {
    name: "가보자고!",
    primary: "bg-[#84cc16]", // lime-500
    text: "text-[#65a30d]", // lime-600
    bg: "bg-[#f7fee7]", // lime-50
    accent: "text-lime-600",
    description: "전국의 모든 이벤트를",
    subDescription: "한눈에 모아보는 플랫폼",
    keywords: ['축제', '전시회', '공모전', '박람회', '서울', '부산'],
    stats: { events: "1,200+", visitors: "50K+", rating: "4.8" }
  };

  return (
    <div className={`min-h-screen ${isWayoDomain ? 'bg-gray-50' : 'bg-[#F3F4F6]'} flex justify-center overflow-x-hidden p-4 lg:p-8`}>
      <div className="w-full max-w-[1600px] flex gap-8 items-center relative">

        {/* Left: PC Branding Area */}
        <div className="flex-1 hidden xl:flex flex-col justify-center animate-in fade-in slide-in-from-left duration-1000">
          <div className="max-w-xl">
            <div className="mb-10">
              <h1 className={`text-6xl font-black tracking-tighter text-gray-900 mb-4 drop-shadow-sm`}>
                {isWayoDomain ? "WAYO" : "가보자고"}<span className={theme.text}>{isWayoDomain ? "" : "!"}</span>
              </h1>
              <p className="text-2xl text-gray-800 font-bold leading-tight">
                {theme.description}
                <br />
                <span className={`${theme.text} underline decoration-lime-200 underline-offset-8`}>{theme.subDescription}</span>
              </p>
            </div>

            {/* Search Bar (PC) */}
            <div className="mb-8 group">
              <div className="relative transform transition-all hover:scale-[1.01]">
                <input
                  type="text"
                  placeholder={isWayoDomain ? "초대장을 검색해보세요" : "어떤 이벤트를 찾으시나요?"}
                  className="w-full px-6 py-5 rounded-2xl border-none shadow-[0_10px_40px_rgba(0,0,0,0.06)] focus:shadow-[0_15px_50px_rgba(0,0,0,0.1)] focus:outline-none text-lg bg-white/80 backdrop-blur-md transition-all font-medium"
                />
                <button className={`absolute right-2.5 top-1/2 -translate-y-1/2 ${theme.primary} text-white px-8 py-3.5 rounded-xl font-black text-base hover:opacity-90 active:scale-95 transition-all shadow-lg`}>
                  {isWayoDomain ? "찾기" : "검색"}
                </button>
              </div>
            </div>

            {/* Keywords */}
            <div className="mb-10">
              <div className="flex flex-wrap gap-2.5">
                {theme.keywords.map((keyword) => (
                  <button
                    key={keyword}
                    className="px-4 py-2 bg-white/70 hover:bg-white rounded-full text-sm font-bold text-gray-600 transition-all shadow-sm border border-gray-100"
                  >
                    #{keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-10 border-t border-gray-200 pt-8">
              <div>
                <p className="text-3xl font-black text-gray-900">{theme.stats.events}<span className={theme.text}>+</span></p>
                <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Events</p>
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900">{theme.stats.visitors}<span className={theme.text}>+</span></p>
                <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Visitors</p>
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900">{theme.stats.rating}<span className="text-yellow-400">★</span></p>
                <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Mobile View */}
        <div className="flex gap-6 lg:gap-10 shrink-0 animate-in zoom-in-95 duration-500">
          <div className="relative group">
            <div className={`absolute -top-8 left-1/2 -translate-x-1/2 ${isWayoDomain ? 'text-red-400' : 'text-lime-500'} text-xs font-bold uppercase tracking-widest flex items-center gap-1`}>
              <Smartphone size={14} /> {isWayoDomain ? 'WAYO App' : 'Gabojago App'}
            </div>
            <div className={`w-[360px] h-[780px] bg-white rounded-[40px] overflow-hidden border-[6px] ${isWayoDomain ? 'border-gray-900' : 'border-gray-800'} shadow-2xl relative`}>
              <main className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide bg-white">
                {children}
              </main>
              {!isWayoDomain && <BottomNav />}
              {!isWayoDomain && <FloatingActionButton />}
            </div>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className={`hidden lg:block fixed left-0 bottom-0 w-1/2 h-1/3 bg-linear-to-t ${isWayoDomain ? 'from-red-50/30' : 'from-lime-50/50'} to-transparent -z-10`}></div>
    </div>
  );
}
