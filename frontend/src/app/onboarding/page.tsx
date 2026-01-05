"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, User, Heart, CheckCircle2 } from "lucide-react";
import { api } from "@/utils/api";

const locations = [
  "서울", "경기", "인천", "강원", "대전", "세종", "충남", "충북",
  "부산", "울산", "경남", "경북", "대구", "광주", "전남", "전북", "제주"
];

const interestOptions = [
  { id: "festival", name: "축제", emoji: "🎉" },
  { id: "exhibition", name: "박람회", emoji: "🏢" },
  { id: "art", name: "전시회", emoji: "🎨" },
  { id: "contest", name: "공모전", emoji: "🏆" },
  { id: "popup", name: "팝업", emoji: "🎪" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nickname: "",
    location: "",
    interests: [] as string[]
  });

  useEffect(() => {
    // Check if user is logged in, if not redirect
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.replace("/login");
    }
  }, []);

  const handleInterestToggle = (id: string) => {
    if (formData.interests.includes(id)) {
      setFormData({ ...formData, interests: formData.interests.filter(i => i !== id) });
    } else {
      setFormData({ ...formData, interests: [...formData.interests, id] });
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await api.put("/user", { user: formData });
      if (res) {
        alert("환영합니다! 가보자고와 함께 즐거운 여정을 시작하세요!");
        router.replace("/");
      }
    } catch (error) {
      console.error("Onboarding failed:", error);
      alert("저장에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between pb-10">
      {/* Progress */}
      <div className="pt-12 px-6">
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-green-500' : 'bg-gray-100'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-8 animate-in slide-in-from-right">
            <div>
              <h1 className="text-3xl font-black text-gray-900 mb-3">어떻게 불러드릴까요?</h1>
              <p className="text-gray-500 font-medium">가보자고에서 사용하실 닉네임을 알려주세요.</p>
            </div>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                value={formData.nickname}
                onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                placeholder="닉네임 입력 (2~10자)"
                className="w-full pl-12 pr-4 py-5 bg-gray-50 rounded-2xl font-bold text-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right">
            <div>
              <h1 className="text-3xl font-black text-gray-900 mb-3">어디 사시나요?</h1>
              <p className="text-gray-500 font-medium">주변 행사를 쏙쏙 골라 추천해드릴게요.</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setFormData({...formData, location: loc})}
                  className={`py-4 rounded-xl font-bold transition-all ${
                    formData.location === loc 
                      ? "bg-green-500 text-white shadow-lg shadow-green-200 scale-[1.02]" 
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in slide-in-from-right">
            <div>
              <h1 className="text-3xl font-black text-gray-900 mb-3">어떤게 좋으세요?</h1>
              <p className="text-gray-500 font-medium">관심있는 분야를 모두 골라주세요.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {interestOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleInterestToggle(option.id)}
                  className={`p-6 rounded-2xl text-left border-2 transition-all group ${
                    formData.interests.includes(option.id)
                      ? "border-green-500 bg-green-50 text-green-900"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{option.emoji}</div>
                  <div className="font-black text-lg">{option.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-6 space-y-3">
        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={
              (step === 1 && !formData.nickname) || 
              (step === 2 && !formData.location)
            }
            className="w-full py-5 bg-green-500 text-white rounded-2xl font-bold shadow-xl shadow-green-200 disabled:opacity-30 disabled:shadow-none transition-all active:scale-[0.98]"
          >
            다음으로
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={formData.interests.length === 0}
            className="w-full py-5 bg-green-500 text-white rounded-2xl font-bold shadow-xl shadow-green-200 disabled:opacity-30 disabled:shadow-none transition-all active:scale-[0.98]"
          >
            가보자고! 🚀
          </button>
        )}
        {step > 1 && (
          <button 
            onClick={() => setStep(step - 1)}
            className="w-full py-4 text-gray-400 font-bold text-sm hover:text-gray-600"
          >
            이전으로
          </button>
        )}
      </div>
    </div>
  );
}
