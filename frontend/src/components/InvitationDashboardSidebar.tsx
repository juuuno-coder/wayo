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
    viewCount?: number;
    onShare: () => void;
    onEdit: () => void;
}

export default function InvitationDashboardSidebar({
    invitation,
    guests,
    viewCount = 0,
    onShare,
    onEdit
}: InvitationDashboardSidebarProps) {
    const [filter, setFilter] = React.useState<'all' | 'accepted' | 'declined' | 'pending'>('all');

    const acceptedCount = guests.filter(g => g.status === 'accepted').length;
    const declinedCount = guests.filter(g => g.status === 'declined').length;
    const filteredGuests = filter === 'all' ? guests : guests.filter(g => g.status === filter);

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
                <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 bg-gray-50 rounded-2xl flex flex-col items-center">
                        <p className="text-gray-400 text-[10px] mb-1">조회수</p>
                        <p className="text-lg font-bold text-gray-900">{viewCount}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-2xl flex flex-col items-center">
                        <p className="text-green-600 text-[10px] mb-1">참석</p>
                        <p className="text-lg font-bold text-green-700">{acceptedCount}</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-2xl flex flex-col items-center">
                        <p className="text-red-600 text-[10px] mb-1">불참</p>
                        <p className="text-lg font-bold text-red-700">{declinedCount}</p>
                    </div>
                </div>
            </div>

            {/* Guest Management (Preview) */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <Users size={14} />
                        Guest List
                    </h3>
                    <span className="text-xs text-gray-400">{guests.length} total</span>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
                    {[
                        { id: 'all', label: '전체' },
                        { id: 'accepted', label: '참석' },
                        { id: 'declined', label: '불참' },
                        { id: 'pending', label: '대기' }
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id as any)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${filter === f.id
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="space-y-3">
                    {filteredGuests.length > 0 ? (
                        filteredGuests.map((guest, idx) => (
                            <div key={idx} className="flex items-center p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${guest.status === 'accepted' ? 'bg-green-100 text-green-600' :
                                        guest.status === 'declined' ? 'bg-red-100 text-red-600' :
                                            'bg-gray-100 text-gray-400'
                                    }`}>
                                    {guest.name[0]}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-900">{guest.name}</p>
                                    <p className="text-xs text-gray-400 truncate max-w-[150px]">{guest.message || "메시지 없음"}</p>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${guest.status === 'accepted' ? 'bg-green-500' :
                                        guest.status === 'declined' ? 'bg-red-500' :
                                            'bg-gray-300'
                                    }`} />
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-300 text-xs flex flex-col items-center">
                            <Users size={24} className="mb-2 opacity-50" />
                            해당하는 게스트가 없습니다.
                        </div>
                    )}
                </div>

                {guests.length > 100 && filter === 'all' && (
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
