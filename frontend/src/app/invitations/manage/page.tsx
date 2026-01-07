"use client";

import { useEffect, useState } from "react";
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

const blackHanSans = Black_Han_Sans({
    weight: "400",
    subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

export default function ManageInvitationsPage() {
    const router = useRouter();
    const { isLoggedIn, token, isLoading } = useAuth();
    const [invitations, setInvitations] = useState<any[]>([]);
    const [receivedInvitations, setReceivedInvitations] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [selectedInvitation, setSelectedInvitation] = useState<any | null>(null);
    const [isGuestListOpen, setIsGuestListOpen] = useState(false);

    useEffect(() => {
        if (isLoading) return;
        fetchMyInvitations();
        fetchReceivedInvitations();
    }, [token, isLoading]);

    const fetchMyInvitations = async () => {
        try {
            if (token) {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/invitations`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (res.ok) {
                    const myInvites = await res.json();
                    const results = await Promise.all(
                        myInvites.map(async (invite: any) => {
                            const guestRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/invitations/${invite.id}/guests`);
                            const guests = guestRes.ok ? await guestRes.json() : [];
                            return { ...invite, guests };
                        })
                    );
                    setInvitations(results);
                } else {
                    // Token issue or other error: fail silently or fallback
                    console.warn("Failed to fetch authenticated invitations", res.status);
                    // Do NOT redirect to login automatically to prevent loops
                }
            } else {
                const pendingIds = JSON.parse(localStorage.getItem("pending_invitations") || "[]");
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
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const results = await res.json();
                setReceivedInvitations(results);
            }
        } catch (error) {
            console.error("Failed to fetch received invitations", error);
        }
    };

    return (
        <div className={`min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 ${inter.className}`}>
            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left Side: Brand Section (Hidden on Mobile) */}
                <div className="hidden lg:block space-y-12">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-100 text-[#E74C3C] rounded-full text-xs font-black uppercase tracking-widest">
                            <Sparkles size={14} /> Wayo App
                        </div>
                        <h1 className={`text-7xl text-[#333] tracking-tighter leading-none ${blackHanSans.className}`}>
                            WAYO
                        </h1>
                        <p className="text-3xl leading-tight font-light text-gray-800">
                            초대장 관리도<br />
                            <span className="font-bold text-[#E74C3C] border-b-4 border-[#E74C3C]/20">스마트하고 간편하게</span>
                        </p>
                    </div>
                </div>

                {/* Right Side: Phone Frame */}
                <div className="flex justify-center lg:justify-end">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-[400px] bg-white rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border-[8px] border-gray-900 p-2 relative overflow-hidden"
                    >
                        <div className="bg-gray-50 rounded-[32px] h-full min-h-[700px] flex flex-col relative overflow-hidden">
                            {/* App Header */}
                            <header className="px-6 py-5 bg-white border-b border-gray-100 sticky top-0 z-10 flex items-center gap-4">
                                <button onClick={() => router.push('/profile')} className="p-2 -ml-2 hover:bg-gray-50 rounded-full text-gray-800 transition-colors">
                                    <ChevronLeft size={24} />
                                </button>
                                <h1 className="font-bold text-gray-900 text-lg">내 초대장함</h1>
                            </header>

                            <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                                {/* Tab UI */}
                                <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6">
                                    <button
                                        onClick={() => setActiveTab('sent')}
                                        className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'sent' ? 'bg-white text-[#E74C3C] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        보낸 초대
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('received')}
                                        className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'received' ? 'bg-white text-[#E74C3C] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        받은 초대
                                        {receivedInvitations.length > 0 && (
                                            <span className="ml-1.5 px-1.5 py-0.5 bg-[#E74C3C] text-white text-[10px] rounded-full">
                                                {receivedInvitations.length}
                                            </span>
                                        )}
                                    </button>
                                </div>

                                {loading || isLoading ? (
                                    <div className="py-20 text-center text-gray-400">
                                        <div className="animate-spin w-8 h-8 border-4 border-gray-200 border-t-[#E74C3C] rounded-full mx-auto mb-4"></div>
                                        로딩 중...
                                    </div>
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
                                                className="mt-6 text-[#E74C3C] font-bold underline underline-offset-4"
                                            >
                                                첫 초대장 만들기
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {(activeTab === 'sent' ? invitations : receivedInvitations).map((invite) => (
                                            <div
                                                key={invite.id}
                                                className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 hover:border-red-100 hover:shadow-md transition-all cursor-pointer group"
                                                onClick={() => {
                                                    if (activeTab === 'sent') {
                                                        setSelectedInvitation(invite);
                                                        setIsGuestListOpen(true);
                                                    } else {
                                                        router.push(`/invitations/${invite.id}`);
                                                    }
                                                }}
                                            >
                                                <div className="flex gap-4">
                                                    {/* Thumbnail */}
                                                    <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden relative flex-shrink-0">
                                                        {(invite.image_urls && invite.image_urls.length > 0) ? (
                                                            <NextImage src={invite.image_urls[0]} alt={invite.title} fill className="object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                <Sparkles size={16} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-gray-900 truncate mb-1 group-hover:text-[#E74C3C] transition-colors">{invite.title}</h3>
                                                        <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                                                            <Calendar size={12} />
                                                            {new Date(invite.event_date).toLocaleDateString()}
                                                        </p>

                                                        {activeTab === 'sent' && (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-bold bg-green-50 text-green-600 px-2 py-0.5 rounded-lg">
                                                                    참석 {invite.guests?.filter((g: any) => g.status === 'accepted').length || 0}
                                                                </span>
                                                                <span className="text-[10px] font-bold bg-gray-50 text-gray-500 px-2 py-0.5 rounded-lg">
                                                                    전체 {invite.guests?.length || 0}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
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
        </div>
    );
}
