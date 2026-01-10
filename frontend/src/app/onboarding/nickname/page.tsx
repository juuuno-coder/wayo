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
        <div className="min-h-screen bg-[#FDFBF7] flex overflow-hidden">
            {/* Left Decor Section (Desktop) */}
            <div className="hidden lg:flex flex-1 bg-white items-center justify-center p-20 relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none select-none">
                    <div className="absolute top-10 left-10 text-[10rem] font-black leading-none uppercase">Wayo</div>
                    <div className="absolute bottom-10 right-10 text-[10rem] font-black leading-none uppercase">Space</div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="w-32 h-32 bg-red-50 rounded-[2.5rem] flex items-center justify-center text-[#E74C3C] mb-12 shadow-2xl shadow-red-100/50"
                    >
                        <Sparkles size={64} className="drop-shadow-sm" />
                    </motion.div>
                    <h2 className="text-6xl font-black text-gray-900 leading-[1.1] mb-8">
                        당신의 모든 순간을 <br />
                        <span className="text-[#E74C3C]">특별하게 바꾸는 공간</span>
                    </h2>
                    <p className="text-xl text-gray-400 font-medium leading-relaxed">
                        이제 당신의 멋진 초대장을 만들 차례입니다. <br />
                        가장 먼저 당신을 부를 이름을 알려주세요.
                    </p>
                </div>
            </div>

            {/* Right Form Section */}
            <div className="w-full lg:w-[600px] flex flex-col items-center justify-center p-8 bg-[#FDFBF7] lg:bg-white lg:border-l border-gray-100 shadow-2xl z-10">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-sm"
                >
                    <div className="lg:hidden mb-12">
                        <div className="w-16 h-16 bg-[#E74C3C] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200">
                            <Sparkles size={32} />
                        </div>
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 leading-tight">
                        거의 다 왔어요!<br />
                        <span className="text-[#E74C3C]">어떻게 불러드릴까요?</span>
                    </h1>
                    <p className="text-gray-500 font-medium mb-12 leading-relaxed text-lg">
                        초대장을 보낼 때나 프로필에 표시될<br />
                        당신만의 멋진 닉네임을 설정해주세요.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E74C3C] transition-colors">
                                <User size={28} />
                            </div>
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="멋진 닉네임을 입력하세요"
                                className="w-full pl-16 pr-6 py-6 bg-gray-50 lg:bg-white border-2 border-transparent focus:border-[#E74C3C] lg:border-gray-100 rounded-3xl font-bold text-2xl text-gray-900 placeholder-gray-300 focus:ring-8 focus:ring-red-100 transition-all outline-none"
                                maxLength={20}
                                required
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!nickname.trim() || isSubmitting}
                            className={`w-full py-6 rounded-3xl font-black text-xl transition-all flex items-center justify-center gap-3 shadow-2xl ${nickname.trim() && !isSubmitting
                                ? "bg-[#E74C3C] text-white hover:bg-[#C0392B] active:scale-[0.98] shadow-red-200"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                                }`}
                        >
                            {isSubmitting ? (
                                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    내 공간으로 가보자고! <ArrowRight size={24} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-12 text-gray-300 text-xs font-bold tracking-[0.3em] uppercase text-center lg:text-left">
                        Personalize your experience
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
