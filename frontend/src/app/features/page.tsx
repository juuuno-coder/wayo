"use client";

import { useRouter } from "next/navigation";
import {
    Sparkles,
    Zap,
    Users,
    Palette,
    Share2,
    Bell,
    Calendar,
    MessageSquare,
    Download,
    Shield,
    Smartphone,
    Globe
} from "lucide-react";
import { Black_Han_Sans, Inter } from "next/font/google";
import { motion } from "framer-motion";
import WayoHeader from "@/components/WayoHeader";

const blackHanSans = Black_Han_Sans({ weight: "400", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

export default function FeaturesPage() {
    const router = useRouter();

    const features = [
        {
            icon: <Zap size={32} />,
            title: "빠른 제작",
            description: "몇 분 만에 전문가 수준의 초대장을 만들 수 있습니다. 복잡한 디자인 도구 없이 간단한 입력만으로 완성됩니다.",
            color: "from-yellow-500 to-orange-600"
        },
        {
            icon: <Palette size={32} />,
            title: "다양한 테마",
            description: "클래식부터 모던까지, 6가지 프리미엄 테마와 커스텀 색상 옵션으로 당신만의 스타일을 표현하세요.",
            color: "from-purple-500 to-pink-600"
        },
        {
            icon: <Users size={32} />,
            title: "참석 관리",
            description: "실시간 참석 확인, 게스트 메시지 수집, 엑셀 다운로드까지. 모든 참석자 정보를 한눈에 관리하세요.",
            color: "from-blue-500 to-cyan-600"
        },
        {
            icon: <Share2 size={32} />,
            title: "간편한 공유",
            description: "카카오톡, 문자, 이메일 등 다양한 채널로 초대장을 즉시 공유할 수 있습니다. 링크 하나로 모든 것이 해결됩니다.",
            color: "from-green-500 to-emerald-600"
        },
        {
            icon: <Calendar size={32} />,
            title: "일정 & 지도",
            description: "행사 일정, 장소, 지도 정보를 한 곳에. 게스트들이 길을 잃을 일이 없습니다.",
            color: "from-red-500 to-rose-600"
        },
        {
            icon: <MessageSquare size={32} />,
            title: "축하 메시지",
            description: "참석자들의 따뜻한 축하 메시지를 받아보세요. 소중한 추억이 됩니다.",
            color: "from-indigo-500 to-purple-600"
        },
        {
            icon: <Smartphone size={32} />,
            title: "모바일 최적화",
            description: "PC, 태블릿, 스마트폰 어디서나 완벽하게 작동합니다. 반응형 디자인으로 모든 기기에서 아름답게 표시됩니다.",
            color: "from-teal-500 to-cyan-600"
        },
        {
            icon: <Bell size={32} />,
            title: "실시간 알림",
            description: "새로운 참석 확인이나 메시지가 도착하면 즉시 알려드립니다. 놓치는 일이 없습니다.",
            color: "from-orange-500 to-red-600"
        },
        {
            icon: <Download size={32} />,
            title: "데이터 내보내기",
            description: "참석자 명단을 엑셀로 다운로드하여 오프라인에서도 관리할 수 있습니다.",
            color: "from-green-600 to-teal-600"
        },
        {
            icon: <Shield size={32} />,
            title: "안전한 보관",
            description: "모든 초대장과 데이터는 안전하게 클라우드에 저장됩니다. 언제든지 다시 확인하고 수정할 수 있습니다.",
            color: "from-gray-600 to-slate-700"
        },
        {
            icon: <Globe size={32} />,
            title: "무료 사용",
            description: "핵심 기능은 모두 무료입니다. 초대장 생성, 공유, 관리 모두 제한 없이 사용하세요.",
            color: "from-blue-600 to-indigo-600"
        },
        {
            icon: <Sparkles size={32} />,
            title: "블록 에디터",
            description: "드래그 앤 드롭으로 초대장을 자유롭게 구성하세요. 이미지, 동영상, 지도 등 다양한 블록을 추가할 수 있습니다.",
            color: "from-pink-500 to-rose-600"
        }
    ];

    return (
        <div className={`min-h-screen bg-[#FDFBF7] ${inter.className}`}>
            {/* Navigation */}
            <WayoHeader currentPage="features" />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-100 text-[#E74C3C] rounded-full text-xs font-black uppercase tracking-widest mb-6"
                    >
                        <Sparkles size={14} /> Premium Features
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`text-6xl md:text-8xl text-[#E74C3C] mb-6 tracking-tighter leading-none ${blackHanSans.className}`}
                    >
                        FEATURES
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
                    >
                        WAYO가 제공하는 강력하고 직관적인 기능들로<br />
                        <span className="font-bold text-[#E74C3C]">완벽한 초대장</span>을 만들어보세요
                    </motion.p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                viewport={{ once: true }}
                                className="bg-white p-8 rounded-3xl border border-gray-100 hover:border-[#E74C3C]/20 hover:shadow-2xl hover:shadow-red-100 transition-all duration-300 group"
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-gradient-to-br from-[#E74C3C] to-[#C0392B] text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className={`text-5xl md:text-6xl mb-6 ${blackHanSans.className}`}>
                        지금 바로 시작하세요
                    </h2>
                    <p className="text-xl mb-10 opacity-90">
                        모든 기능을 무료로 사용할 수 있습니다. 신용카드 필요 없습니다.
                    </p>
                    <button
                        onClick={() => router.push('/invitations/create')}
                        className="px-12 py-5 bg-white text-[#E74C3C] rounded-2xl text-xl font-bold hover:scale-105 transition-transform shadow-2xl"
                    >
                        무료로 초대장 만들기
                    </button>
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
