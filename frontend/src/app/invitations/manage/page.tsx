"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Users,
    Calendar,
    ChevronRight,
    MessageSquare,
    Sparkles
} from "lucide-react";

export default function ManageInvitationsPage() {
    const router = useRouter();
    const [invitations, setInvitations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyInvitations();
    }, []);

    const fetchMyInvitations = async () => {
        try {
            const token = localStorage.getItem("authToken");

            // 1. If Authenticated: Fetch ONLY from Backend
            if (token) {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/invitations`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const myInvites = await res.json();

                    // Fetch guest counts/details for each invite
                    const results = await Promise.all(
                        myInvites.map(async (invite: any) => {
                            const guestRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/invitations/${invite.id}/guests`);
                            const guests = guestRes.ok ? await guestRes.json() : [];
                            return { ...invite, guests };
                        })
                    );
                    setInvitations(results);
                }
            }
            // 2. If Guest (Not Authenticated): Fetch from LocalStorage
            else {
                const pendingIds = JSON.parse(localStorage.getItem("pending_invitations") || "[]");
                if (pendingIds.length === 0) {
                    setLoading(false);
                    return;
                }

                const results = await Promise.all(
                    pendingIds.map(async (id: number) => {
                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/invitations/${id}`);
                        if (res.ok) {
                            const invite = await res.json();
                            const guestRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/invitations/${id}/guests`);
                            const guests = guestRes.ok ? await guestRes.json() : [];
                            return { ...invite, guests };
                        }
                        return null;
                    })
                );
                setInvitations(results.filter(i => i !== null));
            }
        } catch (error) {
            console.error("Failed to fetch invitations", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
            <header className="px-4 py-3 sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 flex items-center justify-between">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-gray-800" />
                </button>
                <h1 className="font-bold text-gray-900">참석 여부 확인</h1>
                <div className="w-10" />
            </header>

            <main className="flex-1 p-6 max-w-md mx-auto w-full">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">나의 초대장 💌</h2>
                    <p className="text-gray-500 text-sm">내가 보낸 초대장의 참석 현황을 확인하세요.</p>
                </div>

                {loading ? (
                    <div className="py-20 text-center text-gray-400">불러오는 중...</div>
                ) : invitations.length === 0 ? (
                    <div className="py-20 flex flex-col items-center text-center opacity-60">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Sparkles size={32} className="text-gray-300" />
                        </div>
                        <p className="text-gray-500 font-medium">아직 만든 초대장이 없어요.</p>
                        <button
                            onClick={() => router.push('/invitations/create')}
                            className="mt-6 text-blue-500 font-bold underline underline-offset-4"
                        >
                            첫 초대장 만들기
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {invitations.map((invite) => (
                            <div
                                key={invite.id}
                                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => router.push(`/invitations/${invite.id}`)}
                            >
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-xl text-gray-900 leading-tight flex-1 mr-4">
                                            {invite.title}
                                        </h3>
                                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                                            {invite.guests.length}명 응답
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm text-gray-500 mb-5">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            <span>{new Date(invite.event_date).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {/* Guest Mini List */}
                                    {invite.guests.length > 0 && (
                                        <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                                            {invite.guests.slice(0, 3).map((guest: any) => (
                                                <div key={guest.id} className="flex items-center justify-between border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-bold text-gray-600 border border-gray-100 shadow-sm">
                                                            {guest.name[0]}
                                                        </div>
                                                        <span className="font-bold text-gray-800 text-sm">{guest.name}</span>
                                                    </div>
                                                    {guest.message && (
                                                        <div className="text-gray-400">
                                                            <MessageSquare size={14} />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {invite.guests.length > 3 && (
                                                <p className="text-[10px] text-gray-400 text-center pt-1">
                                                    외 {invite.guests.length - 3}명이 더 있습니다
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className="mt-5 flex items-center justify-between group">
                                        <span className="text-xs font-bold text-gray-400 group-hover:text-blue-500 transition-colors">자세히 보기</span>
                                        <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
