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
  Sparkles,
  MousePointer2,
  Search
} from "lucide-react";
import Link from "next/link";
import { Black_Han_Sans, Inter } from "next/font/google";
import { motion } from "framer-motion";

import { useAuth } from "@/contexts/AuthContext";

const blackHanSans = Black_Han_Sans({
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

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
    <div className={`min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 ${inter.className}`}>
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Left Side: Brand Section (Hidden on Mobile, Visible on LG) */}
        <div className="hidden lg:block space-y-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-100 text-[#E74C3C] rounded-full text-xs font-black uppercase tracking-widest">
              <Sparkles size={14} /> Wayo App
            </div>
            <h1 className={`text-7xl text-[#333] tracking-tighter leading-none ${blackHanSans.className}`}>
              WAYO
            </h1>
            <p className="text-3xl leading-tight font-light text-gray-800">
              마음을 담은 정교한 초대장<br />
              <span className="font-bold text-[#E74C3C] border-b-4 border-[#E74C3C]/20">당신의 공간으로 지금 바로 와요</span>
            </p>
          </div>

          {/* Search Box */}
          <div className="relative max-w-md group">
            <input
              type="text"
              placeholder="초대장을 검색해보세요"
              className="w-full pl-6 pr-16 py-5 rounded-2xl bg-white border border-transparent shadow-lg shadow-gray-200/50 text-lg placeholder-gray-300 focus:ring-4 focus:ring-red-100 focus:border-[#E74C3C]/20 transition-all outline-none"
            />
            <button className="absolute right-2 top-2 bottom-2 aspect-square bg-[#E74C3C] text-white rounded-xl flex items-center justify-center hover:bg-[#c0392b] transition-colors shadow-md shadow-red-200">
              <Search size={20} className="stroke-[3]" />
            </button>
          </div>

          {/* Tags */}
          <div className="flex gap-3 flex-wrap">
            {['#초대장', '#동창회', '#청첩장', '#돌잔치', '#생일파티'].map(tag => (
              <span key={tag} className="px-4 py-2 bg-white border border-gray-100 rounded-full text-sm font-bold text-gray-500 hover:text-[#E74C3C] hover:border-red-100 transition-colors cursor-pointer shadow-sm">
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-12 border-t border-gray-200/50 pt-10">
            {[
              { val: '500++', label: 'EVENTS' },
              { val: '10K++', label: 'VISITORS' },
              { val: '4.9★', label: 'RATING' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-3xl font-black text-[#333] mb-1">{stat.val}<span className="text-[#E74C3C] text-lg align-top">+</span></p>
                <p className="text-[10px] font-bold text-gray-400 tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Profile Card (Mobile App Style) */}
        <div className="flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[400px] bg-white rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border-[8px] border-gray-900 p-2 relative overflow-hidden"
          >
            <div className="bg-gray-50 rounded-[32px] h-full min-h-[700px] flex flex-col relative overflow-hidden">

              {/* Inner Header */}
              <div className="p-8 pt-12 bg-white pb-8 rounded-b-[40px] shadow-sm mb-6">
                <div className="flex items-center gap-5">
                  {user?.avatarUrl ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 shadow-inner">
                      <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                      {user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{user?.email || 'Guest'}님</h2>
                    <p className="text-xs font-medium text-gray-500">Wayo Member</p>
                  </div>
                </div>
              </div>

              {/* Menu List */}
              <div className="px-6 space-y-4 flex-1">
                <Link href="/invitations/manage">
                  <MenuCard icon={<Package size={18} />} label="주문 내역" />
                </Link>
                <Link href="/likes">
                  <MenuCard icon={<Heart size={18} />} label="찜한 목록" />
                </Link>
                <MenuCard icon={<Settings size={18} />} label="앱 설정" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform group mt-4 h-20"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#E74C3C] group-hover:bg-[#E74C3C] group-hover:text-white transition-colors">
                      <LogOut size={18} />
                    </div>
                    <span className="font-bold text-gray-700 text-base">로그아웃</span>
                  </div>
                </button>
              </div>

              {/* Bottom Decoration */}
              <div className="p-6 text-center opacity-20">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Wayo App v1.0.2</p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

function MenuCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="w-full flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm border border-gray-100 cursor-pointer active:scale-[0.98] transition-all hover:bg-gray-50 group h-20">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-gray-200 transition-colors">
          {icon}
        </div>
        <span className="font-bold text-gray-700 text-base">{label}</span>
      </div>
      <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
    </div>
  );
}
