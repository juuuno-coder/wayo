"use client";

import { useState, useEffect } from "react";
import { X, Users, Check, Clock, XCircle, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "@/config";

interface Guest {
    id: number;
    name: string;
    contact?: string;
    status: string;
    message?: string;
    created_at: string;
    updated_at: string;
    user_id?: number;
}

interface GuestListModalProps {
    isOpen: boolean;
    onClose: () => void;
    invitationId: number;
    invitationTitle: string;
}

export default function GuestListModal({
    isOpen,
    onClose,
    invitationId,
    invitationTitle,
}: GuestListModalProps) {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "accepted" | "pending" | "declined">("all");

    useEffect(() => {
        if (isOpen) {
            fetchGuests();
        }
    }, [isOpen, invitationId]);

    const fetchGuests = async () => {
        try {
            setLoading(true);
            const res = await fetch(
                `${API_BASE_URL}/invitations/${invitationId}/guests`
            );
            if (res.ok) {
                const data = await res.json();
                setGuests(data);
            }
        } catch (error) {
            console.error("Failed to fetch guests:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredGuests = guests.filter((guest) => {
        if (filter === "all") return true;
        return guest.status === filter;
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "accepted":
                return <Check size={16} className="text-green-600" />;
            case "declined":
                return <XCircle size={16} className="text-red-500" />;
            default:
                return <Clock size={16} className="text-gray-400" />;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "accepted":
                return "참석 확정";
            case "declined":
                return "불참";
            default:
                return "미정";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "accepted":
                return "bg-green-50 text-green-700 border-green-200";
            case "declined":
                return "bg-red-50 text-red-600 border-red-200";
            default:
                return "bg-gray-50 text-gray-600 border-gray-200";
        }
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}일 전`;
        if (hours > 0) return `${hours}시간 전`;
        return "방금 전";
    };

    const stats = {
        total: guests.length,
        accepted: guests.filter((g) => g.status === "accepted").length,
        pending: guests.filter((g) => g.status === "pending").length,
        declined: guests.filter((g) => g.status === "declined").length,
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">게스트 목록</h2>
                                    <p className="text-sm text-gray-500">{invitationTitle}</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={24} className="text-gray-400" />
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilter("all")}
                                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${filter === "all"
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-100 hover:border-gray-200"
                                        }`}
                                >
                                    <p className="text-xs font-bold text-gray-500 mb-1">전체</p>
                                    <p className="text-2xl font-black text-gray-900">{stats.total}</p>
                                </button>
                                <button
                                    onClick={() => setFilter("accepted")}
                                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${filter === "accepted"
                                        ? "border-green-500 bg-green-50"
                                        : "border-gray-100 hover:border-gray-200"
                                        }`}
                                >
                                    <p className="text-xs font-bold text-green-600 mb-1">참석</p>
                                    <p className="text-2xl font-black text-green-700">{stats.accepted}</p>
                                </button>
                                <button
                                    onClick={() => setFilter("pending")}
                                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${filter === "pending"
                                        ? "border-gray-500 bg-gray-50"
                                        : "border-gray-100 hover:border-gray-200"
                                        }`}
                                >
                                    <p className="text-xs font-bold text-gray-500 mb-1">미정</p>
                                    <p className="text-2xl font-black text-gray-600">{stats.pending}</p>
                                </button>
                                <button
                                    onClick={() => setFilter("declined")}
                                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${filter === "declined"
                                        ? "border-red-500 bg-red-50"
                                        : "border-gray-100 hover:border-gray-200"
                                        }`}
                                >
                                    <p className="text-xs font-bold text-red-500 mb-1">불참</p>
                                    <p className="text-2xl font-black text-red-600">{stats.declined}</p>
                                </button>
                            </div>
                        </div>

                        {/* Guest List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-3">
                            {loading ? (
                                <div className="py-20 text-center text-gray-400">
                                    <Users size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>게스트 목록을 불러오는 중...</p>
                                </div>
                            ) : filteredGuests.length === 0 ? (
                                <div className="py-20 text-center text-gray-400">
                                    <Users size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>
                                        {filter === "all"
                                            ? "아직 게스트가 없습니다"
                                            : `${getStatusLabel(filter)} 상태의 게스트가 없습니다`}
                                    </p>
                                </div>
                            ) : (
                                filteredGuests.map((guest) => (
                                    <motion.div
                                        key={guest.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-4 rounded-2xl border-2 ${getStatusColor(guest.status)}`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-white border-2 border-current flex items-center justify-center font-bold text-lg">
                                                    {guest.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-lg">{guest.name}</p>
                                                    {guest.contact && (
                                                        <p className="text-xs opacity-60">{guest.contact}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(guest.status)}
                                                <span className="text-xs font-bold">{getStatusLabel(guest.status)}</span>
                                            </div>
                                        </div>

                                        {guest.message && (
                                            <div className="mt-3 p-3 bg-white/50 rounded-xl flex items-start gap-2">
                                                <MessageSquare size={14} className="mt-0.5 flex-shrink-0 opacity-40" />
                                                <p className="text-sm italic opacity-80">&quot;{guest.message}&quot;</p>
                                            </div>
                                        )}

                                        <p className="text-xs opacity-40 mt-2">{getTimeAgo(guest.updated_at)}</p>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
