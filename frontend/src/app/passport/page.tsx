"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MoveLeft,
  Calendar as CalendarIcon,
  Book,
  MapPin,
  Stamp,
  Star,
  Megaphone,
  Camera,
} from "lucide-react";
import { Visit } from "@/types";

const MOCK_VISITS: Visit[] = [
  {
    id: 1,
    visited_at: new Date(2025, 11, 10).toISOString(),
    content: "가족들과 함께 즐거운 시간 보냈어요!",
    event: {
      id: 1,
      title: "서울 펫 페어",
      category: "festival",
      description: "",
      start_date: new Date(2025, 11, 10).toISOString(),
      end_date: new Date(2025, 11, 10).toISOString(),
      location: "코엑스",
      image_url: "",
      organizer: "",
      website_url: "",
      is_free: false,
      price: "",
    },
    event_id: 1,
    images: [],
    decoration_metadata: null,
  },
  {
    id: 2,
    visited_at: new Date(2025, 11, 21).toISOString(),
    content: "겨울 축제 분위기 최고!",
    event: {
      id: 2,
      title: "남산 윈터 원더랜드",
      category: "festival",
      description: "",
      start_date: new Date(2025, 11, 21).toISOString(),
      end_date: new Date(2025, 11, 21).toISOString(),
      location: "남산타워",
      image_url: "",
      organizer: "",
      website_url: "",
      is_free: false,
      price: "",
    },
    event_id: 2,
    images: [],
    decoration_metadata: null,
  },
];

const MOCK_LIKES = [
  {
    id: 101,
    date: new Date(2025, 11, 25).toISOString(),
    title: "크리스마스 댕댕이 파티",
    location: "강남구",
  },
  {
    id: 102,
    date: new Date(2025, 11, 28).toISOString(),
    title: "연말 독 스테이지",
    location: "성수동",
  },
];

