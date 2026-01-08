"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MoveLeft, Sparkles, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";
import { API_BASE_URL } from "@/config";

export default function WayoSignup() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalData, setAuthModalData] = useState({ title: "", message: "" });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const emailParam = params.get("email");
        const id = params.get("id");

        if (token && emailParam && id) {
            localStorage.setItem("authToken", token);
            localStorage.setItem("userEmail", emailParam);
            localStorage.setItem("userId", id);
            router.replace("/");
        }
    }, [router]);

    const handleGoogleLogin = () => {
        const backendUrl = API_BASE_URL;
        const origin = window.location.origin;
        window.location.href = `${backendUrl}/users/auth/google_oauth2?origin=${encodeURIComponent(origin)}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== passwordConfirm) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user: {
                        email: email,
                        password: password,
                        password_confirmation: passwordConfirm,
                        nickname: email.split('@')[0],
                        signup_origin: 'wayo'
                    },
                }),
            });

            if (response.ok) {
                alert("와요! 환영합니다. 이제 로그인해주세요.");
                router.push("/login");
            } else {
                const data = await response.json();
                if (data.status === 'integrated_account_exists') {
                    setAuthModalData({
                        title: "이미 통합 회원이십니다!",
                        message: "가보자고에서 사용하시던 계정으로 와요를 바로 이용하실 수 있습니다.\n별도의 가입 없이 로그인을 진행해 주세요."
                    });
                    setIsAuthModalOpen(true);
                } else {
                    alert("회원가입 실패: " + (data.errors ? data.errors.join(", ") : data.message || "오류가 발생했습니다."));
                }
            }
        } catch (error) {
            console.error(error);
            alert("서버와 연결할 수 없습니다.");
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Brand */}
                <div className="text-center mb-10">
                    <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 bg-red-100 text-[#E74C3C] rounded-full text-xs font-bold uppercase tracking-widest">
                        <Sparkles size={14} /> Start Your Wayo
                    </div>
                    <h1 className="text-7xl font-black text-[#E74C3C] tracking-tighter mb-4">WAYO</h1>
                    <p className="text-gray-400 font-medium leading-relaxed text-sm">
                        마음을 담은 정교한 초대장<br />
                        당신만의 공간으로 <span className="text-gray-900 font-bold decoration-[#E74C3C]/30 decoration-4">지금 바로 와요 💌</span>
                    </p>
                </div>

                {/* Signup Card */}
                <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 ml-2 uppercase tracking-wider">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="이메일 주소를 입력해주세요"
                                className="w-full px-6 py-4.5 bg-gray-50 border border-transparent rounded-2xl text-base focus:bg-white focus:border-[#E74C3C] focus:ring-4 focus:ring-red-50 outline-none transition-all font-medium placeholder:text-gray-300"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 ml-2 uppercase tracking-wider">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호 (6자 이상)"
                                className="w-full px-6 py-4.5 bg-gray-50 border border-transparent rounded-2xl text-base focus:bg-white focus:border-[#E74C3C] focus:ring-4 focus:ring-red-50 outline-none transition-all font-medium placeholder:text-gray-300"
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 ml-2 uppercase tracking-wider">Confirm Password</label>
                            <input
                                type="password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                placeholder="비밀번호를 다시 입력해주세요"
                                className={`w-full px-6 py-4.5 bg-gray-50 border rounded-2xl outline-none transition-all text-base font-medium placeholder:text-gray-300 ${passwordConfirm && password !== passwordConfirm ? 'border-red-400 focus:ring-red-50 focus:bg-red-50/10' : 'border-transparent focus:bg-white focus:border-[#E74C3C] focus:ring-4 focus:ring-red-50'}`}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#E74C3C] hover:bg-[#c0392b] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-red-200 active:scale-[0.98] transition-all mt-4"
                        >
                            회원가입 완료
                        </button>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-4 bg-white text-gray-300 font-bold uppercase tracking-widest text-[10px]">Social Signup</span>
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
                            <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-[#E74C3C] transition-colors">
                                이미 계정이 있으신가요? <span className="text-[#E74C3C] border-b border-[#E74C3C]/30 ml-1">로그인</span>
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Footer Badge */}
                <div className="mt-12 p-5 bg-white/50 backdrop-blur-sm rounded-3xl flex items-center gap-4 border border-white shadow-sm">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#E74C3C]">
                        <Heart size={20} className="fill-current" />
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter leading-tight">
                        Perfect for Events <br />
                        <span className="text-gray-900">JOIN 10,000+ CREATORS</span>
                    </p>
                </div>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                title={authModalData.title}
                message={authModalData.message}
                redirectUrl="/login"
            />
        </div>
    );
}
