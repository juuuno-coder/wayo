"use client";

import Link from "next/link";
import { useState } from "react";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // TODO: 실제 백엔드 연동 시 로딩 상태 추가

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
            nickname: email.split('@')[0], // Default nickname from email
            signup_origin: window.location.hostname.includes('wayo') ? 'wayo' : 'gabojago'
          },
        }),
      });

      if (response.ok) {
        alert("회원가입이 완료되었습니다! 로그인해주세요.");
        router.push("/login"); // 로그인 페이지로 이동
      } else {
        const errorData = await response.json();
        alert("회원가입 실패: " + (errorData.message || "오류가 발생했습니다."));
        console.error("Signup Error:", errorData);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("서버와 연결할 수 없습니다.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 md:bg-white overflow-hidden">
      {/* Left Column: Brand Marketing (PC Only) */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-8">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            Wayo Join Portal
          </div>
          <h2 className="text-7xl font-black text-gray-900 leading-[1.1] mb-8 break-keep">
            지금 바로<br />
            가보자고<span className="text-blue-600">!</span><br />
            <span className="text-gray-400 text-3xl">함께하면 더욱 즐거운 여정이 시작됩니다.</span>
          </h2>

          <div className="mt-12 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600">✓</div>
              <p className="text-xl font-bold text-gray-700">모든 초대장을 한곳에 안전하게 보관</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600">✓</div>
              <p className="text-xl font-bold text-gray-700">실시간 RSVP 응답 알림 및 게스트 관리</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600">✓</div>
              <p className="text-xl font-bold text-gray-700">단 10초 만에 제작하는 고풍격 AI 초대장</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="flex-1 lg:max-w-[700px] flex items-center justify-center p-6 lg:p-12 relative overflow-y-auto bg-gray-50 md:bg-white">
        <div className="w-full max-w-[440px] lg:bg-white lg:p-2 lg:rounded-[3rem] lg:shadow-2xl">
          {/* Mobile Mockup Frame (PC Only) */}
          <div className="lg:border-[12px] lg:border-gray-900 lg:rounded-[2.5rem] bg-white px-6 py-12 lg:min-h-[850px] flex flex-col justify-center">
            {/* Header */}
            <header className="mb-8 lg:mb-12">
              <Link href="/login" className="inline-flex p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
                <MoveLeft size={24} />
              </Link>
            </header>

            {/* Title Section */}
            <div className="mb-10 lg:mb-12">
              <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
                환영합니다! 🎉
              </h1>
              <p className="text-gray-500 font-medium">
                이메일로 간편하게 가입하고 시작해보세요.
              </p>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-2xl outline-none transition-all duration-200 text-lg font-medium"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6자 이상 입력해주세요"
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-2xl outline-none transition-all duration-200 text-lg font-medium"
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Confirm Password</label>
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="비밀번호를 한번 더 입력해주세요"
                  className={`w-full px-6 py-4 bg-gray-50 border focus:bg-white focus:ring-4 rounded-2xl outline-none transition-all duration-200 text-lg font-medium ${passwordConfirm && password !== passwordConfirm
                    ? "border-red-500 focus:ring-red-500/10 focus:border-red-500"
                    : "border-transparent focus:border-blue-500 focus:ring-blue-500/10"
                    }`}
                  required
                />
                {passwordConfirm && password !== passwordConfirm && (
                  <p className="text-red-500 text-xs ml-2 font-bold">비밀번호가 일치하지 않습니다.</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#1e272e] hover:bg-black active:scale-[0.98] text-white text-xl font-black py-5 rounded-2xl shadow-2xl transition-all duration-200 mt-6"
              >
                Create Account
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-400 font-medium">
                이미 계정이 있으신가요?{" "}
                <Link href="/login" className="text-blue-600 font-black hover:underline block mt-2 text-xl">
                  로그인하기
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