export default function PassportPage() {
  const router = useRouter();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"calendar" | "book">("calendar");
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setVisits(MOCK_VISITS);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-900"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f0f4f8] pb-24 font-sans">
      {/* Header */}
      <header className="fixed lg:absolute top-0 left-0 right-0 z-50 bg-[#1a237e] text-white p-4 shadow-lg">
        <div className="flex justify-between items-center max-w-[480px] mx-auto w-full">
          <button
            onClick={() => router.back()}
            className="text-white/80 hover:text-white"
          >
            <MoveLeft size={24} />
          </button>
          <h1 className="text-lg font-bold font-serif tracking-wider">
            가보자고 투어북
          </h1>
          <div className="w-6"></div>
        </div>
        
        {/* Action Buttons in Header */}
        <div className="flex gap-2 max-w-[480px] mx-auto w-full mt-4 pb-2 px-1">
          <button 
             onClick={() => router.push('/reports/new?type=future')}
             className="flex-1 py-2 bg-blue-500/20 backdrop-blur-md border border-white/20 text-blue-100 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-blue-500/30 transition-colors"
          >
            <Megaphone size={14} /> 제보하기
          </button>
          <button 
             onClick={() => router.push('/reports/new?type=past')}
             className="flex-1 py-2 bg-purple-500/20 backdrop-blur-md border border-white/20 text-purple-100 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-purple-500/30 transition-colors"
          >
            <Camera size={14} /> 추억하기
          </button>
        </div>
      </header>

      <div className="pt-20 px-4 max-w-[480px] mx-auto">
        {/* Toggle (Calendar vs Book) */}
        <div className="flex bg-white rounded-full p-1 mb-6 shadow-sm border border-gray-200">
          <button
            onClick={() => setViewMode("calendar")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-bold transition-all ${
              viewMode === "calendar"
                ? "bg-[#1a237e] text-white shadow-md"
                : "text-gray-500"
            }`}
          >
            <CalendarIcon size={16} /> 캘린더
          </button>
          <button
            onClick={() => setViewMode("book")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-bold transition-all ${
              viewMode === "book"
                ? "bg-[#1a237e] text-white shadow-md"
                : "text-gray-500"
            }`}
          >
            <Book size={16} /> 투어북 보기
          </button>
        </div>

        {viewMode === "book" ? (
          <div className="space-y-6">
            {/* Passport Cover / Info */}
            <div className="bg-[#1a237e] rounded-xl p-6 text-white text-center shadow-xl mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]"></div>
              <div className="relative z-10 border-2 border-yellow-500/30 p-4 rounded-lg">
                <Book size={32} className="mx-auto mb-2 text-yellow-500" />
                <h2 className="text-xl font-bold font-serif text-yellow-500 uppercase tracking-widest mb-1">
                  TOUR BOOK
                </h2>
                <p className="text-xs text-white/60">REPUBLIC OF FESTIVALS</p>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs text-white/50">
                  <span>방문한 축제</span>
                  <span className="text-yellow-500 font-bold text-lg">
                    {visits.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Stamps List */}
            {visits.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <Stamp size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">
                  아직 방문한 축제가 없어요.
                </p>
              </div>
            ) : (
              visits.map((visit) => (
                <div
                  key={visit.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg border border-[#e0e0e0]"
                >
                  <div className="bg-[#fcfbf9] p-6 border-b border-dashed border-gray-300 relative">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div>
                        <span className="inline-block bg-[#1a237e] text-white text-[10px] px-2 py-0.5 rounded-full mb-2">
                          VPN: {visit.id.toString().padStart(4, "0")}
                        </span>
                        <h3 className="font-bold text-gray-900 border-b-2 border-yellow-400 inline-block pb-1 mb-1">
                          {visit.event?.title}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin size={10} /> {visit.event?.location}
                        </p>
                      </div>
                      <div className="w-16 h-16 rounded-full border-4 border-red-800/60 rotate-12 flex items-center justify-center text-red-800/60 font-serif font-bold text-xs uppercase tracking-tighter shadow-sm bg-red-50/50 backdrop-blur-sm">
                        <div className="text-center transform -rotate-12">
                          <p className="text-[8px]">VISA</p>
                          <p>
                            {new Date(visit.visited_at).toLocaleDateString()}
                          </p>
                          <p className="text-[8px]">ENTRY</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-white">
                    <p className="text-xs text-gray-400 font-bold mb-2 uppercase tracking-wide">
                      Journal
                    </p>
                    <div className="bg-yellow-50 p-4 rounded-xl text-sm italic text-gray-700 leading-relaxed shadow-sm">
                      &quot;{visit.content}&quot;
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <CalendarSection
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            visits={visits}
            likes={MOCK_LIKES}
          />
        )}
      </div>
    </div>
  );
}

function CalendarSection({
  currentDate,
  setCurrentDate,
  visits,
  likes,
}: {
  currentDate: Date;
  setCurrentDate: (d: Date) => void;
  visits: Visit[];
  likes: { id: number; date: string; title: string; location: string }[];
}) {
  const [selectedDay, setSelectedDay] = useState<number | null>(
    new Date().getDate()
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getEventsForDay = (day: number) => {
    const dayVisits = visits.filter((v) => {
      const d = new Date(v.visited_at);
      return (
        d.getFullYear() === year &&
        d.getMonth() === month &&
        d.getDate() === day
      );
    });
    const dayLikes = likes.filter((l) => {
      const d = new Date(l.date);
      return (
        d.getFullYear() === year &&
        d.getMonth() === month &&
        d.getDate() === day
      );
    });
    return { visits: dayVisits, likes: dayLikes };
  };

  const activeEvents = selectedDay
    ? getEventsForDay(selectedDay)
    : { visits: [], likes: [] };

  return (
    <div className="space-y-6 text-gray-900">
      <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-blue-50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {year}년 {month + 1}월
          </h2>
          <div className="flex gap-2">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors rotate-180"
            >
              <MoveLeft size={20} className="text-gray-400 rotate-180" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoveLeft size={20} className="text-gray-400 rotate-180" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-y-2 mb-4">
          {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
            <div
              key={d}
              className={`text-center text-xs font-bold ${
                i === 0
                  ? "text-red-400"
                  : i === 6
                  ? "text-blue-400"
                  : "text-gray-400"
              }`}
            >
              {d}
            </div>
          ))}
          {blanks.map((b) => (
            <div key={`b-${b}`} />
          ))}
          {days.map((day) => {
            const events = getEventsForDay(day);
            const isSelected = selectedDay === day;
            return (
              <div
                key={day}
                onClick={() => setSelectedDay(day)}
                className="relative flex flex-col items-center justify-center h-12 cursor-pointer"
              >
                <div
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold ${
                    isSelected
                      ? "bg-[#1a237e] text-white shadow-lg shadow-indigo-200"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {day}
                </div>
                <div className="flex gap-0.5 mt-1">
                  {events.visits.length > 0 && (
                    <div className="w-1 h-1 rounded-full bg-red-500" />
                  )}
                  {events.likes.length > 0 && (
                    <div className="w-1 h-1 rounded-full bg-green-500" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedDay && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-500 flex items-center gap-2 px-1">
            <CalendarIcon size={14} /> {month + 1}월 {selectedDay}일 일정
          </h3>
          {activeEvents.visits.length === 0 &&
          activeEvents.likes.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl text-center border-2 border-dashed border-gray-100">
              <p className="text-gray-400 text-sm">기록된 일정이 없습니다.</p>
            </div>
          ) : (
            <>
              {activeEvents.visits.map((v) => (
                <div
                  key={v.id}
                  className="bg-white p-4 rounded-3xl shadow-sm border-l-4 border-red-500 flex gap-4 items-center"
                >
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                    <Stamp size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {v.event?.title}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {v.event?.location} • 방문 완료
                    </p>
                  </div>
                </div>
              ))}
              {activeEvents.likes.map((l) => (
                <div
                  key={l.id}
                  className="bg-white p-4 rounded-3xl shadow-sm border-l-4 border-green-500 flex gap-4 items-center"
                >
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                    <Star size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{l.title}</p>
                    <p className="text-[11px] text-gray-500">
                      {l.location} • 찜한 일정
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
