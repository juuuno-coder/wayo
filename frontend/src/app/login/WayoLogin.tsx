"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MoveLeft, Heart, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WayoLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const email = params.get("email");
        const id = params.get("id");

        if (token && email && id) {
            localStorage.setItem("authToken", token);
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userId", id);
            // Clean URL and redirect to home
            router.replace("/");
        }
    }, [router]);

    const handleGoogleLogin = () => {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401";
        // Pass current origin to backend so it knows where to return
        const origin = window.location.origin;
        window.location.href = `${backendUrl}/users/auth/google_oauth2?origin=${encodeURIComponent(origin)}`;
    };

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
                // Handle both { user: { email, id } } and { email, id } formats
                const userData = data.user || data;

                if (userData && userData.email) {
                    localStorage.setItem("userEmail", userData.email);
                    localStorage.setItem("userId", String(userData.id));
                }

                router.push("/");
            } else {
                const errorText = await response.text();
                console.error("Login failed:", response.status, errorText);
                alert("이메일 또는 비밀번호를 다시 확인해주세요.");
            }
        } catch (error) {
            console.error(error);
            alert("로그인 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="p-8 pb-24">
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

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="이메일 입력"
                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-base focus:border-[#E02424] focus:ring-4 focus:ring-red-50 outline-none transition-all font-medium placeholder:text-gray-300"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호 입력"
                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-base focus:border-[#E02424] focus:ring-4 focus:ring-red-50 outline-none transition-all font-medium placeholder:text-gray-300"
                    />
                </div>

                <button type="submit" className="w-full bg-[#E02424] hover:bg-[#C81E1E] text-white py-4.5 rounded-2xl font-black text-lg shadow-xl shadow-red-200 active:scale-[0.98] transition-all">
                    로그인하기
                </button>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-400 font-bold uppercase tracking-wider text-[10px]">또는</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    Google로 계속하기
                </button>

                <div className="text-center mt-8">
                    <Link href="/signup" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold text-sm transition-all active:scale-95">
                        <span>아직 계정이 없으신가요?</span>
                        <span className="text-[#E02424]">회원가입</span>
                    </Link>
                </div>
            </form>

            {/* Footer Card */}
            <div className="mt-12 bg-[#FDF2F2] rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden group cursor-pointer hover:bg-[#FEECEC] transition-colors">
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
    );
}
