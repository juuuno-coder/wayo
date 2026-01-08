"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, User, Send, CheckCircle2, Loader2, Mail, QrCode } from "lucide-react";
import { API_BASE_URL } from "@/config";

interface SendInvitationModalProps {
    isOpen: boolean;
    onClose: () => void;
    invitationId: string | number;
}

export default function SendInvitationModal({ isOpen, onClose, invitationId }: SendInvitationModalProps) {
    const [activeTab, setActiveTab] = useState<'search' | 'email' | 'qr'>('search');
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    // Search State
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Sending State
    const [sending, setSending] = useState(false);
    const [sentSuccess, setSentSuccess] = useState<string | null>(null);

    const invitationUrl = typeof window !== 'undefined' ? `${window.location.origin}/invitations/${invitationId}` : '';

    // Debounced Search
    useEffect(() => {
        const handler = setTimeout(() => {
            if (query.length > 1) { // Search only if at least 2 chars
                searchUsers();
            } else {
                setResults([]);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(handler);
    }, [query]);

    const searchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/users/search?query=${encodeURIComponent(query)}`);
            if (res.ok) {
                const data = await res.json();
                setResults(data);
            }
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    const sendInvitation = async (user: any) => {
        if (confirm(`${user.nickname}님에게 초대장을 보내시겠습니까?`)) {
            await executeSend(user.nickname, user.id, user.email);
        }
    };

    const sendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !name) return;
        await executeSend(name, undefined, email);
    }

    const executeSend = async (guestName: string, userId?: number, contact?: string) => {
        setSending(true);
        try {
            const res = await fetch(`${API_BASE_URL}/invitations/${invitationId}/guests`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken") || ""}`
                },
                body: JSON.stringify({
                    guest: {
                        name: guestName,
                        user_id: userId,
                        contact: contact,
                        status: "invited",
                    }
                })
            });

            if (res.ok) {
                setSentSuccess(guestName);
                if (activeTab === 'email') {
                    setEmail("");
                    setName("");
                }
                setTimeout(() => {
                    setSentSuccess(null);
                    if (activeTab === 'search') onClose();
                }, 1500);
            } else {
                const err = await res.json();
                alert(err.message || "전송에 실패했습니다.");
            }
        } catch (error) {
            console.error("Failed to send", error);
            alert("서버 오류가 발생했습니다.");
        } finally {
            setSending(false);
        }
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
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[80vh]"
                    >
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <h3 className="font-bold text-lg text-gray-900">회원에게 보내기</h3>
                            <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex border-b border-gray-100">
                            {[
                                { id: 'search', label: '회원 검색', icon: Search },
                                { id: 'email', label: '이메일 발송', icon: Mail },
                                { id: 'qr', label: 'QR 코드', icon: QrCode },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors relative ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    <tab.icon size={16} />
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="p-6 space-y-6 overflow-y-auto">
                            {activeTab === 'search' && (
                                <>
                                    {/* Search Bar */}
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="닉네임 또는 이메일 검색"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 outline-none transition-all"
                                            autoFocus
                                        />
                                    </div>

                                    {/* Results List */}
                                    <div className="space-y-4">
                                        {loading ? (
                                            <div className="text-center py-8 text-gray-400">
                                                <Loader2 className="animate-spin mx-auto mb-2" />
                                                검색 중...
                                            </div>
                                        ) : results.length > 0 ? (
                                            results.map((user) => (
                                                <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                                                            {user.nickname[0]}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900">{user.nickname}</p>
                                                            <p className="text-xs text-gray-400">{user.email}</p>
                                                        </div>
                                                    </div>

                                                    {sentSuccess === user.nickname ? (
                                                        <span className="text-green-500 font-bold text-xs flex items-center gap-1">
                                                            <CheckCircle2 size={14} /> 전송 완료
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => sendInvitation(user)}
                                                            disabled={sending}
                                                            className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black active:scale-95 transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            보내기
                                                        </button>
                                                    )}
                                                </div>
                                            ))
                                        ) : query.length > 1 ? (
                                            <div className="text-center py-8 text-gray-400 text-sm">
                                                검색 결과가 없습니다.
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-400 text-sm opacity-60">
                                                <User size={32} className="mx-auto mb-2 opacity-50" />
                                                가보자고 회원을 찾아보세요
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {activeTab === 'email' && (
                                <form onSubmit={sendEmail} className="space-y-4 pt-2">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">받는 분 이름</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="예: 홍길동"
                                            className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">이메일 주소</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="example@email.com"
                                            className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 outline-none"
                                            required
                                        />
                                    </div>

                                    <div className="bg-blue-50 p-4 rounded-2xl text-xs text-blue-600 leading-relaxed">
                                        💡 입력하신 이메일이 Wayo 회원의 이메일과 일치하면, 자동으로 해당 계정의 '받은 초대장' 보관함에도 저장됩니다.
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={sending || !email || !name}
                                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-4"
                                    >
                                        {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                        {sending ? '전송 중...' : '이메일 발송하기'}
                                    </button>

                                    {sentSuccess && (
                                        <div className="text-center text-green-500 font-bold text-sm animate-in fade-in slide-in-from-bottom py-2">
                                            <CheckCircle2 className="inline mr-1" size={16} />
                                            {sentSuccess}님에게 메일을 보냈습니다!
                                        </div>
                                    )}
                                </form>
                            )}

                            {activeTab === 'qr' && (
                                <div className="flex flex-col items-center justify-center py-6 text-center">
                                    <div className="p-4 bg-white rounded-3xl shadow-lg border border-gray-100 mb-6">
                                        {/* Use QR Server API for MVP to avoid deps issues */}
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=000000&bgcolor=ffffff&data=${encodeURIComponent(invitationUrl)}`}
                                            alt="QR Code"
                                            className="w-48 h-48 rounded-lg mix-blend-multiply"
                                        />
                                    </div>
                                    <p className="text-sm font-bold text-gray-900 mb-2">QR 코드를 스캔하세요</p>
                                    <p className="text-xs text-gray-400 mb-6">카메라로 스캔하면 초대장으로 바로 연결됩니다.</p>

                                    <button
                                        onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(invitationUrl)}`;
                                            link.download = 'invitation_qr.png';
                                            link.target = '_blank';
                                            link.click();
                                        }}
                                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
                                    >
                                        이미지로 다운로드
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
