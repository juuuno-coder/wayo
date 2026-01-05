"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Search,
  MapPin,
  Calendar,
  Star,
  TrendingUp,
  Clock,
  Filter,
  Sparkles,
  Ticket
} from "lucide-react";
import Link from "next/link";
import { Event } from "@/types";

// --- Constants ---

const categories = [
  { id: "all", name: "전체", emoji: "✨" },
  { id: "festival", name: "축제", emoji: "🎉" },
  { id: "exhibition", name: "박람회", emoji: "🏢" },
  { id: "art", name: "미술전시", emoji: "🎨" },
  { id: "concert", name: "공연", emoji: "🎵" },
  { id: "contest", name: "공모전", emoji: "🏆" },
];

const quickCategories = [
  { id: "festival", name: "축제", emoji: "🎉", color: "bg-pink-50", textColor: "text-pink-600" },
  { id: "exhibition", name: "박람회", emoji: "🏢", color: "bg-blue-50", textColor: "text-blue-600" },
  { id: "art", name: "전시회", emoji: "🎨", color: "bg-purple-50", textColor: "text-purple-600" },
  { id: "contest", name: "공모전", emoji: "🏆", color: "bg-orange-50", textColor: "text-orange-600" },
];

const regions = [
  { code: 'all', name: '전체', short: '전체' },
  { code: 'seoul', name: '서울', short: '서울' },
  { code: 'gyeonggi', name: '경기/인천', short: '경기' },
  { code: 'busan', name: '부산', short: '부산' },
  { code: 'daegu', name: '대구', short: '대구' },
  { code: 'gwangju', name: '광주', short: '광주' },
  { code: 'daejeon', name: '대전', short: '대전' },
  { code: 'gangwon', name: '강원', short: '강원' },
  { code: 'chungcheong', name: '충청', short: '충청' },
  { code: 'jeolla', name: '전라', short: '전라' },
  { code: 'gyeongsang', name: '경상', short: '경상' },
  { code: 'jeju', name: '제주', short: '제주' },
  { code: 'online', name: '온라인', short: '온라인' },
];

const banners = [
  {
    id: 1,
    title: "2025 대한민국 축제 대축제",
    subtitle: "지금 바로 떠나보세요!",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200",
    color: "from-blue-600 to-indigo-700",
  },
  {
    id: 2,
    title: "예술로 채우는 일상",
    subtitle: "전국 주요 전시회 가이드",
    image: "https://images.unsplash.com/photo-1492691523567-6170c3295db6?w=1200",
    color: "from-purple-600 to-pink-600",
  },
];

// --- Helper Functions ---

const formatDateCompact = (start: string, end: string) => {
  const s = new Date(start);
  const e = new Date(end);
  return `${s.getMonth() + 1}.${s.getDate()} ~ ${e.getMonth() + 1}.${e.getDate()}`;
};

const getStatus = (start: string, end: string) => {
  const now = new Date();
  const s = new Date(start);
  const e = new Date(end);

  if (now < s) return { text: "D-" + Math.ceil((+s - +now) / (1000 * 60 * 60 * 24)), color: "bg-blue-500" };
  if (now > e) return { text: "종료", color: "bg-gray-400" };
  return { text: "진행중", color: "bg-red-500" };
};

// --- Main Page Component ---

