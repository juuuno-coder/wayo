"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  LogOut,
  Settings,
  ChevronRight,
  Package,
  Heart,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("userEmail");
  });

  // No need to setEmail in useEffect on mount anymore (lazy initializer used)

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");

    // Clear all Wayo-related guest data
    localStorage.removeItem("pending_invitations");

    // Clear all guest role markers
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("wayo_guest_")) {
        localStorage.removeItem(key);
      }
    });

    alert("로그아웃 되었습니다.");
    router.push("/");
    setEmail(null);
  };

  if (!email) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <User size={40} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          로그인이 필요해요
        </h2>
        <p className="text-gray-500 text-center mb-8">
          로그인하고 더 많은 혜택을 누려보세요!
        </p>
        <button
          onClick={() => router.push("/login")}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl active:scale-[0.98] transition-transform shadow-lg shadow-blue-500/20"
        >
          로그인하러 가기
        </button>
        <button
          onClick={() => {
            localStorage.setItem("userEmail", "test@gabojago.com");
            localStorage.setItem("authToken", "mock-token");
            setEmail("test@gabojago.com");
          }}
          className="mt-4 w-full bg-gray-100 text-gray-500 font-bold py-3 rounded-2xl text-sm"
        >
          (개발용) 바로 로그인하기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white px-6 py-8 pb-10 rounded-b-[2rem] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
            {email[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{email}님</h1>
            <p className="text-sm text-gray-500">Gabojago 멤버</p>
          </div>
        </div>
      </header>

      <div className="px-6 mt-8 space-y-4">
        <Link href="/orders">
          <MenuCard icon={<Package size={20} />} label="주문 내역" />
        </Link>
        <Link href="/likes">
          <MenuCard icon={<Heart size={20} />} label="찜한 목록" />
        </Link>
        <MenuCard icon={<Settings size={20} />} label="앱 설정" />
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
              <LogOut size={16} />
            </div>
            <span className="font-medium text-gray-700">로그아웃</span>
          </div>
        </button>
      </div>
    </div>
  );
}

function MenuCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="w-full flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm border border-gray-100 cursor-pointer active:scale-[0.98] transition-transform">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
          {icon}
        </div>
        <span className="font-medium text-gray-700">{label}</span>
      </div>
      <ChevronRight size={20} className="text-gray-400" />
    </div>
  );
}
