"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Black_Han_Sans } from "next/font/google";
import { ChevronLeft, Sparkles, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const blackHanSans = Black_Han_Sans({ weight: "400", subsets: ["latin"] });

interface WayoHeaderProps {
    showBackButton?: boolean;
    title?: string;
    currentPage?: 'features' | 'faq' | 'manage' | 'profile' | 'create' | 'support';
}

export default function WayoHeader({ showBackButton = false, title, currentPage }: WayoHeaderProps) {
    const router = useRouter();
    const { isLoggedIn, user } = useAuth();

    return (
        <nav className="sticky top-0 w-full z-50 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {showBackButton && (
                        <button
                            onClick={() => router.back()}
                            className="p-2 -ml-2 hover:bg-gray-50 rounded-full text-gray-600 transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </button>
                    )}
                    <Link href="/" className={`text-2xl text-[#E74C3C] tracking-tighter ${blackHanSans.className}`}>
                        WAYO
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-widest opacity-60">
                        <Link
                            href="/features"
                            className={`hover:text-[#E74C3C] transition-colors ${currentPage === 'features' ? 'text-[#E74C3C]' : ''}`}
                        >
                            Features
                        </Link>
                        <Link
                            href="/faq"
                            className={`hover:text-[#E74C3C] transition-colors ${currentPage === 'faq' ? 'text-[#E74C3C]' : ''}`}
                        >
                            FAQ
                        </Link>
                        <Link
                            href="/support"
                            className={`hover:text-[#E74C3C] transition-colors ${currentPage === 'support' ? 'text-[#E74C3C]' : ''}`}
                        >
                            Support
                        </Link>
                    </div>

                    {isLoggedIn && user ? (
                        <>
                            <button
                                onClick={() => router.push('/invitations/manage')}
                                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${
                                    currentPage === 'manage'
                                        ? 'bg-[#E74C3C] text-white shadow-lg shadow-red-200'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <LayoutDashboard size={16} />
                                초대장 관리
                            </button>
                            <button
                                onClick={() => router.push('/profile')}
                                className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#E74C3C] flex items-center justify-center text-white font-bold text-sm shadow-md">
                                    {user.nickname?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <span className="text-sm font-bold text-gray-700 hidden lg:inline-block">
                                    {user.nickname || user.email?.split('@')[0]}
                                </span>
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => router.push('/login')}
                            className="px-6 py-2 rounded-full border border-[#E74C3C]/20 text-sm font-bold hover:bg-[#E74C3C] hover:text-white transition-all active:scale-95"
                        >
                            Login
                        </button>
                    )}

                    <button
                        onClick={() => router.push('/invitations/create')}
                        className="px-6 py-2 bg-[#E74C3C] text-white rounded-full text-sm font-bold hover:bg-[#C0392B] transition-all active:scale-95 shadow-lg shadow-red-200 flex items-center gap-2"
                    >
                        <Sparkles size={16} />
                        <span className="hidden sm:inline">초대장 만들기</span>
                        <span className="sm:hidden">만들기</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
