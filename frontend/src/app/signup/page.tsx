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
    <div className="flex flex-col min-h-screen bg-white px-6 pt-12 pb-8">
      {/* 뒤로가기 헤더 */}
      <header className="mb-8">
        <Link href="/login" className="inline-flex p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
          <MoveLeft size={24} />
        </Link>
      </header>

      {/* 타이틀 섹션 */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          환영합니다! 🎉
        </h1>
        <p className="text-gray-500">
          이메일로 간편하게 가입하고 시작해보세요.
        </p>
      </div>

      {/* 회원가입 폼 */}
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
          <label className="text-sm font-semibold text-gray-700 ml-1">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6자 이상 입력해주세요"
            className="w-full px-4 py-3.5 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-2xl outline-none transition-all duration-200"
            required
            minLength={6}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700 ml-1">비밀번호 확인</label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="비밀번호를 한번 더 입력해주세요"
            className={`w-full px-4 py-3.5 bg-gray-50 border focus:bg-white focus:ring-4 rounded-2xl outline-none transition-all duration-200 ${passwordConfirm && password !== passwordConfirm
                ? "border-red-500 focus:ring-red-500/10 focus:border-red-500"
                : "border-transparent focus:border-blue-500 focus:ring-blue-500/10"
              }`}
            required
          />
          {passwordConfirm && password !== passwordConfirm && (
            <p className="text-red-500 text-xs ml-1">비밀번호가 일치하지 않습니다.</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-lg font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all duration-200 mt-6"
        >
          가입 완료하기
        </button>
      </form>
    </div>
  );
}
