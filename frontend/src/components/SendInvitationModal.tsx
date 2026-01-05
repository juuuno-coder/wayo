"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, User, Send, CheckCircle2, Loader2 } from "lucide-react";

interface SendInvitationModalProps {
    isOpen: boolean;
    onClose: () => void;
    invitationId: string | number;
}

export default function SendInvitationModal({ isOpen, onClose, invitationId }: SendInvitationModalProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [sentSuccess, setSentSuccess] = useState<string | null>(null);

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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/users/search?query=${encodeURIComponent(query)}`);
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
            setSending(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/invitations/${invitationId}/guests`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                    },
                    body: JSON.stringify({
                        guest: {
                            name: user.nickname, // Use nickname as guest name
                            user_id: user.id,   // Link to user account
                            status: "invited",  // Or 'attending' depending on flow. Let's say 'invited' for now? Wait, backend defaults to 'attending'. Ideally 'invited' until they accept.
                        }
                    })
                });

                if (res.ok) {
                    setSentSuccess(user.nickname);
                    setTimeout(() => {
                        setSentSuccess(null);
                        onClose();
                    }, 1500);
                } else {
                    const err = await res.json();
                    if (err.id) {
                        alert("이미 초대된 사용자입니다.");
                    } else {
                        alert("전송에 실패했습니다.");
                    }
                }
            } catch (error) {
                console.error("Failed to send", error);
            } finally {
                setSending(false);
            }
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

                        <div className="p-6 space-y-6 overflow-y-auto">
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
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
