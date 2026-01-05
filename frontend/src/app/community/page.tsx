"use client";

import { useEffect, useState } from "react";
import { Heart, MessageCircle, Share2, MoreVertical, Bell, Star, Ticket, Megaphone, Plus, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";

interface FeedItem {
  id: string;
  type: 'reply' | 'event_cheer';
  user: { email: string };
  content: string;
  created_at: string;
  event_title: string;
  event_image?: string;
  original_comment?: string;
  comment_type?: string;
  target_id: number;
  target_type: string;
}

export default function CommunityPage() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const data = await api.get("/feed");
      setFeed(data as FeedItem[]);
    } catch (error) {
      console.error("Error fetching feed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* 헤더 */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-xl z-40 px-6 py-6 border-b border-gray-100 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">마이 피드</h1>
          <p className="text-[10px] font-black text-red-500 mt-1 uppercase tracking-widest leading-none flex items-center gap-1">
            <Bell size={10} className="fill-current" /> Personalized Activity
          </p>
        </div>
        <div className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-black text-gray-400">
          Syncing...
        </div>
      </header>

      {/* 피드 내용 */}
      <div className="py-2 space-y-3 px-4">
        {loading ? (
          <div className="space-y-4 pt-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-white rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : feed.length > 0 ? (
          feed.map((item) => (
            <FeedCard key={item.id} item={item} />
          ))
        ) : (
          <div className="mt-10 bg-white rounded-[40px] p-10 text-center shadow-xl shadow-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star size={40} className="text-gray-200" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">아직 소식이 없어요</h3>
            <p className="text-sm font-medium text-gray-400 leading-relaxed mb-8">
              좋아하는 축제를 찜하거나 댓글을 남겨보세요.<br/>나만의 개인화된 피드가 채워집니다!
            </p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-sm active:scale-95 transition-all shadow-xl shadow-gray-200"
            >
              축제 구경하러 가기 <ChevronRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function FeedCard({ item }: { item: FeedItem }) {
  const router = useRouter();

  if (item.type === 'reply') {
    return (
      <div 
        onClick={() => router.push(item.target_type === 'Event' ? `/events/${item.target_id}` : `/community/${item.target_id}`)}
        className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <MessageCircle size={20} className="fill-current" />
          </div>
          <div>
            <p className="text-xs font-black text-gray-900">
              {item.user.email}님이 답글을 남겼습니다
            </p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {item.event_title} · {new Date(item.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-2xl p-4 mb-3 border-l-4 border-blue-500">
          <p className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-tighter">My Comment</p>
          <p className="text-xs font-bold text-gray-500 truncate italic">"{item.original_comment}"</p>
        </div>
        
        <p className="text-sm font-bold text-gray-800 leading-relaxed pl-2 italic">
          ↳ "{item.content}"
        </p>
      </div>
    );
  }

  return (
    <div 
      onClick={() => router.push(`/events/${item.target_id}`)}
      className="bg-white rounded-[32px] border border-gray-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-100">
            <Megaphone size={20} className="fill-current" />
          </div>
          <div>
            <p className="text-xs font-black text-gray-900">
              {item.event_title}의 새로운 기대평
            </p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {item.user.email} · {new Date(item.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          {item.event_image && (
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-md">
              <Image src={item.event_image} alt="" fill className="object-cover" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-2">
              {item.comment_type === 'ticket_proof' ? (
                <span className="bg-red-100 text-red-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
                  <Ticket size={8} /> Ticket Certified
                </span>
              ) : (
                <span className="bg-green-100 text-green-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                  Anticipation ✨
                </span>
              )}
            </div>
            <p className="text-sm font-bold text-gray-700 italic leading-tight line-clamp-2">
              "{item.content}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
