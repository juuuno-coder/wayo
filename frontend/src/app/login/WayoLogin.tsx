"use client";

import Link from "next/link";
import { useState } from "react";
import { MoveLeft, Heart, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WayoLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous sessions
        localStorage.removeItem("authToken");
        localStorage.removeItem("userEmail");

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/users/sign_in`, {
                method: "POST", // 실제 엔드포인트에 맞게 조정 필요
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user: { email, password } }),
            });

            if (response.ok) {
                const token = response.headers.get("Authorization");
                if (token) localStorage.setItem("authToken", token);
                const data = await response.json();
                localStorage.setItem("userEmail", data.user.email);
                localStorage.setItem("userId", String(data.user.id));

                router.push("/");
            } else {
                alert("이메일 또는 비밀번호를 다시 확인해주세요.");
            }
        } catch (error) {
            console.error(error);
            alert("로그인 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6 font-sans">
            <div className="w-[400px] bg-white rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.08)] px-8 py-12 relative overflow-hidden ring-8 ring-white">

                {/* Header Button */}
                <div className="absolute top-8 right-8">
                    <button className="px-4 py-1.5 border border-gray-200 rounded-full text-xs font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-50">
                        Login
                    </button>
                </div>

                {/* Brand */}
                <div className="text-center mb-10 mt-4">
                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-[#FFF0F0] text-[#E02424] rounded-full text-[10px] font-bold uppercase tracking-widest">
                        <Sparkles size={12} />
                        New Generation Invitation
                    </div>
                    <h1 className="text-6xl font-black text-[#E02424] tracking-tighter mb-4">WAYO</h1>
                    <p className="text-gray-400 font-medium leading-relaxed text-sm">
                        마음을 담은 정교한 초대장이<br />
                        당신의 공간으로 <span className="text-gray-800 font-bold underline decoration-[#E02424]/30 decoration-4">지금 바로 와요 💌</span>
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mb-10">
                    <button className="w-full bg-[#E02424] hover:bg-[#C81E1E] text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
                        <Sparkles size={18} className="group-hover:animate-spin-slow" />
                        초대장 무료로 만들기
                    </button>
                    <button className="w-full bg-white border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-600 py-4 rounded-2xl font-bold active:scale-[0.98] transition-all">
                        내 초대장 관리하기
                    </button>
                </div>

                {/* Simple Divider */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-gray-100 flex-1"></div>
                    <p className="text-[10px] text-gray-300 italic font-serif">No design skills required. Just pick and send.</p>
                    <div className="h-px bg-gray-100 flex-1"></div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="이메일 입력"
                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:border-[#E02424] outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호 입력"
                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:border-[#E02424] outline-none transition-colors"
                        />
                    </div>

                    <button type="submit" className="w-full py-3.5 text-sm font-bold text-gray-400 hover:text-[#E02424] transition-colors">
                        로그인하기 →
                    </button>
                </form>

                {/* Footer Card */}
                <div className="mt-8 bg-[#FDF2F2] rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden group cursor-pointer hover:bg-[#FEECEC] transition-colors">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#FCD5D5] rounded-full opacity-50 blur-xl group-hover:scale-110 transition-transform"></div>

                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#E02424] z-10">
                        <Heart size={20} className="fill-current" />
                    </div>
                    <div className="z-10">
                        <p className="text-[10px] items-center gap-1 text-[#E02424] font-bold flex uppercase tracking-wider mb-0.5">
                            New RSVPs <span className="w-1.5 h-1.5 rounded-full bg-[#E02424] animate-pulse" />
                        </p>
                        <p className="font-bold text-2xl text-[#8E1B1B]">+24 Guests</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
