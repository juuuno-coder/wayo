"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MoveLeft, Heart, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function WayoLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { login } = useAuth();

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

                const data = await response.json();
                const userData = data.user || data;

                if (token && userData && userData.email) {
                    const userObj = {
                        id: String(userData.id),
                        email: userData.email,
                        nickname: userData.nickname,
                        avatarUrl: userData.avatar_url
                    };
                    // Use context login to update state immediately
                    login(token, userObj);
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
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Brand */}
                <div className="text-center mb-10">
                    <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 bg-red-100 text-[#E74C3C] rounded-full text-xs font-bold uppercase tracking-widest">
                        <Sparkles size={14} /> Wayo Member
                    </div>
                    <h1 className="text-7xl font-black text-[#E74C3C] tracking-tighter mb-4">WAYO</h1>
                    <p className="text-gray-400 font-medium leading-relaxed text-sm">
                        마음을 담은 정교한 초대장<br />
                        <span className="text-gray-900 font-bold decoration-[#E74C3C]/30 decoration-4">지금 바로 와요 💌</span>
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 ml-2 uppercase tracking-wider">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="이메일을 입력해주세요"
                                className="w-full px-6 py-4.5 bg-gray-50 border border-transparent rounded-2xl text-base focus:bg-white focus:border-[#E74C3C] focus:ring-4 focus:ring-red-50 outline-none transition-all font-medium placeholder:text-gray-300"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 ml-2 uppercase tracking-wider">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력해주세요"
                                className="w-full px-6 py-4.5 bg-gray-50 border border-transparent rounded-2xl text-base focus:bg-white focus:border-[#E74C3C] focus:ring-4 focus:ring-red-50 outline-none transition-all font-medium placeholder:text-gray-300"
                            />
                        </div>

                        <button type="submit" className="w-full bg-[#E74C3C] hover:bg-[#c0392b] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-red-200 active:scale-[0.98] transition-all mt-4">
                            로그인
                        </button>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-4 bg-white text-gray-300 font-bold uppercase tracking-widest text-[10px]">Social Login</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-4.5 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                            Google 계정으로 시작하기
                        </button>

                        <div className="text-center mt-8">
                            <Link href="/signup" className="text-sm font-bold text-gray-400 hover:text-[#E74C3C] transition-colors">
                                아직 계정이 없으신가요? <span className="text-[#E74C3C] border-b border-[#E74C3C]/30 ml-1">회원가입</span>
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Footer Info */}
                <div className="mt-12 text-center opacity-30">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Wayo App Service Platform</p>
                </div>
            </div>
        </div>
    );
}
