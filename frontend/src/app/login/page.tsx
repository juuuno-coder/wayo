"use client";

import Link from "next/link";
import { useState } from "react";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // TODO: 실제 백엔드 연동 시 로딩 상태 추가
  const router = useRouter(); // useRouter import 필요

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any previous session data before attempting login
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("pending_invitations");
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("wayo_guest_")) {
        localStorage.removeItem(key);
      }
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/users/sign_in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            email: email,
            password: password,
          },
        }),
      });

      if (response.ok) {
        // JWT 토큰 저장 (Authorization 헤더)
        const token = response.headers.get("Authorization");
        if (token) {
          localStorage.setItem("authToken", token);
        }

        // 사용자 정보 저장
        const data = await response.json();
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userId", String(data.user.id));

        alert("로그인되었습니다.");
        router.push("/");
      } else {
        alert("이메일 또는 비밀번호를 확인해주세요.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("서버와 연결할 수 없습니다.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white px-6 pt-12 pb-8">
      {/* 뒤로가기 헤더 */}
      <header className="mb-10">
        <Link href="/" className="inline-flex p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
          <MoveLeft size={24} />
        </Link>
      </header>

      {/* 타이틀 섹션 */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          다시 만나서 반가워요! 👋
        </h1>
        <p className="text-gray-500">
          서비스 이용을 위해 로그인해주세요.
        </p>
      </div>

      {/* 로그인 폼 */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700 ml-1">이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            className="w-full px-4 py-3.5 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-2xl outline-none transition-all duration-200"
            required
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center ml-1">
            <label className="text-sm font-semibold text-gray-700">비밀번호</label>
            <button type="button" className="text-xs text-blue-600 font-medium hover:underline">
              비밀번호 찾기
            </button>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3.5 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-2xl outline-none transition-all duration-200"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-lg font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all duration-200 mt-4"
        >
          로그인하기
        </button>
      </form>

      {/* 구분선 */}
      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-400 font-medium">또는 소셜 계정으로 시작</span>
        </div>
      </div>

      {/* 소셜 로그인 버튼 */}
      <div className="grid grid-cols-2 gap-3 mb-auto">
        <button className="flex items-center justify-center gap-2 py-3.5 px-4 bg-[#FEE500] hover:bg-[#FDD835] text-[#3c1e1e] font-semibold rounded-xl transition-colors">
          <div className="w-5 h-5 rounded-full bg-[#3c1e1e] flex items-center justify-center text-[10px] text-[#FEE500] font-bold">N</div>
          카카오로 시작
        </button>
        <button className="flex items-center justify-center gap-2 py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors border border-gray-200">
          {/* Google Icon SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12.61C5,8.85 8.38,5.78 12.23,5.78C14.61,5.78 16.28,6.59 17.15,7.45L19.16,5.43C17.6,3.96 15.17,3 12.23,3C6.73,3 2.03,7.69 2.03,13.39C2.03,19.1 6.73,23.6 12.23,23.6C17.87,23.6 21.64,19.66 21.64,13.91C21.64,12.91 21.56,12.08 21.35,11.1Z"
            />
          </svg>
          Google
        </button>
      </div>

      {/* 회원가입 링크 */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          아직 계정이 없으신가요?{" "}
          <Link href="/signup" className="text-blue-600 font-bold hover:underline">
            이메일로 가입하기
          </Link>
        </p>
      </div>
    </div>
  );
}
