"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, ArrowRight, User } from "lucide-react";
import { motion } from "framer-motion";

export default function NicknameOnboardingPage() {
    const [nickname, setNickname] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user, updateNickname, isLoggedIn, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If user already has a nickname, redirect away
        if (!isLoading && isLoggedIn && user?.nickname) {
            router.push("/");
        }
        // If not logged in, should go to login (LayoutClient handles this usually, but safe to check)
        if (!isLoading && !isLoggedIn) {
            router.push("/login");
        }
    }, [isLoading, isLoggedIn, user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nickname.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await updateNickname(nickname.trim());
            router.push("/");
        } catch (error) {
            alert("닉네설정에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return null;

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-xl border border-red-50 relative overflow-hidden"
            >
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-50 rounded-full blur-3xl -ml-16 -mb-16 opacity-50" />

                <div className="relative z-10">
                    <div className="w-16 h-16 bg-[#E74C3C] rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-red-200">
                        <Sparkles size={32} />
                    </div>

                    <h1 className="text-3xl font-black text-gray-900 mb-2 leading-tight">
                        거의 다 왔어요!<br />
                        <span className="text-[#E74C3C]">어떻게 불러드릴까요?</span>
                    </h1>
                    <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                        초대장을 보낼 때나 프로필에 표시될<br />
                        당신만의 멋진 닉네임을 설정해주세요.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E74C3C] transition-colors">
                                <User size={24} />
                            </div>
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="멋진 닉네임을 입력하세요"
                                className="w-full pl-14 pr-4 py-5 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-xl text-gray-900 placeholder-gray-300 focus:ring-4 focus:ring-red-100 focus:border-[#E74C3C] focus:bg-white transition-all outline-none"
                                maxLength={20}
                                required
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!nickname.trim() || isSubmitting}
                            className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl ${nickname.trim() && !isSubmitting
                                    ? "bg-[#E74C3C] text-white hover:bg-[#C0392B] active:scale-[0.98]"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            {isSubmitting ? (
                                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    가보자고! <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>

            <p className="mt-8 text-gray-400 text-sm font-bold tracking-widest uppercase">
                Step into your own space
            </p>
        </div>
    );
}
