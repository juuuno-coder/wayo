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

        // [New] Sync Pending Invitations
        const pendingInvitations = localStorage.getItem("pending_invitations");
        if (pendingInvitations) {
          try {
            const parsedInvitations = JSON.parse(pendingInvitations);
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/invitations/sync`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": token || "",
              },
              body: JSON.stringify({ invitations: parsedInvitations }),
            });
            localStorage.removeItem("pending_invitations"); // Clear on success
          } catch (syncError) {
            console.error("Sync Error:", syncError);
            // Optionally alert user or keep pending storage for retry
          }
        }

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
            Wayo Official Portal
          </div>
          <h2 className="text-7xl font-black text-gray-900 leading-[1.1] mb-8 break-keep">
            가보자고<span className="text-blue-600">!</span><br />
            <span className="text-gray-400">전국의 모든 이벤트를</span><br />
            한눈에 모아보는 플랫폼
          </h2>

          <div className="relative mb-12 group">
            <input
              disabled
              type="text"
              placeholder="어떤 이벤트를 찾으시나요?"
              className="w-full bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-3xl py-6 px-8 text-xl outline-none"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 px-8 py-3 bg-[#009432] text-white rounded-2xl font-bold">검색</button>
          </div>

          <div className="flex gap-4">
            {['#축제', '#전시회', '#공모전', '#박람회', '#서울', '#부산'].map(tag => (
              <span key={tag} className="px-5 py-2.5 bg-white border border-gray-100 rounded-full text-sm font-bold text-gray-400">{tag}</span>
            ))}
          </div>

          <div className="mt-20 flex gap-12">
            <div>
              <p className="text-4xl font-black text-gray-900">1,200+</p>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Events</p>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div>
              <p className="text-4xl font-black text-gray-900">50K+</p>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Visitors</p>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div>
              <p className="text-4xl font-black text-gray-900">4.8<span className="text-yellow-400 text-3xl">★</span></p>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="flex-1 lg:max-w-[700px] flex items-center justify-center p-6 lg:p-12 relative overflow-y-auto bg-gray-50 md:bg-white">
        <div className="w-full max-w-[440px] lg:bg-white lg:p-2 lg:rounded-[3rem] lg:shadow-2xl">
          {/* Mobile Mockup Frame (PC Only) */}
          <div className="lg:border-[12px] lg:border-gray-900 lg:rounded-[2.5rem] bg-white px-6 py-12 lg:min-h-[800px] flex flex-col justify-center">
            {/* Header */}
            <header className="mb-8 lg:mb-12">
              <Link href="/" className="inline-flex p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
                <MoveLeft size={24} />
              </Link>
            </header>

            {/* Title Section */}
            <div className="mb-10 lg:mb-14">
              <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
                다시 만나서 반가워요! 👋
              </h1>
              <p className="text-gray-500 font-medium">
                서비스 이용을 위해 로그인해주세요.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full px-6 py-4.5 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-2xl outline-none transition-all duration-200 text-lg font-medium"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Password</label>
                  <button type="button" className="text-xs text-blue-600 font-bold hover:underline">
                    Forgot?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-6 py-4.5 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-2xl outline-none transition-all duration-200 text-lg font-medium"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1e272e] hover:bg-black active:scale-[0.98] text-white text-xl font-black py-5 rounded-2xl shadow-2xl transition-all duration-200 mt-4"
              >
                Login to Portal
              </button>
            </form>

            {/* Links */}
            <div className="mt-12 text-center">
              <p className="text-gray-400 font-medium">
                아직 계정이 없으신가요?{" "}
                <Link href="/signup" className="text-blue-600 font-black hover:underline block mt-2 text-xl">
                  이메일로 가입하기
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
