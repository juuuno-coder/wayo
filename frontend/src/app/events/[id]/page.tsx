"use client";

import { useEffect, useState } from "react";
import {
  MoveLeft,
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  Share2,
  Heart,
  Award,
  Star,
  Stamp,
  Megaphone,
  Ticket,
  MessageCircle,
  Plus,
  Gift,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { formatDate, getStatus } from "@/utils/date";
import { api } from "@/utils/api";
import { Event, Review } from "@/types";
import Image from "next/image";

const categoryNames: Record<string, string> = {
  festival: "축제",
  exhibition: "박람회",
  art: "전시회",
  contest: "공모전",
};

const getBenefit = (category: string) => {
  switch (category) {
    case "contest":
      return "상금/취업특전";
    case "festival":
      return "초대가수/경품";
    case "exhibition":
      return "선착순/기념품";
    case "art":
      return "도슨트/굿즈";
    default:
      return "혜택 정보";
  }
};

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // User interaction states
  const [isLiked, setIsLiked] = useState(false);
  const [isVisited, setIsVisited] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  // Review form states
  const [reviewContent, setReviewContent] = useState("");
  const [rating, setRating] = useState(5);

  // Cheer states
  const [cheers, setCheers] = useState<any[]>([]);
  const [cheerContent, setCheerContent] = useState("");
  const [cheerType, setCheerType] = useState("cheer"); // cheer, ticket_proof

  useEffect(() => {
    if (params?.id) {
      loadData(params.id as string);
    }
  }, [params]);

  const loadData = async (id: string) => {
    setLoading(true);
    try {
      // Parallel fetching
      const [eventRes, reviewsRes, cheersRes, likesRes, visitsRes] =
        await Promise.allSettled([
          api.get(`/events/${id}`),
          api.get(`/events/${id}/reviews`),
          api.get(`/events/${id}/comments`),
          api.get("/likes"),
          api.get("/visits"),
        ]);

      if (eventRes.status === "fulfilled") {
        setEvent(eventRes.value as Event);
      }

      if (reviewsRes.status === "fulfilled") {
        setReviews(reviewsRes.value as Review[]);
      }

      if (cheersRes.status === "fulfilled") {
        setCheers(cheersRes.value as any[]);
      }

      if (likesRes.status === "fulfilled") {
        const likedEvents: { id: number | string }[] =
          (likesRes.value as { events?: { id: number | string }[] })?.events ||
          [];
        const isLiked = likedEvents.some((e) => e.id.toString() === id);
        setIsLiked(isLiked);
      }

      if (visitsRes.status === "fulfilled") {
        const visits: ({ event?: { id: number | string } } | null)[] =
          (visitsRes.value as ({
            event?: { id: number | string };
          } | null)[]) || [];
        const isVisited = visits.some((v) => v?.event?.id?.toString() === id);
        setIsVisited(isVisited);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!event) return;
    try {
      const res = await api.post<{ liked: boolean }, Record<string, unknown>>(
        `/events/${event.id}/like`,
        {}
      ); // Toggle like
      setIsLiked(res.liked);
    } catch (e) {
      alert("로그인이 필요합니다.");
      router.push("/login");
    }
  };

  const handleCheckIn = async () => {
    if (!event) return;
    if (isVisited) return; // Already visited

    try {
      await api.post("/visits", { event_id: event.id });
      setIsVisited(true);
      alert("✅ 방문 인증이 완료되었습니다! 여권에 스탬프가 찍혔어요.");
    } catch (e) {
      alert("오류가 발생했습니다.");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || !reviewContent.trim()) return;

    try {
      const res = await api.post<
        { review: Review },
        { rating: number; content: string }
      >(`/events/${event.id}/reviews`, {
        rating,
        content: reviewContent,
      });
      setReviews([res.review, ...reviews]);
      setReviewContent("");
      alert("리뷰가 등록되었습니다.");
    } catch (e) {
      alert("리뷰 등록 실패. 로그인이 필요할 수 있습니다.");
    }
  };

  const handleCheerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || !cheerContent.trim()) return;

    try {
      const res = await api.post<any, any>(`/events/${event.id}/comments`, {
        comment: {
          content: cheerContent,
          comment_type: cheerType
        }
      });
      setCheers([res, ...cheers]);
      setCheerContent("");
      alert("응원이 등록되었습니다!");
    } catch (e) {
      alert("로그인이 필요합니다.");
      router.push("/login");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  if (!event)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">이벤트를 찾을 수 없습니다.</p>
      </div>
    );

  const status = getStatus(event.start_date, event.end_date);

  return (
    <div className="bg-white min-h-screen pb-32">
      {/* 헤더 */}
      <header className="fixed lg:absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-4">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/20"
        >
          <MoveLeft size={24} className="text-gray-900" />
        </button>
        <div className="flex gap-3">
          <button
            aria-label="공유"
            className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/20"
          >
            <Share2 size={20} className="text-gray-900" />
          </button>
          <button
            onClick={handleLike}
            aria-label={isLiked ? "좋아요 취소" : "좋아요"}
            className={`w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/20 transition-all ${
              isLiked ? "bg-pink-100" : "bg-white/90"
            }`}
          >
            <Heart
              size={20}
              className={`transition-colors ${
                isLiked ? "fill-red-500 text-red-500" : "text-gray-900"
              }`}
              aria-hidden
            />
          </button>
        </div>
      </header>

      {/* 메인 이미지 & 히어로 섹션 */}
      <div className="relative">
        <div 
          className="aspect-[2/3] bg-gray-200 relative cursor-zoom-in group"
          onClick={() => setShowImageModal(true)}
        >
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 transition-opacity group-hover:opacity-70"></div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Plus size={48} className="text-white/50" />
          </div>
        </div>

      </div>

      {/* 메인 컨텐츠 */}
      <div className="px-6 pt-8 pb-6 rounded-t-[40px] bg-white -mt-12 relative z-10 shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">
        
        {/* 헤더 정보 (타이틀, 뱃지, 위치) - 이미지 하단 흰 박스로 이동 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm uppercase tracking-widest">
              {categoryNames[event.category]}
            </span>
            <span
              className={`${status.color} bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm`}
            >
              {status.text}
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 leading-tight mb-2">
            {event.title}
          </h1>
          <p className="flex items-center gap-1 text-gray-500 text-sm font-bold">
            <MapPin size={16} className="text-gray-400" /> {event.location}
          </p>
          
          <a
            href={(event as any).website_url || event.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-xs font-bold text-gray-500 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ExternalLink size={14} />
            {(event as any).website_url ? "공식 홈페이지" : "출처 보기"}
          </a>
        </div>
        {/* 주요 정보 카드 */}
        <div className="flex justify-around bg-gray-50 rounded-2xl p-4 mb-8 shadow-inner">
          <div className="text-center">
            <div className="w-10 h-10 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <p className="text-xs text-gray-500">기간</p>
            <p className="text-xs font-bold text-gray-900 mt-1">
              {event.start_date}
            </p>
          </div>
          <div className="w-px bg-gray-200"></div>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-lg font-bold text-purple-600">₩</span>
            </div>
            <p className="text-xs text-gray-500">비용</p>
            <p className="text-xs font-bold text-gray-900 mt-1">
              {event.is_free ? "무료" : event.price}
            </p>
          </div>
          <div className="w-px bg-gray-200"></div>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
              <Gift size={20} className="text-green-600" />
            </div>
            <p className="text-xs text-gray-500">혜택</p>
            <p className="text-xs font-bold text-gray-900 mt-1 truncate max-w-[80px]">
              {getBenefit(event.category)}
            </p>
          </div>
        </div>

        {/* 상세 설명 */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-l-4 border-blue-500 pl-3">
            상세 소개
          </h3>
          <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
            {event.description}
          </p>
        </div>

        {/* 방문 인증 섹션 */}
        <div className="mb-10 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Stamp size={20} className="text-indigo-600" />
                디지털 스탬프
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                현장 방문 후 인증하면 내 투어북에 저장돼요
              </p>
            </div>
            {isVisited && (
              <div className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                인증됨
              </div>
            )}
          </div>

          <button
            onClick={handleCheckIn}
            disabled={isVisited}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              isVisited
                ? "bg-gray-200 text-gray-500 cursor-default"
                : "bg-indigo-600 text-white shadow-lg active:scale-95"
            }`}
          >
            {isVisited ? <>✅ 스탬프 획득 완료</> : <>📍 현장 방문 인증하기</>}
          </button>
        </div>

        {/* 기대평 & 응원 섹션 (Pre-event) */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6 px-1">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Megaphone size={20} className="text-red-500 fill-red-50" />
              기대평 & 응원
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Live Cheers</span>
              <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-full">{cheers.length}</span>
            </div>
          </div>

          {/* 응원 작성 폼 */}
          <form onSubmit={handleCheerSubmit} className="mb-10 bg-white rounded-[40px] p-8 border-2 border-gray-50 shadow-2xl shadow-gray-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16 opacity-50 blur-2xl"></div>
            
            <div className="flex gap-3 mb-6 relative">
              <button
                type="button"
                onClick={() => setCheerType("cheer")}
                className={`px-6 py-2.5 rounded-2xl text-[11px] font-black transition-all flex items-center gap-2 ${
                  cheerType === "cheer" ? "bg-gray-900 text-white shadow-xl scale-105" : "bg-gray-50 text-gray-400 border border-gray-100"
                }`}
              >
                ✨ 기대돼요
              </button>
              <button
                type="button"
                onClick={() => setCheerType("ticket_proof")}
                className={`px-6 py-2.5 rounded-2xl text-[11px] font-black transition-all flex items-center gap-2 ${
                  cheerType === "ticket_proof" ? "bg-red-500 text-white shadow-xl shadow-red-100 scale-105" : "bg-gray-50 text-gray-400 border border-gray-100"
                }`}
              >
                🎫 티켓인증
              </button>
            </div>
            
            <div className="relative">
              <textarea
                className="w-full text-base font-bold bg-gray-50/50 border-none rounded-[32px] p-6 focus:ring-0 transition-all resize-none placeholder:text-gray-300"
                rows={3}
                placeholder={cheerType === "ticket_proof" ? "예매 완료! 어떤 자리를 잡으셨나요?" : "이 행사가 기다려지는 이유를 남겨주세요!"}
                value={cheerContent}
                onChange={(e) => setCheerContent(e.target.value)}
              />
              <button
                type="submit"
                className="absolute bottom-4 right-4 w-12 h-12 bg-gray-900 text-white rounded-[20px] flex items-center justify-center shadow-xl active:scale-90 transition-transform hover:bg-black"
              >
                <Plus size={24} className="stroke-3" />
              </button>
            </div>
          </form>

          {/* 응원 리스트 */}
          <div className="space-y-4">
            {cheers.map((cheer) => (
              <div key={cheer.id} className="bg-white rounded-[32px] p-6 border border-gray-50 shadow-sm relative group hover:shadow-md transition-shadow">
                {cheer.comment_type === "ticket_proof" && (
                  <div className="absolute top-6 right-6 bg-red-500 text-white px-3 py-1 text-[9px] font-black rounded-full uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-red-100">
                     <Ticket size={10} className="fill-current" /> Verified Ticket
                  </div>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400">
                    {cheer.user.email[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-xs text-gray-900">{cheer.user.email.split('@')[0]}</p>
                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">{new Date(cheer.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-700 leading-relaxed italic pl-1">
                  "{cheer.content}"
                </p>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50">
                   <button className="text-[10px] font-black text-gray-300 uppercase hover:text-red-500 transition-colors flex items-center gap-1">
                    <Heart size={12} /> Support
                   </button>
                   <button className="text-[10px] font-black text-gray-300 uppercase flex items-center gap-1">
                    <MessageCircle size={12} /> Reply
                   </button>
                </div>
              </div>
            ))}
            {cheers.length === 0 && (
              <div className="text-center py-16 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                 <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Megaphone size={30} className="text-gray-200" />
                 </div>
                 <h4 className="text-sm font-black text-gray-900 mb-1">아직 첫 응원이 없어요!</h4>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Be the loudest fan for this event! 📣</p>
              </div>
            )}
          </div>
        </div>

        {/* 리뷰 섹션 (Premium Modern Style) */}
        <div className="mb-14" id="reviews-section">
          <div className="flex items-center justify-between mb-8 px-1">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Star size={24} className="fill-yellow-400 text-yellow-400" />
              생생한 방문 후기
            </h3>
            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full">
              {reviews.length > 0 
                ? `평균 ${(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)}점` 
                : "첫 리뷰의 주인공이 되어보세요"}
            </span>
          </div>

          {/* 평점 요약 카드 */}
          {reviews.length > 0 && (
            <div className="bg-gray-900 rounded-[32px] p-8 mb-10 flex items-center justify-around shadow-2xl opacity-95 text-white">
               <div className="text-center">
                  <p className="text-4xl font-black text-white mb-2 leading-none">
                    {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)}
                  </p>
                  <div className="flex justify-center gap-0.5 mb-2">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={14} className={s <= Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) ? "fill-yellow-400 text-yellow-400" : "text-gray-700"} />
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Average Score</p>
               </div>
               <div className="w-px h-16 bg-white/10"></div>
               <div className="flex flex-col gap-1.5">
                  {[5,4,3,2,1].map(score => {
                    const count = reviews.filter(r => r.rating === score).length;
                    const percent = (count / reviews.length) * 100;
                    return (
                      <div key={score} className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-gray-400 w-4">{score}</span>
                        <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400" style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                    )
                  })}
               </div>
            </div>
          )}

          {/* 리뷰 작성 폼 (Floating Inside Container Style) */}
          <div className="mb-12 bg-white rounded-[40px] p-8 border-2 border-gray-50 shadow-2xl shadow-gray-100">
            <h4 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-widest">Share Your Experience</h4>
            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform active:scale-90"
                >
                  <Star
                    size={32}
                    className={`${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-100"}`}
                  />
                </button>
              ))}
            </div>
            
            <div className="relative">
              <textarea
                className="w-full text-base font-bold bg-gray-50/50 border-none rounded-[32px] p-6 focus:ring-0 transition-all resize-none placeholder:text-gray-300"
                rows={3}
                placeholder="어떤 점이 좋았나요? (분위기, 볼거리, 팁 등)"
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
              />
              <button
                onClick={handleReviewSubmit}
                className="absolute bottom-4 right-4 w-12 h-12 bg-blue-600 text-white rounded-[20px] flex items-center justify-center shadow-xl active:scale-90 transition-transform hover:bg-blue-700"
              >
                <Plus size={24} className="stroke-3" />
              </button>
            </div>
          </div>

          {/* 리뷰 리스트 */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="bg-white rounded-[32px] p-7 border border-gray-50 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-gray-100 to-gray-50 flex items-center justify-center text-xs font-black text-gray-400 border border-gray-100 shadow-sm">
                      {review.user_email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-sm text-gray-900">{review.user_email.split("@")[0]}***</p>
                      <p className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                        {new Date(review.created_at).toLocaleDateString()} • Verified Visitor
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-100"}
                      />
                    ))}
                  </div>
                </div>
                
                <p className="text-sm font-bold text-gray-700 leading-relaxed bg-gray-50/50 p-5 rounded-2xl mb-4">
                  {review.content}
                </p>
                
                <div className="flex items-center gap-4">
                   <button className="text-[10px] font-black text-gray-400 uppercase hover:text-blue-500 transition-colors flex items-center gap-1.5">
                    <Heart size={14} /> Helpful
                   </button>
                   <button className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1.5">
                    <MessageCircle size={14} /> Reply
                   </button>
                </div>
              </div>
            ))}
            {reviews.length === 0 && (
              <div className="text-center py-20 bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-100">
                 <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <MessageCircle size={36} className="text-gray-200" />
                 </div>
                 <h4 className="text-base font-black text-gray-900 mb-1">첫 번째 리뷰를 기다리고 있어요!</h4>
                 <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest italic font-serif">Leave your precious footprint 👣</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 하단 CTA */}
      <div className="fixed lg:absolute bottom-0 w-full max-w-[480px] lg:max-w-none left-1/2 lg:left-0 -translate-x-1/2 lg:translate-x-0 bg-white border-t border-gray-100 p-4 pb-8 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <button
          onClick={handleLike}
          className={`w-full font-bold py-4 rounded-2xl active:scale-[0.98] transition-transform shadow-lg ${
            isLiked
              ? "bg-gray-100 text-gray-500"
              : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          }`}
        >
          {isLiked ? "관심 목록에 저장됨" : "관심 있어요!"}
        </button>
      </div>
      {/* 이미지 확대 모달 */}
      {showImageModal && (
        <div 
          className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setShowImageModal(false)}
        >
          <button 
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            onClick={() => setShowImageModal(false)}
          >
            <Plus size={32} className="rotate-45" />
          </button>
          
          <div className="relative w-full h-full max-w-4xl max-h-[80vh]">
            <Image
              src={event.image_url}
              alt={event.title}
              fill
              className="object-contain"
              priority
            />
          </div>
          
          <div className="absolute bottom-10 left-0 right-0 text-center">
            <p className="text-white/80 font-black text-lg p-4 drop-shadow-lg">{event.title}</p>
          </div>
        </div>
      )}
    </div>
  );
}
