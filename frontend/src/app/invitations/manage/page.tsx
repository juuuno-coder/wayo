"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import {
    ArrowLeft,
    Users,
    Calendar,
    ChevronRight,
    MessageSquare,
    Sparkles
} from "lucide-react";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";

export default function ManageInvitationsPage() {
    const router = useRouter();
    const { isLoggedIn, token } = useAuth();
    const [invitations, setInvitations] = useState<any[]>([]);
    const [receivedInvitations, setReceivedInvitations] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        fetchMyInvitations();
        fetchReceivedInvitations();
    }, []);

    const fetchMyInvitations = async () => {
        try {
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
                } else if (res.status === 401) {
                    // Token expired or invalid
                    router.push("/login"); // Force login
                    return;
                }
            }
            // 2. If Guest (Not Authenticated): Check Pending or Redirect
            else {
                const pendingIds = JSON.parse(localStorage.getItem("pending_invitations") || "[]");

                // If no token AND no pending invitations, user shouldn't be here
                if (pendingIds.length === 0) {
                    setIsAuthModalOpen(true);
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

    const fetchReceivedInvitations = async () => {
        try {
            if (!token) return;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/invitations/received`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                const results = await res.json();
                setReceivedInvitations(results);
            }
        } catch (error) {
            console.error("Failed to fetch received invitations", error);
        }
    };

    // Inside existing useEffect or fetchMyInvitations, fetch stats
    // But since stats are per-invitation, we can fetch them when clicking details OR include summary in list
    // For now, let's include view_count in the main list if the backend supported it, or fetch individually.
    // To minimize requests, we might stick to basic info here and show full stats on a separate dashboard page, 
    // OR we just assume the 'my invitations' list returns view_count (we added it to serialization earlier?).
    // Check InvitationsController#invitation_as_json -> it merges methods, let's check if view_count is visible.
    // It's a column, so `as_json` includes it by default.
    //
    // Let's enhance the card UI to show "Views" and "RSVP Breakdown".

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
            <header className="px-4 py-3 sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 flex items-center justify-between">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-gray-800" />
                </button>
                <h1 className="font-bold text-gray-900">대시보드</h1>
                <div className="w-10" />
            </header>

            <main className="flex-1 p-6 max-w-md mx-auto w-full">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">호스트 대시보드 📊</h2>
                    <p className="text-gray-500 text-sm">초대장 성과를 분석하고 게스트를 관리하세요.</p>
                </div>

                {/* Tab UI */}
                <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8">
                    <button
                        onClick={() => setActiveTab('sent')}
                        className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'sent' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        내가 보낸 초대
                    </button>
                    <button
                        onClick={() => setActiveTab('received')}
                        className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'received' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        나를 향한 초대
                        {receivedInvitations.length > 0 && (
                            <span className="ml-1.5 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full animate-bounce">
                                {receivedInvitations.length}
                            </span>
                        )}
                    </button>
                </div>

                {loading ? (
                    <div className="py-20 text-center text-gray-400">데이터를 불러오고 있습니다...</div>
                ) : (activeTab === 'sent' ? invitations : receivedInvitations).length === 0 ? (
                    <div className="py-20 flex flex-col items-center text-center opacity-60">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Sparkles size={32} className="text-gray-300" />
                        </div>
                        <p className="text-gray-500 font-medium">
                            {activeTab === 'sent' ? "아직 만든 초대장이 없어요." : "아직 도착한 초대가 없어요."}
                        </p>
                        {activeTab === 'sent' && (
                            <button
                                onClick={() => router.push('/invitations/create')}
                                className="mt-6 text-blue-500 font-bold underline underline-offset-4"
                            >
                                첫 초대장 만들기
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {(activeTab === 'sent' ? invitations : receivedInvitations).map((invite) => (
                            <div
                                key={invite.id}
                                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer relative"
                                onClick={() => router.push(`/invitations/${invite.id}`)}
                            >
                                {activeTab === 'received' && (
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg">New Invite</span>
                                    </div>
                                )}
                                <div className="p-5">
                                    {(invite.image_urls && invite.image_urls.length > 0) ? (
                                        <div className="relative w-full h-40 mb-4 rounded-2xl overflow-hidden">
                                            <NextImage
                                                src={invite.image_urls[0]}
                                                alt={invite.title}
                                                fill
                                                className="object-cover"
                                            />
                                            {/* View Count Overlay */}
                                            {activeTab === 'sent' && (
                                                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                                                    <Users size={12} />
                                                    {invite.view_count || 0} Views
                                                </div>
                                            )}
                                        </div>
                                    ) : invite.cover_image_url && (
                                        <div className="relative w-full h-40 mb-4 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
                                            <NextImage
                                                src={invite.cover_image_url}
                                                alt={invite.title}
                                                fill
                                                className="object-cover opacity-80"
                                            />
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-xl text-gray-900 leading-tight flex-1 mr-4">
                                            {invite.title}
                                        </h3>
                                    </div>

                                    {/* Stats Bar (Sent Only) */}
                                    {activeTab === 'sent' && (
                                        <div className="mb-5 grid grid-cols-3 gap-2">
                                            <div className="bg-green-50 p-3 rounded-2xl text-center">
                                                <p className="text-[10px] text-green-600 font-bold uppercase">Accepted</p>
                                                <p className="text-xl font-black text-green-700">
                                                    {invite.guests?.filter((g: any) => g.status === 'accepted').length || 0}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-2xl text-center">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">Pending</p>
                                                <p className="text-xl font-black text-gray-600">
                                                    {invite.guests?.filter((g: any) => g.status === 'pending').length || 0}
                                                </p>
                                            </div>
                                            <div className="bg-red-50 p-3 rounded-2xl text-center">
                                                <p className="text-[10px] text-red-400 font-bold uppercase">Declined</p>
                                                <p className="text-xl font-black text-red-500">
                                                    {invite.guests?.filter((g: any) => g.status === 'declined').length || 0}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2 text-sm text-gray-500 mb-5">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            <span>{new Date(invite.event_date).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {/* Recent Guests (Sent Only) */}
                                    {activeTab === 'sent' && invite.guests && invite.guests.length > 0 && (
                                        <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                                            {invite.guests.slice(0, 3).map((guest: any) => (
                                                <div key={guest.id} className="flex items-center justify-between border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border border-gray-100 shadow-sm ${guest.status === 'accepted' ? 'bg-green-100 text-green-600' : 'bg-white text-gray-600'}`}>
                                                            {guest.name[0]}
                                                        </div>
                                                        <span className="font-bold text-gray-800 text-sm">{guest.name}</span>
                                                    </div>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${guest.status === 'accepted' ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                                                        {guest.status === 'accepted' ? '참석' : '대기'}
                                                    </span>
                                                </div>
                                            ))}
                                            {invite.guests.length > 3 && (
                                                <p className="text-[10px] text-gray-400 text-center pt-1">
                                                    외 {invite.guests.length - 3}명의 응답이 더 있습니다
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </div>
    );
}
