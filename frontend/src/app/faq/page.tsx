"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Black_Han_Sans, Inter } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { API_BASE_URL } from "@/config";

const blackHanSans = Black_Han_Sans({ weight: "400", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

interface Faq {
    id: number;
    question: string;
    answer: string;
    position: number;
}

export default function FAQPage() {
    const router = useRouter();
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/faqs`);
            if (res.ok) {
                const data = await res.json();
                setFaqs(data);
            }
        } catch (error) {
            console.error("Failed to fetch FAQs:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFaq = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className={`min-h-screen bg-[#FDFBF7] ${inter.className}`}>
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-white/30 border-b border-[#5D4037]/5">
                <Link href="/" className={`text-2xl text-[#E74C3C] tracking-tighter ${blackHanSans.className}`}>
                    WAYO
                </Link>
                <div className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-widest opacity-60">
                    <Link href="/features" className="hover:text-[#E74C3C] transition-colors">Features</Link>
                    <Link href="/invitations/manage" className="hover:text-[#E74C3C] transition-colors">My Invitations</Link>
                    <Link href="/faq" className="text-[#E74C3C] transition-colors">FAQ</Link>
                </div>
                <button
                    onClick={() => router.push('/invitations/create')}
                    className="px-6 py-2 bg-[#E74C3C] text-white rounded-full text-sm font-bold hover:bg-[#C0392B] transition-all active:scale-95 shadow-lg shadow-red-200"
                >
                    초대장 만들기
                </button>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-12 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-blue-200"
                    >
                        <HelpCircle size={40} />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`text-6xl md:text-8xl text-[#E74C3C] mb-6 tracking-tighter leading-none ${blackHanSans.className}`}
                    >
                        FAQ
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-600 leading-relaxed"
                    >
                        자주 묻는 질문들을 모았습니다.<br />
                        궁금한 점이 있으시면 먼저 확인해보세요.
                    </motion.p>
                </div>
            </section>

            {/* FAQ List */}
            <section className="pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="w-12 h-12 border-4 border-[#E74C3C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-400">FAQ를 불러오는 중...</p>
                        </div>
                    ) : faqs.length === 0 ? (
                        <div className="text-center py-20">
                            <HelpCircle size={48} className="mx-auto mb-4 text-gray-300" />
                            <p className="text-gray-400">FAQ가 아직 없습니다.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={faq.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:border-[#E74C3C]/30 transition-all"
                                >
                                    <button
                                        onClick={() => toggleFaq(faq.id)}
                                        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-8 h-8 rounded-full bg-[#E74C3C]/10 flex items-center justify-center text-[#E74C3C] font-bold text-sm flex-shrink-0 mt-1">
                                                Q
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 leading-relaxed">
                                                {faq.question}
                                            </h3>
                                        </div>
                                        <div className="ml-4 flex-shrink-0">
                                            {expandedId === faq.id ? (
                                                <ChevronUp size={24} className="text-[#E74C3C]" />
                                            ) : (
                                                <ChevronDown size={24} className="text-gray-400" />
                                            )}
                                        </div>
                                    </button>
                                    <AnimatePresence>
                                        {expandedId === faq.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-6 pb-6 pt-2">
                                                    <div className="flex items-start gap-4 pl-12">
                                                        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                                            {faq.answer}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white border-t border-gray-100">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        여전히 궁금한 점이 있으신가요?
                    </h2>
                    <p className="text-gray-600 mb-8">
                        언제든지 문의해주세요. 최대한 빠르게 답변드리겠습니다.
                    </p>
                    <a
                        href="mailto:support@wayo.co.kr"
                        className="inline-block px-8 py-4 bg-[#E74C3C] text-white rounded-2xl font-bold hover:bg-[#C0392B] transition-colors shadow-lg shadow-red-200"
                    >
                        문의하기
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 text-center border-t border-gray-100">
                <div className={`text-3xl text-[#E74C3C] tracking-tighter mb-6 ${blackHanSans.className}`}>WAYO</div>
                <p className="text-xs text-gray-400">© 2026 WAYO Invitation Service. All rights reserved.</p>
            </footer>
        </div>
    );
}
