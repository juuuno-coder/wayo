"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bug, Lightbulb, Coffee, Send, Heart, CheckCircle2 } from "lucide-react";
import { Black_Han_Sans, Inter } from "next/font/google";
import { motion } from "framer-motion";
import WayoHeader from "@/components/WayoHeader";

const blackHanSans = Black_Han_Sans({ weight: "400", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

export default function SupportPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'bug' | 'idea' | 'donate'>('bug');
    const [bugForm, setBugForm] = useState({ title: "", description: "", email: "" });
    const [ideaForm, setIdeaForm] = useState({ title: "", description: "", email: "" });
    const [submitted, setSubmitted] = useState(false);

    const handleBugSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: 백엔드 API 연결
        console.log("Bug Report:", bugForm);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setBugForm({ title: "", description: "", email: "" });
        }, 3000);
    };

    const handleIdeaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: 백엔드 API 연결
        console.log("Idea Submission:", ideaForm);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setIdeaForm({ title: "", description: "", email: "" });
        }, 3000);
    };

    return (
        <div className={`min-h-screen bg-[#FDFBF7] ${inter.className}`}>
            <WayoHeader currentPage="support" />

            {/* Hero Section */}
            <section className="pt-32 pb-12 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-purple-200"
                    >
                        <Heart size={40} />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`text-6xl md:text-8xl text-[#E74C3C] mb-6 tracking-tighter leading-none ${blackHanSans.className}`}
                    >
                        고객지원 센터
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-600 leading-relaxed"
                    >
                        더 나은 WAYO를 위해 여러분의 목소리를 들려주세요
                    </motion.p>
                </div>
            </section>

            {/* Tab Navigation */}
            <section className="pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                        <button
                            onClick={() => setActiveTab('bug')}
                            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all whitespace-nowrap ${activeTab === 'bug'
                                    ? 'bg-red-500 text-white shadow-lg shadow-red-200'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                                }`}
                        >
                            <Bug size={20} />
                            오류 제보하기
                        </button>
                        <button
                            onClick={() => setActiveTab('idea')}
                            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all whitespace-nowrap ${activeTab === 'idea'
                                    ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-200'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                                }`}
                        >
                            <Lightbulb size={20} />
                            아이디어 제안
                        </button>
                        <button
                            onClick={() => setActiveTab('donate')}
                            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all whitespace-nowrap ${activeTab === 'donate'
                                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-200'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                                }`}
                        >
                            <Coffee size={20} />
                            개발자 후원하기
                        </button>
                    </div>

                    {/* Bug Report Form */}
                    {activeTab === 'bug' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                                    <Bug size={24} className="text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">오류 제보하기</h2>
                                    <p className="text-gray-500 text-sm">발견하신 버그나 오류를 알려주세요</p>
                                </div>
                            </div>

                            {submitted ? (
                                <div className="py-12 text-center">
                                    <CheckCircle2 size={64} className="mx-auto mb-4 text-green-500" />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">제보해 주셔서 감사합니다!</h3>
                                    <p className="text-gray-600">빠른 시일 내에 확인하고 개선하겠습니다.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleBugSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">제목</label>
                                        <input
                                            type="text"
                                            value={bugForm.title}
                                            onChange={(e) => setBugForm({ ...bugForm, title: e.target.value })}
                                            placeholder="오류를 간단히 설명해주세요"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">상세 설명</label>
                                        <textarea
                                            value={bugForm.description}
                                            onChange={(e) => setBugForm({ ...bugForm, description: e.target.value })}
                                            placeholder="어떤 상황에서 오류가 발생했나요? 재현 방법을 자세히 알려주세요."
                                            rows={6}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">이메일 (선택)</label>
                                        <input
                                            type="email"
                                            value={bugForm.email}
                                            onChange={(e) => setBugForm({ ...bugForm, email: e.target.value })}
                                            placeholder="답변을 받으실 이메일 주소"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-200"
                                    >
                                        <Send size={20} />
                                        제보하기
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    )}

                    {/* Idea Submission Form */}
                    {activeTab === 'idea' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                                    <Lightbulb size={24} className="text-yellow-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">아이디어 제안</h2>
                                    <p className="text-gray-500 text-sm">새로운 기능이나 개선 아이디어를 공유해주세요</p>
                                </div>
                            </div>

                            {submitted ? (
                                <div className="py-12 text-center">
                                    <CheckCircle2 size={64} className="mx-auto mb-4 text-green-500" />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">소중한 의견 감사합니다!</h3>
                                    <p className="text-gray-600">제안해 주신 아이디어를 검토하여 반영하겠습니다.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleIdeaSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">제목</label>
                                        <input
                                            type="text"
                                            value={ideaForm.title}
                                            onChange={(e) => setIdeaForm({ ...ideaForm, title: e.target.value })}
                                            placeholder="아이디어를 한 줄로 요약해주세요"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">상세 설명</label>
                                        <textarea
                                            value={ideaForm.description}
                                            onChange={(e) => setIdeaForm({ ...ideaForm, description: e.target.value })}
                                            placeholder="어떤 기능이 추가되면 좋을까요? 왜 필요한지 자세히 설명해주세요."
                                            rows={6}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">이메일 (선택)</label>
                                        <input
                                            type="email"
                                            value={ideaForm.email}
                                            onChange={(e) => setIdeaForm({ ...ideaForm, email: e.target.value })}
                                            placeholder="답변을 받으실 이메일 주소"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-yellow-500 text-white rounded-xl font-bold hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-yellow-200"
                                    >
                                        <Send size={20} />
                                        제안하기
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    )}

                    {/* Donation Links */}
                    {activeTab === 'donate' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
                                <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Heart size={32} className="text-pink-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">개발자 후원하기</h2>
                                <p className="text-gray-600 mb-8">
                                    WAYO를 만들고 운영하는 개발자에게 커피 한 잔의 응원을 보내주세요!<br />
                                    여러분의 후원이 더 나은 서비스를 만드는 큰 힘이 됩니다.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <a
                                        href="https://www.buymeacoffee.com/bababapet"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all"
                                    >
                                        <Coffee size={24} />
                                        Buy Me a Coffee
                                    </a>
                                    <a
                                        href="https://www.buymeacoffee.com/bababapet"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all"
                                    >
                                        <Heart size={24} />
                                        후원하기
                                    </a>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">후원금은 이렇게 사용됩니다</h3>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 size={20} className="text-purple-600 flex-shrink-0 mt-0.5" />
                                        <span>서버 운영 및 유지보수 비용</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 size={20} className="text-purple-600 flex-shrink-0 mt-0.5" />
                                        <span>새로운 기능 개발 및 디자인 개선</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 size={20} className="text-purple-600 flex-shrink-0 mt-0.5" />
                                        <span>더 나은 사용자 경험을 위한 연구 개발</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 size={20} className="text-purple-600 flex-shrink-0 mt-0.5" />
                                        <span>개발자의 커피와 야식 (가장 중요!)</span>
                                    </li>
                                </ul>
                            </div>
                        </motion.div>
                    )}
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
