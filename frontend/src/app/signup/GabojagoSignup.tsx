"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";

export default function GabojagoSignup() {
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
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401";
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/users`, {
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
                        signup_origin: 'gabojago'
                    },
                }),
            });

            if (response.ok) {
                alert("가보자고! 회원가입이 완료되었습니다.");
                router.push("/login");
            } else {
                const data = await response.json();
                if (data.status === 'integrated_account_exists') {
                    setAuthModalData({
                        title: "이미 통합 회원이십니다!",
                        message: "와요에서 사용하시던 계정으로 가보자고를 바로 이용하실 수 있습니다.\n별도의 가입 없이 로그인을 진행해 주세요."
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
        <div className="p-8 pb-20">
            <header className="mb-8">
                <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
                    <MoveLeft size={24} />
                </button>
            </header>

            <div className="mb-10">
                <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight leading-tight">
                    반가워요! <br />
                    함께 가보자고! 🚀
                </h1>
                <p className="text-gray-500 font-medium">
                    이벤트의 즐거움을 함께 나눠보세요.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="w-full px-6 py-4 bg-white border border-gray-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-100 rounded-2xl outline-none transition-all text-lg font-medium placeholder:text-gray-300"
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="6자 이상 입력해주세요"
                        className="w-full px-6 py-4 bg-white border border-gray-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-100 rounded-2xl outline-none transition-all text-lg font-medium placeholder:text-gray-300"
                        required
                        minLength={6}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                    <input
                        type="password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        placeholder="비밀번호 재입력"
                        className={`w-full px-6 py-4 bg-white border focus:ring-4 rounded-2xl outline-none transition-all text-lg font-medium placeholder:text-gray-300 ${passwordConfirm && password !== passwordConfirm ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-lime-500 focus:ring-lime-100'}`}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#84cc16] hover:bg-[#65a30d] active:scale-[0.98] text-white text-xl font-black py-5 rounded-2xl shadow-xl shadow-lime-200 transition-all mt-6"
                >
                    회원가입하기
                </button>

                <div className="relative my-6">
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
                    className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                    Google로 계속하기
                </button>
            </form>

            <div className="mt-10 text-center">
                <p className="text-gray-400 font-medium">
                    이미 계정이 있으신가요?{" "}
                    <Link href="/login" className="text-lime-600 font-black hover:underline block mt-2 text-xl">
                        로그인하기
                    </Link>
                </p>
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
