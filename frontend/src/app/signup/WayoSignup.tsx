"use client";

import Link from "next/link";
import { useState } from "react";
import { MoveLeft, Sparkles, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WayoSignup() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

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
                        signup_origin: 'wayo'
                    },
                }),
            });

            if (response.ok) {
                alert("와요! 환영합니다. 이제 로그인해주세요.");
                router.push("/login");
            } else {
                const errorData = await response.json();
                alert("회원가입 실패: " + (errorData.message || "오류가 발생했습니다."));
            }
        } catch (error) {
            console.error(error);
            alert("서버와 연결할 수 없습니다.");
        }
    };

    return (
        <div className="p-8 pb-20">
            <header className="mb-6 flex justify-between items-center">
                <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
                    <MoveLeft size={24} />
                </button>
                <div className="px-3 py-1 bg-red-50 text-red-500 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <Sparkles size={12} /> Wayo
                </div>
            </header>

            <div className="text-center mb-10">
                <h1 className="text-5xl font-black text-[#E02424] tracking-tighter mb-4">WAYO</h1>
                <p className="text-gray-400 font-medium leading-relaxed text-sm">
                    당신만의 특별한 초대장이<br />
                    공간으로 <span className="text-gray-800 font-bold underline decoration-red-200 decoration-4">지금 바로 와요 💌</span>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="space-y-1">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="이메일 주소"
                        className="w-full px-5 py-4 bg-white border border-gray-200 focus:border-[#E02424] focus:ring-4 focus:ring-red-50 rounded-2xl outline-none transition-all text-base font-medium placeholder:text-gray-300"
                        required
                    />
                </div>

                <div className="space-y-1">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호 (6자 이상)"
                        className="w-full px-5 py-4 bg-white border border-gray-200 focus:border-[#E02424] focus:ring-4 focus:ring-red-50 rounded-2xl outline-none transition-all text-base font-medium placeholder:text-gray-300"
                        required
                        minLength={6}
                    />
                </div>

                <div className="space-y-1">
                    <input
                        type="password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        placeholder="비밀번호 다시 입력"
                        className={`w-full px-5 py-4 bg-white border focus:ring-4 rounded-2xl outline-none transition-all text-base font-medium placeholder:text-gray-300 ${passwordConfirm && password !== passwordConfirm ? 'border-red-400 focus:ring-red-50' : 'border-gray-200 focus:border-[#E02424] focus:ring-red-50'}`}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#E02424] hover:bg-[#C81E1E] active:scale-[0.98] text-white text-lg font-black py-4.5 rounded-2xl shadow-xl shadow-red-200 transition-all mt-4"
                >
                    초대장 시작하기
                </button>
            </form>

            <div className="mt-8 text-center">
                <Link href="/login" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold text-sm transition-all active:scale-95">
                    이미 계정이 있으신가요? <span className="text-[#E02424]">로그인</span>
                </Link>
            </div>

            {/* Trust Badge */}
            <div className="mt-10 p-4 bg-gray-50 rounded-2xl flex items-center gap-3 border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-red-500">
                    <Heart size={18} className="fill-current" />
                </div>
                <p className="text-[10px] text-gray-400 leading-tight">
                    이미 <span className="text-gray-700 font-bold">10,000+</span> 명의 호스트가<br />
                    와요를 통해 초대장을 보냈습니다.
                </p>
            </div>
        </div>
    );
}
