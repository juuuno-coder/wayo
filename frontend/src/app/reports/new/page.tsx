"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Send,
  Camera,
  MessageSquare
} from "lucide-react";
import { API_BASE_URL } from "@/config";

function EventReportForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "future"; // 'future' or 'past'

  const isPast = type === "past";

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    location: "",
    date_info: "",
    report_type: type
  });

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/event_reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify({ event_report: formData })
      });

      if (response.ok) {
        alert(isPast ? "소중한 추억이 저장되었습니다! 📸" : "제보해주셔서 감사합니다! 검토 후 등록될 예정입니다. 🚀");
        router.back();
      } else {
        alert("등록에 실패했습니다. 로그인을 확인해주세요.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center gap-4 sticky top-0 z-50">
        <button onClick={() => router.back()} className="text-gray-600">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold">{isPast ? "추억하기" : "이벤트 제보하기"}</h1>
      </header>

      <div className="px-6 py-6 space-y-8">
        {/* Intro */}
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            {isPast ? "어떤 추억을 남기시겠어요?" : "어떤 행사를 발견하셨나요?"}
          </h2>
          <p className="text-gray-500 font-medium">
            {isPast
              ? "다녀오신 행사의 사진과 리뷰를 남겨주세요."
              : "아직 가보자고에 없나요? 정보를 알려주시면 추가해드릴게요!"}
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 ml-1">
              {isPast ? "다녀온 행사 이름" : "행사 이름"}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="행사명을 입력해주세요"
              className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 ml-1">장소</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="위치"
                  className="w-full pl-10 pr-4 py-4 bg-gray-50 border-none rounded-2xl font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 ml-1">
                {isPast ? "방문 날짜" : "행사 날짜"}
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.date_info}
                  onChange={(e) => setFormData({ ...formData, date_info: e.target.value })}
                  placeholder="날짜 정보"
                  className="w-full pl-10 pr-4 py-4 bg-gray-50 border-none rounded-2xl font-medium"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 ml-1">
              {isPast ? "나만의 기록" : "상세 정보 (선택)"}
            </label>
            <div className="relative">
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder={isPast ? "좋았던 점, 아쉬웠던 점 등을 기록해보세요." : "행사에 대한 추가 정보를 자유롭게 적어주세요."}
                className="w-full p-4 bg-gray-50 border-none rounded-2xl font-medium h-40 resize-none outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="absolute bottom-4 right-4 text-gray-400">
                <MessageSquare size={18} />
              </div>
            </div>
          </div>

          {/* Image Upload Placeholder (To be implemented) */}
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-gray-400 gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
            <Camera size={32} />
            <span className="text-xs font-bold">사진 추가하기 (준비중)</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!formData.title}
          className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all flex items-center justify-center gap-2 ${isPast
            ? "bg-purple-500 hover:bg-purple-600 shadow-purple-200"
            : "bg-blue-500 hover:bg-blue-600 shadow-blue-200"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Send size={20} />
          {isPast ? "추억 저장하기" : "제보 완료"}
        </button>
      </div>
    </div>
  );
}

export default function EventReportPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EventReportForm />
    </Suspense>
  );
}
