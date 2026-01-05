"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, MapPin, Calendar, ShoppingBag, Ticket, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Event, Item } from "@/types";

export default function LikesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"event" | "item">("event");
  const [likedEvents, setLikedEvents] = useState<Event[]>([]);
  const [likedItems, setLikedItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    fetchLikes(token);
  }, []);

  const fetchLikes = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/likes`, {
        headers: {
          Authorization: token,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setLikedEvents(data.events || []);
        setLikedItems(data.items || []);
      } else if (res.status === 401) {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Failed to fetch likes:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 pb-24">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <Heart size={48} className="text-red-400 fill-red-400" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">관심 리스트를 확인하세요</h2>
        <p className="text-gray-500 text-center mb-8 font-medium">
          로그인하고 마음에 드는 투어와 상품을<br />한곳에서 모아보세요!
        </p>
        <button
          onClick={() => router.push("/login")}
          className="w-full bg-linear-to-r from-red-500 to-pink-600 text-white font-black py-4 rounded-2xl active:scale-[0.98] transition-all shadow-xl shadow-red-200"
        >
          로그인하러 가기
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-xl z-40 px-6 py-6 border-b border-gray-100 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">관심 리스트</h1>
          <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">
            {activeTab === "event" ? "My Tours" : "My Shop"}
          </p>
        </div>
        <div className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-black text-gray-500">
          Total {activeTab === "event" ? likedEvents.length : likedItems.length}
        </div>
      </header>

      {/* Tab Switcher */}
      <div className="px-6 py-4 sticky top-[93px] bg-white z-30">
        <div className="flex bg-gray-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab("event")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all ${activeTab === "event"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
              }`}
          >
            <Ticket size={18} />
            투어 ({likedEvents.length})
          </button>
          <button
            onClick={() => setActiveTab("item")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all ${activeTab === "item"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
              }`}
          >
            <ShoppingBag size={18} />
            스토어 ({likedItems.length})
          </button>
        </div>
      </div>

      <div className="px-6 py-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-gray-50 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : activeTab === "event" ? (
          /* Events List */
          likedEvents.length > 0 ? (
            <div className="space-y-6">
              {likedEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="block group"
                >
                  <div className="flex gap-4 items-start">
                    <div className="relative w-28 h-36 shrink-0 rounded-2xl overflow-hidden shadow-md">
                      <Image
                        src={event.image_url || "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300"}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent flex items-end p-2">
                        <span className="text-[10px] font-black text-white bg-red-500 px-2 py-0.5 rounded-full">
                          LIKED
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <span className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1 block">
                        {event.category}
                      </span>
                      <h3 className="text-lg font-black text-gray-900 leading-tight mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <MapPin size={12} className="shrink-0" />
                          <span className="text-xs font-bold truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Calendar size={12} className="shrink-0" />
                          <span className="text-xs font-bold">
                            {formatDate(event.start_date)} - {formatDate(event.end_date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Ticket size={48} />}
              title="아직 관심 있는 투어가 없어요"
              description="마음에 드는 축제나 전시회에 하트를 눌러보세요!"
              action={() => router.push("/")}
              actionLabel="투어 둘러보기"
            />
          )
        ) : (
          /* Items List */
          likedItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8">
              {likedItems.map((item) => (
                <Link key={item.id} href={`/items/${item.id}`} className="group">
                  <div className="aspect-3/4 bg-white rounded-3xl shadow-sm border border-gray-100 mb-3 overflow-hidden relative">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      sizes="(max-width:480px) 50vw, 300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-sm">
                      <Heart
                        size={20}
                        className="fill-red-500 text-red-500"
                      />
                    </div>
                  </div>
                  <div className="px-1">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.category}</h3>
                    <h3 className="text-sm font-black text-gray-900 line-clamp-2 leading-tight mb-2 group-hover:text-green-600">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 font-black text-lg">
                        {item.price.toLocaleString()}원
                      </span>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<ShoppingBag size={48} />}
              title="아직 관심 있는 상품이 없어요"
              description="반려동물을 위한 특별한 아이템들을 구경해보세요!"
              action={() => router.push("/")}
              actionLabel="상품 둘러보기"
            />
          )
        )}
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
  action,
  actionLabel,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: () => void;
  actionLabel: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-gray-400">
      <div className="text-gray-200 mb-4">{icon}</div>
      <p className="text-gray-900 font-black text-xl mb-1">{title}</p>
      <p className="text-sm text-gray-500 font-medium text-center px-6">
        {description}
      </p>
      <button
        onClick={action}
        className="mt-8 px-10 py-4 bg-gray-900 text-white font-black rounded-2xl shadow-xl shadow-gray-200 active:scale-[0.98] transition-all"
      >
        {actionLabel}
      </button>
    </div>
  );
}
