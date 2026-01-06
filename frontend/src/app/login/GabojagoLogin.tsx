"use client";

import Link from "next/link";
import { useState } from "react";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GabojagoLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

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
        <div className="p-8 pb-24">
            {/* Header */}
            <header className="mb-10 lg:mb-14">
                <Link href="/" className="inline-flex p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
                    <MoveLeft size={24} />
                </Link>
            </header>

            {/* Title Section */}
            <div className="mb-12">
                <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight leading-tight">
                    다시 만나서 반가워요! <br />
                    가보자고! 👋
                </h1>
                <p className="text-gray-500 font-medium">
                    서비스 이용을 위해 로그인해주세요.
                </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="w-full px-6 py-4 bg-white border border-gray-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-50 rounded-2xl outline-none transition-all text-lg font-medium placeholder:text-gray-300"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Password</label>
                    </div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-6 py-4 bg-white border border-gray-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-50 rounded-2xl outline-none transition-all text-lg font-medium placeholder:text-gray-300"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#84cc16] hover:bg-[#65a30d] active:scale-[0.98] text-white text-xl font-black py-5 rounded-2xl shadow-xl shadow-lime-200 transition-all mt-4"
                >
                    로그인하기
                </button>
            </form>

            <div className="mt-12 text-center">
                <p className="text-gray-400 font-medium">
                    아직 계정이 없으신가요?{" "}
                    <Link href="/signup" className="text-lime-600 font-black hover:underline block mt-2 text-xl">
                        이메일로 가입하기
                    </Link>
                </p>
            </div>
        </div>
    );
}
