"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { X, Ticket, ArrowRight } from "lucide-react";

interface SignupPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    guestName?: string;
}

export default function SignupPromptModal({ isOpen, onClose, guestName }: SignupPromptModalProps) {
    const router = useRouter();

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
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100 z-10"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-100 rotate-3">
                                <Ticket size={32} />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {guestName ? `${guestName}님,` : "잠깐!"} <br />
                                티켓을 저장할까요?
                            </h3>

                            <p className="text-gray-500 mb-8 leading-relaxed text-sm">
                                회원가입 하시면 티켓을 안전하게 보관하고<br />입장 시 빠르게 꺼낼 수 있어요.
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push('/signup')}
                                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    3초 만에 가입하고 저장하기 <ArrowRight size={16} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold rounded-xl active:scale-[0.98] transition-all text-sm"
                                >
                                    괜찮아요, 나중에 할게요
                                </button>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 text-center">
                            <p className="text-[10px] text-gray-400">
                                * 가입 시 카카오톡으로도 티켓을 받아볼 수 있습니다.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