export default function Home() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [festivalEvents, setFestivalEvents] = useState<Event[]>([]);
  const [exhibitionEvents, setExhibitionEvents] = useState<Event[]>([]);
  const [artEvents, setArtEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("latest");
  const [currentBanner, setCurrentBanner] = useState(0);

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => {
      if (id === 'all') return [];
      if (prev.includes(id)) return prev.filter(c => c !== id);
      return [...prev, id];
    });
  };

  const toggleRegion = (code: string) => {
    setSelectedRegions(prev => {
      if (code === 'all') return [];
      if (prev.includes(code)) return prev.filter(r => r !== code);
      return [...prev, code];
    });
  };

  const fetchAllEvents = useCallback(async () => {
    setLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/events?sort=${sortBy}`;

      if (selectedCategories.length > 0) {
        url += `&category=${selectedCategories.join(',')}`;
      }

      if (selectedRegions.length > 0) {
        url += `&region=${selectedRegions.join(',')}`;
      }

      const res = await fetch(url);
      if (res.ok) setEvents(await res.json());

      // Only fetch sections when no specific filters are applied
      if (selectedCategories.length === 0 && selectedRegions.length === 0) {
        const sections = ["festival", "exhibition", "art", "concert"];
        const results = await Promise.all(
          sections.map(cat => fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/events?category=${cat}&limit=10`).then(r => r.json()))
        );
        setFestivalEvents(results[0]);
        setExhibitionEvents(results[1]);
        setArtEvents(results[2]);
        // Note: added concert but not using separate state for it yet in "all" view unless we add a section
      }
    } catch (e) {
      console.error("Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  }, [selectedCategories, selectedRegions, sortBy]);

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white min-h-screen pb-24 font-sans antialiased">
      {/* 1. 배너 (Hero Section) */}
      <div className="relative aspect-video lg:aspect-[21/9] overflow-hidden">
        <Image
          src={banners[currentBanner].image}
          alt={banners[currentBanner].title}
          fill
          className="object-cover animate-in fade-in zoom-in duration-1000"
        />
        <div className={`absolute inset-0 bg-linear-to-t ${banners[currentBanner].color} opacity-40 mix-blend-multiply`}></div>
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>

        <div className="absolute bottom-12 left-6 right-6">
          <p className="text-white/80 font-bold mb-2 tracking-widest uppercase text-xs">Recommended for you</p>
          <h1 className="text-3xl lg:text-5xl font-black text-white mb-4 leading-tight drop-shadow-xl">
            {banners[currentBanner].title}
          </h1>
          <p className="text-white/90 text-sm font-medium mb-6 drop-shadow-md">
            {banners[currentBanner].subtitle}
          </p>
          <div className="flex gap-2">
            {banners.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentBanner ? "w-8 bg-white" : "w-1.5 bg-white/40"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 2. 내비게이션 & 검색 바 */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="어떤 이벤트를 찾으시나요?"
            className="w-full bg-gray-100/50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400"
          />
        </div>
        <button className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-2xl text-gray-600 active:scale-95 transition-transform hover:bg-gray-200">
          <Ticket size={24} />
        </button>
      </div>

      {/* 3. 카테고리 퀵 메뉴 */}
      <div className="px-6 py-8 overflow-x-auto scrollbar-hide flex gap-4">
        <button
          onClick={() => setSelectedCategories([])} // 'All' clears selection
          className="flex flex-col items-center gap-2 group shrink-0"
        >
          <div className={`w-16 h-16 rounded-3xl ${selectedCategories.length === 0 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'} flex items-center justify-center text-xl font-black shadow-xs group-active:scale-90 transition-all duration-300`}>
            ALL
          </div>
          <span className={`text-[11px] font-black ${selectedCategories.length === 0 ? "text-gray-900" : "text-gray-400"}`}>
            전체
          </span>
        </button>
        {categories.slice(1).map((cat) => (
          <button
            key={cat.id}
            onClick={() => toggleCategory(cat.id)}
            className="flex flex-col items-center gap-2 group shrink-0"
          >
            <div className={`w-16 h-16 rounded-3xl ${selectedCategories.includes(cat.id) ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-white border border-gray-100 text-gray-900'} flex items-center justify-center text-3xl shadow-xs group-active:scale-90 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1`}>
              {cat.emoji}
            </div>
            <span className={`text-[11px] font-black ${selectedCategories.includes(cat.id) ? "text-gray-900" : "text-gray-400"}`}>
              {cat.name}
            </span>
          </button>
        ))}
      </div>

      {/* 4. 지역 필터 (Horizontal Chips) */}
      <div className="px-6 pb-6 overflow-x-auto scrollbar-hide flex gap-2">
        {regions.map((region) => (
          <button
            key={region.code}
            onClick={() => toggleRegion(region.code)}
            className={`px-5 py-2.5 rounded-2xl text-[11px] font-black whitespace-nowrap transition-all ${(region.code === 'all' && selectedRegions.length === 0) || selectedRegions.includes(region.code)
              ? "bg-gray-900 text-white shadow-xl scale-105"
              : "bg-gray-50 text-gray-400 border border-gray-100 hover:bg-gray-100"
              }`}
          >
            {region.short}
            {selectedRegions.includes(region.code) && <span className="ml-1 text-blue-300">•</span>}
          </button>
        ))}
      </div>

      {/* 5. 메인 컨텐츠 리스트 */}
      <div className="px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent shadow-xl"></div>
            <p className="text-xs font-black text-gray-300 uppercase tracking-widest">Loading Wonders...</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {selectedCategories.length === 0 && selectedRegions.length === 0 ? (
              <div className="space-y-12">
                <EventSection title="🔥 진행중인 인기 축제" subtitle="지금이 아니면 못가요!" events={festivalEvents} router={router} />
                <EventSection title="🏛️ 놓치면 아쉬운 전시/박람회" subtitle="문화 생활을 즐겨보세요" events={exhibitionEvents} router={router} />
                <EventSection title="🎨 따끈따끈 미술 전시회" subtitle="예술적 감성을 충전하세요" events={artEvents} router={router} />
              </div>
            ) : (
              <div>
                {/* 정렬 & 통계 영역 */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-gray-900">
                      {selectedCategories.length > 0 ? selectedCategories.map(c => categories.find(cat => cat.id === c)?.name).join(", ") : "전체 이벤트"}
                    </span>
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black">
                      {events.length}
                    </span>
                  </div>
                  <div className="flex gap-1 bg-gray-100/50 p-1.5 rounded-2xl border border-gray-100">
                    {[
                      { id: 'latest', name: '최신순' },
                      { id: 'popular', name: '인기순' },
                      { id: 'end_date', name: '마감순' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setSortBy(opt.id)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${sortBy === opt.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"}`}
                      >
                        {opt.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {events.map(event => (
                    <EventCard key={event.id} event={event} router={router} />
                  ))}
                  {events.length === 0 && (
                    <div className="text-center py-32 border-2 border-dashed border-gray-100 rounded-[40px]">
                      <p className="text-gray-300 font-black uppercase tracking-widest text-xs">No Events Found in this region</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Wayo Promotion Banner */}
      <div className="mx-6 mt-12 mb-6">
        <div
          onClick={() => router.push('/wayo')}
          className="bg-linear-to-r from-[#FF6B6B] to-[#EE5D50] rounded-[32px] p-8 shadow-xl shadow-red-200/50 flex items-center justify-between cursor-pointer group hover:scale-[1.02] transition-transform"
        >
          <div className="text-white space-y-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">NEW SERVICE</span>
            <h3 className="text-2xl font-black">나만의 특별한 초대장 만들기</h3>
            <p className="opacity-90 font-medium">소중한 사람들에게 마음을 전해보세요 💌</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors backdrop-blur-md">
            <Sparkles size={32} className="text-white fill-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub-Components ---

function EventSection({ title, subtitle, events, router }: { title: string, subtitle: string, events: Event[], router: any }) {
  if (events.length === 0) return null;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-gray-900 leading-tight">{title}</h3>
          <p className="text-sm font-medium text-gray-400 mt-1">{subtitle}</p>
        </div>
        <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 active:scale-95 transition-transform">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-6 px-6 pb-4">
        {events.map((event) => {
          const status = getStatus(event.start_date, event.end_date);
          return (
            <div
              key={event.id}
              onClick={() => router.push(`/events/${event.id}`)}
              className="w-48 shrink-0 group cursor-pointer"
            >
              <div className="relative aspect-[3/4] rounded-[32px] overflow-hidden mb-4 shadow-xl shadow-gray-200/50 group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500">
                <Image src={event.image_url} alt={event.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4">
                  <span className={`${status.color} text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg uppercase tracking-widest`}>
                    {status.text}
                  </span>
                </div>
                {event.is_free && (
                  <div className="absolute top-4 right-4 animate-bounce">
                    <span className="bg-white/90 backdrop-blur-md text-blue-600 px-3 py-1 rounded-full text-[10px] font-black shadow-lg">FREE</span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-black/80 via-black/20 to-transparent">
                  <p className="text-white text-sm font-black line-clamp-2 drop-shadow-md leading-tight">{event.title}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EventCard({ event, router }: { event: Event, router: any }) {
  const status = getStatus(event.start_date, event.end_date);
  return (
    <div
      onClick={() => router.push(`/events/${event.id}`)}
      className="bg-white rounded-[40px] p-6 border-2 border-gray-50 flex gap-6 hover:shadow-2xl hover:border-blue-50/50 transition-all duration-500 group cursor-pointer relative overflow-hidden active:scale-[0.98]"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-100/40 transition-colors"></div>

      <div className="relative w-32 h-44 flex-shrink-0 shadow-2xl shadow-gray-200/50 rounded-[28px] overflow-hidden">
        <Image src={event.image_url} alt={event.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className={`absolute top-3 left-3 ${status.color} text-white px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg`}>
          {status.text}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between py-1 relative">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider">
              {event.category}
            </span>
          </div>
          <h3 className="text-lg font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
            {event.title}
          </h3>
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
              <MapPin size={14} className="text-blue-400" /> {event.region}
            </p>
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
              <Calendar size={14} className="text-purple-400" /> {formatDateCompact(event.start_date, event.end_date)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-lg font-black text-gray-900">
            {event.is_free ? <span className="text-blue-600">Free</span> : <span className="text-xs uppercase tracking-tighter text-gray-400 font-bold">Standard <span className="text-lg text-gray-900 ml-1">{event.price}</span></span>}
          </p>
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"></div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[10px] font-black text-white">
              +12
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
