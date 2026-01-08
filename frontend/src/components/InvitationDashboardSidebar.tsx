import React from "react";
import {
    Users,
    Link,
    Edit,
    BarChart3,
    Settings,
    ArrowLeft
} from "lucide-react";

interface InvitationDashboardSidebarProps {
    invitation: any;
    guests: any[];
    onShare: () => void;
    onEdit: () => void;
}

export default function InvitationDashboardSidebar({
    invitation,
    guests,
    onShare,
    onEdit
}: InvitationDashboardSidebarProps) {
    const acceptedCount = guests.filter(g => g.status === 'accepted').length;
    const pendingCount = guests.filter(g => g.status === 'pending').length;

    return (
        <div className="w-[360px] bg-white border-r border-gray-100 flex flex-col h-screen z-50">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <button
                    onClick={() => window.location.href = '/invitations/manage'}
                    className="flex items-center text-gray-400 hover:text-gray-900 transition-colors mb-6 text-sm font-medium"
                >
                    <ArrowLeft size={16} className="mr-1" />
                    Back to List
                </button>
                <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-[10px] font-bold uppercase tracking-wider">Creator Mode</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                    나의 초대장 관리
                </h2>
            </div>

            {/* Main Actions */}
            <div className="p-6 grid grid-cols-2 gap-3 border-b border-gray-100">
                <button
                    onClick={onShare}
                    className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors gap-2"
                >
                    <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-blue-500">
                        <Link size={20} />
                    </div>
                    <span className="text-xs font-bold text-gray-600">링크 공유</span>
                </button>
                <button
                    onClick={onEdit}
                    className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors gap-2"
                >
                    <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-900">
                        <Edit size={20} />
                    </div>
                    <span className="text-xs font-bold text-gray-600">수정하기</span>
                </button>
            </div>

            {/* Stats Overview */}
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <BarChart3 size={14} />
                    Overview
                </h3>
                <div className="flex items-center gap-4">
                    <div className="flex-1 p-4 bg-gray-50 rounded-2xl">
                        <p className="text-gray-400 text-xs mb-1">참석 확정</p>
                        <p className="text-2xl font-bold text-gray-900">{acceptedCount}명</p>
                    </div>
                    <div className="flex-1 p-4 bg-gray-50 rounded-2xl">
                        <p className="text-gray-400 text-xs mb-1">확인 대기</p>
                        <p className="text-2xl font-bold text-gray-900">{pendingCount}명</p>
                    </div>
                </div>
            </div>

            {/* Guest Management (Preview) */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <Users size={14} />
                        Recent Guests
                    </h3>
                    <span className="text-xs text-gray-400">{guests.length} total</span>
                </div>

                <div className="space-y-3">
                    {guests.length > 0 ? (
                        guests.slice(0, 5).map((guest, idx) => (
                            <div key={idx} className="flex items-center p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${guest.status === 'accepted' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                    {guest.name[0]}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-900">{guest.name}</p>
                                    <p className="text-xs text-gray-400 truncate max-w-[150px]">{guest.message || "메시지 없음"}</p>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${guest.status === 'accepted' ? 'bg-green-500' : 'bg-gray-300'}`} />
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-300 text-sm">
                            아직 참석자가 없습니다.
                        </div>
                    )}
                </div>

                {guests.length > 5 && (
                    <button className="w-full mt-4 py-3 text-sm font-bold text-gray-500 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        전체 보기
                    </button>
                )}
            </div>

            {/* Bottom Info */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Settings size={12} />
                    <span>Invitation Settings</span>
                </div>
            </div>
        </div>
    );
}
