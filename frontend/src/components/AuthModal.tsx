"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { X, LogIn, Lock } from "lucide-react";
import { useEffect, useState } from "react";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    redirectUrl?: string;
}

export default function AuthModal({
    isOpen,
    onClose,
    title = "로그인이 필요합니다",
    message = "이 서비스는 회원전용입니다.\n지금 로그인하고 더 많은 기능을 이용해보세요.",
    redirectUrl = "/login"
}: AuthModalProps) {
    const router = useRouter();
    const [isWayoDomain, setIsWayoDomain] = useState(false);

    useEffect(() => {
        setIsWayoDomain(window.location.hostname.includes("wayo") && !window.location.hostname.includes("gabojago"));
    }, []);

    const handleLogin = () => {
        router.push(redirectUrl);
        onClose();
    };

    const theme = isWayoDomain ? {
        primary: "bg-[#E02424]",
        accent: "text-[#E02424]",
        bg: "bg-[#FDF2F2]",
        shadow: "shadow-red-50",
        hover: "hover:bg-[#C81E1E]"
    } : {
        primary: "bg-[#84cc16]",
        accent: "text-[#65a30d]",
        bg: "bg-[#f7fee7]",
        shadow: "shadow-lime-50",
        hover: "hover:bg-[#65a30d]"
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100 z-10"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-8 text-center pt-10">
                            <div className={`w-16 h-16 ${theme.bg} ${theme.accent} rounded-[22px] flex items-center justify-center mx-auto mb-6 shadow-xl ${theme.shadow} relative overflow-hidden group`}>
                                <div className={`absolute inset-0 ${theme.primary} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                                <Lock size={30} className="relative z-10" />
                            </div>

                            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
                                {title}
                            </h3>

                            <p className="text-gray-500 mb-8 leading-relaxed text-sm font-medium whitespace-pre-wrap px-2">
                                {message}
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={handleLogin}
                                    className={`w-full py-4 ${theme.primary} ${theme.hover} text-white font-bold rounded-2xl shadow-xl ${theme.shadow} active:scale-[0.98] transition-all flex items-center justify-center gap-2 group`}
                                >
                                    <span>로그인하러 가기</span>
                                    <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold rounded-2xl active:scale-[0.98] transition-all text-sm"
                                >
                                    닫기
                                </button>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                {isWayoDomain ? "Premium Invitation Service" : "Event Listing Platform"}
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
