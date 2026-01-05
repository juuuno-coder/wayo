"use client";

import { useState } from "react";
import Image from "next/image";
import { Search as SearchIcon, X, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDateCompact } from "@/utils/date";

interface Event {
  id: number;
  title: string;
  category: string;
  start_date: string;
  end_date: string;
  location: string;
  image_url: string;
  is_free: boolean;
  price: string;
}

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const MOCK_EVENTS: Event[] = [
    {
      id: 1,
      title: "2024 서울 반려동물 페스티벌",
      category: "축제",
      start_date: "2024-05-10",
      end_date: "2024-05-12",
      location: "서울 올림픽공원",
      image_url:
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=300",
      is_free: true,
      price: "0",
    },
    {
      id: 2,
      title: "국제 펫 푸드 박람회",
      category: "박람회",
      start_date: "2024-06-15",
      end_date: "2024-06-18",
      location: "KINTEX",
      image_url:
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=300",
      is_free: false,
      price: "15,000",
    },
    {
      id: 3,
      title: "강아지 숲 산책 모임",
      category: "모임",
      start_date: "2024-04-20",
      end_date: "2024-04-20",
      location: "서울 숲",
      image_url:
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=300",
      is_free: true,
      price: "0",
    },
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Valid mock search
    const filtered = MOCK_EVENTS.filter(
      (event) =>
        event.title.includes(query) ||
        event.location.includes(query) ||
        event.category.includes(query)
    );

    setResults(filtered);
    setLoading(false);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setSearched(false);
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* 검색 헤더 */}
      <header className="sticky top-0 bg-white z-50 px-4 py-4 flex gap-3 border-b border-gray-100">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색어를 입력해주세요 (예: 간식)"
            className="w-full bg-gray-100 h-11 rounded-xl pl-11 pr-10 outline-none text-gray-900 placeholder:text-gray-400 font-medium transition-all focus:bg-gray-50 focus:ring-2 focus:ring-blue-500/20"
            autoFocus
          />
          <SearchIcon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-white"
            >
              <X size={12} />
            </button>
          )}
        </form>
      </header>

      {/* 검색 결과 or 초기 화면 */}
      <div className="px-4 py-6">
        {!searched ? (
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">
              추천 검색어
            </h3>
            <div className="flex flex-wrap gap-2">
              {["서울 축제", "전시회", "공모전", "박람회", "무료"].map(
                (tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setQuery(tag);
                    }}
                    className="px-4 py-2 bg-gray-50 text-gray-600 rounded-full text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    {tag}
                  </button>
                )
              )}
            </div>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : results.length > 0 ? (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              검색결과{" "}
              <span className="font-bold text-gray-900">{results.length}</span>
              개
            </p>
            <div className="space-y-4">
              {results.map((event) => (
                <div
                  key={event.id}
                  onClick={() => router.push(`/events/${event.id}`)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 active:scale-[0.98] transition-transform cursor-pointer"
                >
                  <div className="flex gap-4 p-4">
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                      <Image
                        src={event.image_url}
                        alt={event.title}
                        fill
                        className="object-cover rounded-xl"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-snug mb-2">
                        {event.title}
                      </h3>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Calendar size={14} className="text-gray-400" />
                          <span>
                            {formatDateCompact(
                              event.start_date,
                              event.end_date
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <MapPin size={14} className="text-gray-400" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>
                      {event.is_free && (
                        <div className="mt-2">
                          <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">
                            무료
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <SearchIcon size={48} className="mb-4 text-gray-200" />
            <p>검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
