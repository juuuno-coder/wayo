"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Settings,
  ChevronRight,
  Package,
  Heart,
  Sparkles,
  User as UserIcon,
  ChevronLeft,
  Home
} from "lucide-react";
import Link from "next/link";
import { Inter, Black_Han_Sans } from "next/font/google";
import { useAuth } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });
const blackHanSans = Black_Han_Sans({ weight: "400", subsets: ["latin"] });

export default function ProfilePage() {
  const router = useRouter();
  const { isLoggedIn, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    alert("로그아웃 되었습니다.");
  };

  if (!isLoggedIn) {
    router.push("/login");
    return null;
  }

  return (
    <div className={`min-h-screen bg-[#FDFBF7] ${inter.className}`}>
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 hover:bg-gray-50 rounded-full text-gray-600 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => router.push('/')}
              className={`text-xl text-[#E74C3C] font-black tracking-tighter hover:opacity-80 transition-opacity ${blackHanSans.className}`}
            >
              WAYO
            </button>
            <div className="w-px h-6 bg-gray-200 mx-2" />
            <h1 className="text-xl font-bold text-gray-900">마이 페이지</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/")}
              className="p-2 hover:bg-gray-50 rounded-full text-gray-600 transition-colors"
              title="홈으로"
            >
              <Home size={22} />
            </button>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-[#E74C3C] rounded-full text-[10px] font-bold uppercase tracking-widest ml-2">
              <Sparkles size={10} /> Wayo Member
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto py-12 px-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 flex items-center gap-6">
          <div className="relative">
            {user?.avatarUrl ? (
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 shadow-inner">
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-3xl font-bold text-[#E74C3C] border-4 border-white shadow-sm">
                {user?.email?.[0]?.toUpperCase() || <UserIcon size={32} />}
              </div>
            )}
            <div className="absolute bottom-0 right-0 bg-[#E74C3C] text-white p-1.5 rounded-full border-2 border-white">
              <Settings size={14} />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.nickname || user?.email?.split('@')[0] || 'Guest'}님</h2>
            <p className="text-gray-400 font-medium">{user?.email}</p>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link href="/invitations/manage">
            <MenuCard
              icon={<Package size={24} />}
              label="초대장 관리"
              desc="보내고 받은 초대장 내역"
              highlight
            />
          </Link>
          <Link href="/likes">
            <MenuCard
              icon={<Heart size={24} />}
              label="찜한 목록"
              desc="관심 있는 행사 모음"
            />
          </Link>
        </div>

        {/* Settings Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-2">
          <h3 className="text-sm font-bold text-gray-400 mb-4 ml-2">계정 설정</h3>
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors text-left group">
            <span className="font-bold text-gray-700">알림 설정</span>
            <ChevronRight size={20} className="text-gray-300 group-hover:text-gray-500" />
          </button>
          <Link href="/profile/change-password">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors text-left group">
              <span className="font-bold text-gray-700">비밀번호 변경</span>
              <ChevronRight size={20} className="text-gray-300 group-hover:text-gray-500" />
            </button>
          </Link>
          <div className="h-px bg-gray-100 my-2" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 hover:bg-red-50 rounded-2xl transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <LogOut size={20} className="text-gray-400 group-hover:text-[#E74C3C] transition-colors" />
              <span className="font-bold text-gray-700 group-hover:text-[#E74C3C] transition-colors">로그아웃</span>
            </div>
          </button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">Wayo App v1.0.2</p>
        </div>
      </div>
    </div>
  );
}

function MenuCard({ icon, label, desc, highlight = false }: { icon: React.ReactNode; label: string; desc: string; highlight?: boolean }) {
  return (
    <div className={`w-full p-6 rounded-3xl border transition-all hover:scale-[1.02] cursor-pointer h-full flex flex-col justify-between group ${highlight
      ? 'bg-white border-red-100 shadow-sm hover:shadow-md hover:border-[#E74C3C]'
      : 'bg-white border-gray-100 hover:border-gray-300 shadow-sm'
      }`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${highlight ? 'bg-red-50 text-[#E74C3C] group-hover:bg-[#E74C3C] group-hover:text-white' : 'bg-gray-50 text-gray-600 group-hover:bg-gray-900 group-hover:text-white'
        }`}>
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-lg text-gray-900 mb-1">{label}</h3>
        <p className="text-sm text-gray-400 font-medium">{desc}</p>
      </div>
    </div>
  );
}
