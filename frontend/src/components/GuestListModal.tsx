"use client";

import { useState, useEffect } from "react";
import { X, Users, Check, Clock, XCircle, MessageSquare, Download } from "lucide-react";
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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "accepted":
                return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1"><Check size={12} />참석</span>;
            case "declined":
                return <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold flex items-center gap-1"><XCircle size={12} />불참</span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={12} />미정</span>;
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

    const exportToExcel = () => {
        // Create CSV content
        const headers = ["이름", "연락처", "상태", "메시지", "응답 시간"];
        const rows = filteredGuests.map(guest => [
            guest.name,
            guest.contact || "-",
            getStatusLabel(guest.status),
            guest.message || "-",
            new Date(guest.updated_at).toLocaleString('ko-KR')
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
        ].join("\n");

        // Create blob and download
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${invitationTitle}_게스트목록_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">참석 확인 관리</h2>
                                    <p className="text-sm text-gray-500">{invitationTitle}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={exportToExcel}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-green-200"
                                    >
                                        <Download size={16} />
                                        엑셀 다운로드
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X size={24} className="text-gray-400" />
                                    </button>
                                </div>
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

                        {/* Table */}
                        <div className="flex-1 overflow-auto">
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
                                <table className="w-full">
                                    <thead className="bg-gray-50 sticky top-0 z-10">
                                        <tr className="border-b border-gray-200">
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">이름</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">연락처</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">상태</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">메시지</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">응답 시간</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {filteredGuests.map((guest) => (
                                            <motion.tr
                                                key={guest.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                            {guest.name[0]}
                                                        </div>
                                                        <span className="font-bold text-gray-900">{guest.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {guest.contact || <span className="text-gray-400">-</span>}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(guest.status)}
                                                </td>
                                                <td className="px-6 py-4 max-w-md">
                                                    {guest.message ? (
                                                        <div className="flex items-start gap-2 text-sm text-gray-700">
                                                            <MessageSquare size={14} className="mt-0.5 flex-shrink-0 text-gray-400" />
                                                            <span className="italic">&quot;{guest.message}&quot;</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {getTimeAgo(guest.updated_at)}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
