"use client";

import { useEffect, useState } from "react";
import { MoveLeft, Heart, Share2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AuthModal from "@/components/AuthModal";
import { API_BASE_URL } from "@/config";

interface Review {
  id: number;
  rating: number;
  content: string;
  created_at: string;
  user_email: string;
}

interface Item {
  id: number;
  title: string;
  price: number;
  image_url: string;
  category: string;
  description: string;
  average_rating: number;
  review_count: number;
  reviews: Review[];
}

export default function ItemDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false); // 좋아요 상태
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (params?.id) {
      fetchItem(params.id as string);
    }
  }, [params]);

  const fetchItem = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/items/${id}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setItem(data);
      // TODO: 좋아요 상태도 불러와야 하지만 일단 false로 시작
    } catch (error) {
      console.error("Error fetching item:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/items/${item?.id}/like`, {
        method: "POST",
        headers: {
          Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setIsLiked(data.liked);
      }
    } catch (error) {
      console.error("Like Error:", error);
    }
  };

  const addToCart = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/cart_items`, {
        method: "POST",
        headers: {
          Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item_id: item?.id,
          quantity: 1,
        }),
      });

      if (res.ok) {
        alert("장바구니에 담았습니다!");
      }
    } catch (error) {
      console.error("Cart Error:", error);
    }
  };

  const writeReview = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }

    const rating = prompt("별점을 입력해주세요 (1-5):");
    if (
      !rating ||
      isNaN(Number(rating)) ||
      Number(rating) < 1 ||
      Number(rating) > 5
    ) {
      alert("1~5 사이의 숫자를 입력해주세요.");
      return;
    }

    const content = prompt("리뷰 내용을 입력해주세요 (최소 10자):");
    if (!content || content.length < 10) {
      alert("리뷰는 최소 10자 이상 입력해주세요.");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/items/${item?.id}/reviews`,
        {
          method: "POST",
          headers: {
            Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating: Number(rating),
            content: content,
          }),
        }
      );

      if (res.ok) {
        alert("리뷰가 등록되었습니다!");
        // 페이지 새로고침하여 리뷰 반영
        if (params?.id) {
          fetchItem(params.id as string);
        }
      }
    } catch (error) {
      console.error("Review Error:", error);
      alert("리뷰 등록 중 오류가 발생했습니다.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!item)
    return (
      <div className="min-h-screen flex items-center justify-center">
        상품을 찾을 수 없습니다.
      </div>
    );

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* 상단 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
        >
          <MoveLeft size={24} className="text-gray-900" />
        </button>
        <div className="flex gap-3">
          <button className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
            <Share2 size={24} className="text-gray-900" />
          </button>
        </div>
      </header>

      {/* 상품 이미지 */}
      <div className="w-full aspect-square relative bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Image
          src={item.image_url}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>

      {/* 상품 정보 */}
      <div className="px-6 py-8">
        <div className="flex flex-col gap-2 mb-6">
          <span className="text-sm text-gray-500 font-medium">
            {item.category}
          </span>
          <h1 className="text-2xl font-bold text-gray-900 leading-snug">
            {item.title}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold text-gray-900">
              {item.price.toLocaleString()}원
            </span>
          </div>
        </div>

        <div className="h-px w-full bg-gray-100 my-6" />

        <div className="prose prose-sm text-gray-600">
          <h3 className="text-lg font-bold text-gray-900 mb-2">상품 설명</h3>
          <p className="whitespace-pre-wrap leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* 리뷰 섹션 */}
      <div className="px-6 py-6 bg-white mt-2">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">리뷰</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={
                      star <= Math.round(item.average_rating)
                        ? "text-yellow-400"
                        : "text-gray-200"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {item.average_rating.toFixed(1)} ({item.review_count}개)
              </span>
            </div>
          </div>
          <button
            onClick={writeReview}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg active:scale-95 transition-transform"
          >
            리뷰 작성
          </button>
        </div>

        {item.reviews && item.reviews.length > 0 ? (
          <div className="space-y-4">
            {item.reviews.map((review) => (
              <div key={review.id} className="border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={
                          star <= review.rating
                            ? "text-yellow-400 text-sm"
                            : "text-gray-200 text-sm"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {review.user_email.split("@")[0]}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(review.created_at).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {review.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">
            아직 리뷰가 없어요. 첫 리뷰를 남겨주세요!
          </p>
        )}
      </div>

      {/* 하단 고정 구매 버튼 바 */}
      <div className="fixed bottom-0 w-full max-w-[480px] left-1/2 -translate-x-1/2 bg-white border-t border-gray-100 p-4 pb-8 z-50 flex items-center gap-3">
        <button
          onClick={toggleLike}
          className={`w-12 h-12 border ${isLiked ? "border-red-200 bg-red-50" : "border-gray-200"
            } rounded-xl flex items-center justify-center transition-colors`}
        >
          <Heart
            size={24}
            className={isLiked ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>
        <button
          onClick={addToCart}
          className="flex-1 bg-blue-600 text-white font-bold h-12 rounded-xl active:scale-[0.98] transition-transform shadow-lg shadow-blue-500/20"
        >
          장바구니 담기
        </button>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
