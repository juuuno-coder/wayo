"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Users, Send, BarChart3, CheckCircle2, MessageSquare, Calendar, MapPin, Sparkles, LayoutDashboard } from "lucide-react";
import { Black_Han_Sans, Inter } from "next/font/google";
import { motion } from "framer-motion";
import WayoHeader from "@/components/WayoHeader";

const blackHanSans = Black_Han_Sans({ weight: "400", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

export default function HowItWorksPage() {
    const router = useRouter();

    return (
        <div className={`min-h-screen bg-[#FDFBF7] ${inter.className}`}>
            <WayoHeader />

            {/* Hero Section */}
            <section className="pt-32 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-6"
                    >
                        System Architecture
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`text-5xl md:text-7xl text-[#E74C3C] mb-6 tracking-tighter leading-none ${blackHanSans.className}`}
                    >
                        WAYO는<br />이렇게 동작합니다
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto"
                    >
                        초대장 생성부터 참석 확인까지,<br />
                        전체 프로세스를 한눈에 이해하세요
                    </motion.p>
                </div>
            </section>

            {/* Flow 1: 초대장 생성 및 발송 */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-bold mb-4">
                            <Send size={16} />
                            Flow 1
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">초대장 생성 및 발송</h2>
                        <p className="text-gray-600 text-lg">작성자가 초대장을 만들고 공유하는 과정</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        {[
                            { icon: <Users size={32} />, title: "로그인", desc: "구글 계정으로 간편 로그인", color: "from-blue-500 to-cyan-500" },
                            { icon: <Calendar size={32} />, title: "정보 입력", desc: "10단계 가이드 진행", color: "from-purple-500 to-pink-500" },
                            { icon: <CheckCircle2 size={32} />, title: "초대장 완성", desc: "고유 링크 자동 생성", color: "from-green-500 to-emerald-500" },
                            { icon: <Send size={32} />, title: "공유", desc: "카톡/문자/이메일", color: "from-orange-500 to-red-500" },
                            { icon: <BarChart3 size={32} />, title: "관리", desc: "실시간 응답 확인", color: "from-indigo-500 to-purple-500" }
                        ].map((step, index) => (
                            <div key={index} className="relative">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-white p-6 rounded-2xl border-2 border-gray-100 hover:border-[#E74C3C]/20 hover:shadow-xl transition-all"
                                >
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-4 mx-auto shadow-lg`}>
                                        {step.icon}
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm font-bold text-gray-400 mb-1">STEP {index + 1}</div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                                        <p className="text-sm text-gray-600">{step.desc}</p>
                                    </div>
                                </motion.div>
                                {index < 4 && (
                                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                                        <ArrowRight size={24} className="text-gray-300" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-8 bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl border border-red-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <CheckCircle2 size={24} className="text-red-600" />
                            10단계 입력 과정 상세
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {["레이아웃 선택", "제목/보내는 사람", "날짜/시간", "장소", "사진 업로드", "테마 선택", "색상 커스터마이징", "배경음악", "초대 문구", "최종 확인"].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                    <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                                        {i + 1}
                                    </div>
                                    <span className="text-gray-700 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Flow 2: 초대장 수신 및 응답 */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-bold mb-4">
                            <MessageSquare size={16} />
                            Flow 2
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">초대장 수신 및 응답</h2>
                        <p className="text-gray-600 text-lg">게스트가 초대장을 확인하고 참석 여부를 응답하는 과정</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-lg"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white mb-4">
                                <MapPin size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">링크 클릭 (로그인 불필요)</h3>
                            <p className="text-gray-600 mb-6">카카오톡, 문자, 이메일로 받은 링크를 클릭하면 바로 초대장을 확인할 수 있습니다. 별도의 앱 설치나 로그인이 필요하지 않습니다.</p>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">날짜, 시간, 장소 확인</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">사진, 동영상 감상</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">배경음악 재생</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">지도로 위치 확인</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-lg"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white mb-4">
                                <CheckCircle2 size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">참석 여부 응답</h3>
                            <p className="text-gray-600 mb-6">간단한 폼을 작성하여 참석 여부를 알려주세요. 작성자에게 실시간으로 알림이 전달됩니다.</p>
                            <div className="space-y-4">
                                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                    <div className="font-bold text-green-700 mb-1">✅ 참석 확정</div>
                                    <div className="text-sm text-green-600">기쁜 마음으로 참석하겠습니다</div>
                                </div>
                                <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                                    <div className="font-bold text-red-700 mb-1">❌ 불참</div>
                                    <div className="text-sm text-red-600">아쉽지만 참석이 어렵습니다</div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="font-bold text-gray-700 mb-1">❓ 미정</div>
                                    <div className="text-sm text-gray-600">일정을 확인 후 다시 알려드리겠습니다</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-8 p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border border-purple-100"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                                <MessageSquare size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">축하 메시지 작성 (선택)</h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            참석 응답과 함께 따뜻한 축하 메시지를 남길 수 있습니다. 작성된 메시지는 초대장 작성자가 확인할 수 있으며, 소중한 추억으로 간직됩니다.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Flow 3: 참석자 관리 */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-bold mb-4">
                            <BarChart3 size={16} />
                            Flow 3
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">참석자 관리</h2>
                        <p className="text-gray-600 text-lg">작성자가 참석 응답을 확인하고 관리하는 과정</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {[
                            { title: "실시간 확인", desc: "참석 확정, 불참, 미응답 인원을 실시간으로 확인", icon: <BarChart3 size={32} />, color: "from-blue-500 to-cyan-500" },
                            { title: "상세 정보", desc: "이름, 연락처, 응답 시간, 메시지 확인", icon: <Users size={32} />, color: "from-green-500 to-emerald-500" },
                            { title: "엑셀 다운로드", desc: "참석자 명단을 엑셀로 다운로드하여 오프라인 관리", icon: <CheckCircle2 size={32} />, color: "from-purple-500 to-pink-500" }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white p-8 rounded-3xl border-2 border-gray-100 hover:border-[#E74C3C]/20 hover:shadow-xl transition-all"
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="p-8 bg-gradient-to-br from-gray-50 to-white rounded-3xl border-2 border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">참석자 목록 예시</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left py-3 px-4 font-bold text-gray-700">이름</th>
                                        <th className="text-left py-3 px-4 font-bold text-gray-700">연락처</th>
                                        <th className="text-left py-3 px-4 font-bold text-gray-700">상태</th>
                                        <th className="text-left py-3 px-4 font-bold text-gray-700">메시지</th>
                                        <th className="text-left py-3 px-4 font-bold text-gray-700">응답 시간</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { name: "김철수", contact: "010-1234-5678", status: "참석", message: "축하합니다! 꼭 참석하겠습니다.", time: "2026-01-09 14:30" },
                                        { name: "이영희", contact: "010-2345-6789", status: "참석", message: "기쁜 마음으로 참석하겠습니다.", time: "2026-01-09 15:20" },
                                        { name: "박민수", contact: "010-3456-7890", status: "불참", message: "아쉽지만 일정이 겹쳐서...", time: "2026-01-09 16:10" }
                                    ].map((guest, index) => (
                                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 font-medium">{guest.name}</td>
                                            <td className="py-3 px-4 text-gray-600">{guest.contact}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    guest.status === "참석" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                }`}>
                                                    {guest.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-600 text-sm">{guest.message}</td>
                                            <td className="py-3 px-4 text-gray-500 text-sm">{guest.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* System Architecture */}
            <section className="py-20 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full text-sm font-bold mb-4">
                            System Architecture
                        </div>
                        <h2 className="text-4xl font-bold mb-4">시스템 아키텍처</h2>
                        <p className="text-gray-300 text-lg">WAYO의 기술 스택과 데이터 흐름</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {[
                            { title: "Frontend", tech: "Next.js 14", desc: "React, TypeScript, Tailwind CSS", color: "from-cyan-500 to-blue-500" },
                            { title: "Backend", tech: "Ruby on Rails", desc: "RESTful API, ActionCable", color: "from-red-500 to-pink-500" },
                            { title: "Database", tech: "PostgreSQL", desc: "관계형 데이터베이스", color: "from-blue-600 to-indigo-600" }
                        ].map((item, index) => (
                            <div key={index} className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                                <div className={`inline-block px-4 py-2 rounded-lg bg-gradient-to-r ${item.color} text-white font-bold mb-4`}>
                                    {item.title}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{item.tech}</h3>
                                <p className="text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10">
                        <h3 className="text-2xl font-bold mb-6">데이터 흐름</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 flex-wrap justify-center">
                                <div className="w-32 text-center py-2 bg-cyan-500 rounded-lg font-bold">사용자</div>
                                <ArrowRight className="text-gray-400" />
                                <div className="w-32 text-center py-2 bg-blue-500 rounded-lg font-bold">Next.js</div>
                                <ArrowRight className="text-gray-400" />
                                <div className="w-32 text-center py-2 bg-red-500 rounded-lg font-bold">Rails API</div>
                                <ArrowRight className="text-gray-400" />
                                <div className="w-32 text-center py-2 bg-indigo-600 rounded-lg font-bold">PostgreSQL</div>
                            </div>
                            <div className="flex items-center gap-4 justify-center">
                                <div className="text-center">
                                    <div className="w-40 py-2 bg-purple-500 rounded-lg font-bold mb-2">ActionCable</div>
                                    <p className="text-sm text-gray-400">실시간 알림</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Entity Relationships */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">주요 엔티티 관계</h2>
                        <p className="text-gray-600 text-lg">데이터베이스 구조와 관계</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "User (사용자)",
                                fields: ["id", "email", "nickname", "avatar_url"],
                                relations: ["has_many Invitations", "has_many Tickets"]
                            },
                            {
                                title: "Invitation (초대장)",
                                fields: ["id", "title", "description", "event_date", "location", "theme_color"],
                                relations: ["belongs_to User", "has_many Tickets", "has_many Images"]
                            },
                            {
                                title: "Ticket (참석 응답)",
                                fields: ["id", "name", "contact", "status", "message", "response_time"],
                                relations: ["belongs_to Invitation", "belongs_to User (optional)"]
                            }
                        ].map((entity, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white p-6 rounded-2xl border-2 border-gray-200 shadow-lg"
                            >
                                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-[#E74C3C]">{entity.title}</h3>
                                <div className="mb-4">
                                    <div className="text-sm font-bold text-gray-500 mb-2">Fields:</div>
                                    <div className="space-y-1">
                                        {entity.fields.map((field, i) => (
                                            <div key={i} className="text-sm text-gray-700 font-mono bg-gray-50 px-2 py-1 rounded">
                                                {field}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-500 mb-2">Relations:</div>
                                    <div className="space-y-1">
                                        {entity.relations.map((rel, i) => (
                                            <div key={i} className="text-sm text-blue-600 font-medium">
                                                {rel}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 bg-gradient-to-br from-[#E74C3C] to-[#C0392B] text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className={`text-5xl md:text-6xl mb-6 ${blackHanSans.className}`}>
                        지금 바로 시작하세요
                    </h2>
                    <p className="text-xl mb-10 opacity-90">
                        WAYO의 모든 기능을 무료로 사용할 수 있습니다
                    </p>
                    <button
                        onClick={() => router.push('/invitations/create')}
                        className="px-12 py-5 bg-white text-[#E74C3C] rounded-2xl text-xl font-bold hover:scale-105 transition-transform shadow-2xl flex items-center gap-3 mx-auto"
                    >
                        <Sparkles size={24} />
                        무료로 초대장 만들기
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 text-center border-t border-gray-100 bg-white">
                <div className={`text-3xl text-[#E74C3C] tracking-tighter mb-6 ${blackHanSans.className}`}>WAYO</div>
                <p className="text-xs text-gray-400">© 2026 WAYO Invitation Service. All rights reserved.</p>
            </footer>
        </div>
    );
}
