"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import {
    ArrowLeft,
    Users,
    Calendar,
    Sparkles,
    Search,
    ChevronLeft
} from "lucide-react";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import GuestListModal from "@/components/GuestListModal";
import { Black_Han_Sans, Inter } from "next/font/google";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/config";

const blackHanSans = Black_Han_Sans({
    weight: "400",
    subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

export default function ManageInvitationsPage() {
    const router = useRouter();
    const { isLoggedIn, user, token, isLoading } = useAuth();
    const [invitations, setInvitations] = useState<any[]>([]);
    const [receivedInvitations, setReceivedInvitations] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');
    const [activeFilter, setActiveFilter] = useState<'all' | 'draft' | 'published' | 'completed'>('all'); // Filter state
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [selectedInvitation, setSelectedInvitation] = useState<any | null>(null);
    const [isGuestListOpen, setIsGuestListOpen] = useState(false);

    const fetchMyInvitations = useCallback(async () => {
        try {
            if (token) {
                const res = await fetch(`${API_BASE_URL}/invitations?t=${Date.now()}`, {
                    headers: { "Authorization": `Bearer ${token}` },
                    cache: 'no-store',
                    next: { revalidate: 0 }
                });

                if (res.ok) {
                    const myInvites = await res.json();
                    const results = await Promise.all(
                        myInvites.map(async (invite: any) => {
                            const guestRes = await fetch(`${API_BASE_URL}/invitations/${invite.id}/guests`);
                            const guests = guestRes.ok ? await guestRes.json() : [];
                            return { ...invite, guests };
                        })
                    );
                    setInvitations(results);
                } else {
                    console.warn("Failed to fetch authenticated invitations", res.status);
                }
            } else {
                const pendingIds = JSON.parse(localStorage.getItem("pending_invitations") || "[]");
                if (pendingIds.length === 0) {
                    setIsAuthModalOpen(true);
                    setLoading(false);
                    return;
                }
                const results = await Promise.all(
                    pendingIds.map(async (id: number) => {
                        const res = await fetch(`${API_BASE_URL}/invitations/${id}`);
                        if (res.ok) {
                            const invite = await res.json();
                            const guestRes = await fetch(`${API_BASE_URL}/invitations/${id}/guests`);
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
    }, [token]);

    const fetchReceivedInvitations = useCallback(async () => {
        try {
            if (!token) return;
            const res = await fetch(`${API_BASE_URL}/invitations/received?t=${Date.now()}`, {
                headers: { "Authorization": `Bearer ${token}` },
                cache: 'no-store'
            });
            if (res.ok) {
                const results = await res.json();
                setReceivedInvitations(results);
            }
        } catch (error) {
            console.error("Failed to fetch received invitations", error);
        }
    }, [token]);

    useEffect(() => {
        if (isLoading) return;
        fetchMyInvitations();
        fetchReceivedInvitations();

        // Poll every 1 second for real-time updates
        const interval = setInterval(() => {
            fetchMyInvitations();
            fetchReceivedInvitations();
        }, 1000);

        // Also refetch on window focus
        const onFocus = () => {
            fetchMyInvitations();
            fetchReceivedInvitations();
        };
        window.addEventListener('focus', onFocus);

        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', onFocus);
        };
    }, [token, isLoading, fetchMyInvitations, fetchReceivedInvitations]);

    return (
        <div className={`min-h-screen bg-[#FDFBF7] ${inter.className} pb-20`}>
            {/* Desktop-like Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push('/profile')} className="p-2 -ml-2 hover:bg-gray-50 rounded-full text-gray-600 transition-colors">
                            <ChevronLeft size={24} />
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">내 초대장 관리</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        {isLoggedIn && user ? (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#E74C3C] flex items-center justify-center text-white font-bold text-sm shadow-md">
                                    {user.nickname?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <span className="text-sm font-medium text-gray-700 hidden md:block">{user.nickname || user.email}</span>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="text-sm font-medium text-gray-600 hover:text-[#E74C3C] transition-colors"
                            >
                                로그인
                            </button>
                        )}
                        <button
                            onClick={() => router.push('/invitations/create')}
                            className="bg-[#E74C3C] text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-[#c0392b] transition-colors shadow-lg shadow-red-200 flex items-center gap-2"
                        >
                            <Sparkles size={16} /> 새 초대장 만들기
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 mb-2">Dashboard</h2>
                        <p className="text-gray-500">내가 만든 초대장과 받은 초대를 한눈에 확인하세요.</p>
                    </div>

                    {/* Desktop Tabs */}
                    <div className="bg-white p-1.5 rounded-2xl border border-gray-100 inline-flex shadow-sm">
                        <button
                            onClick={() => setActiveTab('sent')}
                            className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'sent' ? 'bg-[#E74C3C] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            보낸 초대
                        </button>
                        <button
                            onClick={() => setActiveTab('received')}
                            className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${activeTab === 'received' ? 'bg-[#E74C3C] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            받은 초대
                            {receivedInvitations.length > 0 && (
                                <span className={`px-1.5 py-0.5 text-[10px] rounded-full ${activeTab === 'received' ? 'bg-white text-[#E74C3C]' : 'bg-[#E74C3C] text-white'}`}>
                                    {receivedInvitations.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Filter Tabs (Only for Sent Invitations) */}
                {activeTab === 'sent' && (
                    <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'all', label: '전체' },
                            { id: 'draft', label: '작성 중' },
                            { id: 'published', label: '발행됨' },
                            { id: 'completed', label: '행사 완료' }
                        ].map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id as any)}
                                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors border ${activeFilter === filter.id
                                    ? 'bg-gray-900 text-white border-gray-900'
                                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                )}

                {loading || isLoading ? (
                    <div className="py-32 text-center text-gray-400 flex flex-col items-center">
                        <div className="animate-spin w-10 h-10 border-4 border-gray-200 border-t-[#E74C3C] rounded-full mb-6"></div>
                        <p>데이터를 불러오고 있습니다...</p>
                    </div>
                ) : (
                    activeTab === 'sent'
                        ? invitations.filter(inv => activeFilter === 'all' || (inv.status || 'draft') === activeFilter)
                        : receivedInvitations
                ).length === 0 ? (
                    <div className="flex flex-col gap-12">
                        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                                <Sparkles size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {activeTab === 'sent' ? "아직 만든 초대장이 없어요" : "아직 받은 초대가 없어요"}
                            </h3>
                            <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                                {activeTab === 'sent'
                                    ? "특별한 날을 위한 나만의 초대장을 만들어보세요.\n몇 번의 클릭으로 멋진 초대장이 완성됩니다."
                                    : "친구들이 보낸 초대장이 이곳에 쌓입니다.\n새로운 소식을 기다려보세요!"}
                            </p>
                            {activeTab === 'sent' && (
                                <button
                                    onClick={() => router.push('/invitations/create')}
                                    className="px-8 py-3 bg-[#E74C3C] text-white rounded-xl font-bold hover:bg-[#c0392b] transition-colors shadow-lg shadow-red-200"
                                >
                                    초대장 만들기 시작
                                </button>
                            )}
                        </div>

                        {/* Sample Preview Section */}
                        {activeTab === 'sent' && (
                            <div className="opacity-50 pointer-events-none grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-px bg-gray-200 flex-1"></div>
                                    <span className="text-sm font-bold text-gray-400">초대장을 만들면 이렇게 보여요 (예시)</span>
                                    <div className="h-px bg-gray-200 flex-1"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full relative">
                                        <div className="aspect-[4/3] bg-gray-100 relative">
                                            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-200">
                                                <Sparkles size={32} />
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
                                            <div className="absolute bottom-3 right-3 flex gap-2">
                                                <div className="bg-yellow-400 text-yellow-900 px-2.5 py-1 rounded-full text-xs font-bold border border-yellow-300">
                                                    작성 중
                                                </div>
                                                <div className="bg-black/40 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-white/20">
                                                    <Users size={12} />
                                                    0
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight line-clamp-2">
                                                    나의 첫 번째 초대장
                                                </h3>
                                                <p className="text-sm text-gray-500 flex items-center gap-2 mb-4">
                                                    <Calendar size={14} />
                                                    {new Date().toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 mt-auto pt-4 border-t border-gray-50">
                                                <div className="text-center">
                                                    <p className="text-[10px] text-green-600 font-bold uppercase mb-0.5">참석</p>
                                                    <p className="text-lg font-black text-gray-800">0</p>
                                                </div>
                                                <div className="text-center border-l border-gray-100">
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">대기</p>
                                                    <p className="text-lg font-black text-gray-800">0</p>
                                                </div>
                                                <div className="text-center border-l border-gray-100">
                                                    <p className="text-[10px] text-red-400 font-bold uppercase mb-0.5">거절</p>
                                                    <p className="text-lg font-black text-gray-800">0</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Grid Layout for Cards */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {(activeTab === 'sent'
                            ? invitations.filter(inv => activeFilter === 'all' || (inv.status || 'draft') === activeFilter)
                            : receivedInvitations
                        ).map((invite) => (
                            <div
                                key={invite.id}
                                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col h-full relative"
                                onClick={() => {
                                    if (activeTab === 'sent') {
                                        if (invite.status === 'draft') {
                                            router.push(`/invitations/create?id=${invite.id}`); // Edit draft
                                        } else {
                                            setSelectedInvitation(invite);
                                            setIsGuestListOpen(true);
                                        }
                                    } else {
                                        router.push(`/invitations/${invite.id}`);
                                    }
                                }}
                            >
                                {activeTab === 'received' && (
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="bg-[#E74C3C] text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-md">New!</span>
                                    </div>
                                )}

                                {/* Image Section */}
                                <div className="aspect-[4/3] bg-gray-100 relative">
                                    {(invite.image_urls && invite.image_urls.length > 0) ? (
                                        <NextImage src={invite.image_urls[0]} alt={invite.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : invite.cover_image_url ? (
                                        <NextImage src={invite.cover_image_url} alt={invite.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Sparkles size={32} />
                                        </div>
                                    )}
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>

                                    {/* View Count Badge */}
                                    {activeTab === 'sent' && (
                                        <div className="absolute bottom-3 right-3 flex gap-2">
                                            {/* Status Badge */}
                                            {invite.status === 'draft' && (
                                                <div className="bg-yellow-400 text-yellow-900 px-2.5 py-1 rounded-full text-xs font-bold border border-yellow-300">
                                                    작성 중
                                                </div>
                                            )}
                                            {invite.status === 'published' && (
                                                <div className="bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-green-400">
                                                    발행됨
                                                </div>
                                            )}
                                            {invite.status === 'completed' && (
                                                <div className="bg-gray-500 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-gray-400">
                                                    완료됨
                                                </div>
                                            )}

                                            <div className="bg-black/40 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-white/20">
                                                <Users size={12} />
                                                {invite.view_count || 0}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight group-hover:text-[#E74C3C] transition-colors line-clamp-2">
                                            {invite.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-2 mb-4">
                                            <Calendar size={14} />
                                            {new Date(invite.event_date).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {/* Stats Bar (Sent Only) */}
                                    {activeTab === 'sent' ? (
                                        <div className="grid grid-cols-3 gap-2 mt-auto pt-4 border-t border-gray-50">
                                            <div className="text-center">
                                                <p className="text-[10px] text-green-600 font-bold uppercase mb-0.5">참석</p>
                                                <p className="text-lg font-black text-gray-800">
                                                    {invite.guests?.filter((g: any) => g.status === 'accepted').length || 0}
                                                </p>
                                            </div>
                                            <div className="text-center border-l border-gray-100">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">대기</p>
                                                <p className="text-lg font-black text-gray-800">
                                                    {invite.guests?.filter((g: any) => g.status === 'pending').length || 0}
                                                </p>
                                            </div>
                                            <div className="text-center border-l border-gray-100">
                                                <p className="text-[10px] text-red-400 font-bold uppercase mb-0.5">거절</p>
                                                <p className="text-lg font-black text-gray-800">
                                                    {invite.guests?.filter((g: any) => g.status === 'declined').length || 0}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <button className="w-full mt-4 py-2 bg-gray-50 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                                            초대장 보기
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* New Item Card (Sent Tab) */}
                        {activeTab === 'sent' && (
                            <div
                                onClick={() => router.push('/invitations/create')}
                                className="bg-white rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 cursor-pointer hover:border-[#E74C3C] hover:bg-red-50/50 transition-all group min-h-[300px]"
                            >
                                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-white group-hover:scale-110 transition-all shadow-sm">
                                    <Sparkles size={24} className="text-gray-400 group-hover:text-[#E74C3C]" />
                                </div>
                                <p className="font-bold text-gray-500 group-hover:text-[#E74C3C]">새로운 초대장 만들기</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {selectedInvitation && (
                <GuestListModal
                    isOpen={isGuestListOpen}
                    onClose={() => {
                        setIsGuestListOpen(false);
                        setSelectedInvitation(null);
                    }}
                    invitationId={selectedInvitation.id}
                    invitationTitle={selectedInvitation.title}
                />
            )}

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />

            {/* Debug Panel for User Reassurance */}
            <div className="fixed bottom-0 left-0 right-0 bg-black/80 text-white p-2 text-[10px] font-mono opacity-70 hover:opacity-100 transition-opacity z-[100] flex justify-between px-6 pointer-events-none sm:pointer-events-auto">
                <div className="flex gap-4">
                    <span>STATUS: {loading || isLoading ? "SYNCING..." : "LIVE"}</span>
                    <span>ITEMS: {invitations.length} (Sent) / {receivedInvitations.length} (Received)</span>
                    <span>FILTER: {activeFilter}</span>
                </div>
                <div>
                    <span>TOKEN: {token ? "OK" : "NONE"}</span>
                    <span className="ml-4 text-yellow-400">AUTO-REFRESH: ON (1s)</span>
                </div>
            </div>
        </div>
    );
}
