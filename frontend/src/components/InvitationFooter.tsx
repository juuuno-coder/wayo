import { Share2, Megaphone, Send, CalendarPlus, CheckCircle2, Edit2 } from "lucide-react";
import InvitationRSVPForm from "@/components/InvitationRSVPForm";
import RSVPForm from "@/components/RSVPForm";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface InvitationFooterProps {
    id: string;
    isCreator: boolean;
    hasResponded: boolean;
    myTicket: any;
    myGuestId?: number;
    myGuestStatus?: string;
    myGuestMessage?: string;
    onShare: () => void;
    onAddToCalendar: () => void;
    onShowSendModal: () => void;
    setHasResponded: (val: boolean) => void;
    setMyTicket: (ticket: any) => void;
    setShowSignupModal: (val: boolean) => void;
    refreshGuests: () => void;
}

export default function InvitationFooter({
    id,
    isCreator,
    hasResponded,
    myTicket,
    myGuestId,
    myGuestStatus = "pending",
    myGuestMessage = "",
    onShare,
    onAddToCalendar,
    onShowSendModal,
    setHasResponded,
    setMyTicket,
    setShowSignupModal,
    refreshGuests
}: InvitationFooterProps) {
    const router = useRouter();
    const [isEditingRSVP, setIsEditingRSVP] = useState(false);

    return (
        <div className="p-8 space-y-8 border-t border-gray-50 bg-white">
            {/* Footer Actions */}
            <div className="flex gap-3">
                <button
                    onClick={onShare}
                    className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                >
                    <Share2 size={20} /> 링크 공유하기
                </button>
            </div>

            {isCreator ? (
                <div className="space-y-3">
                    <button
                        onClick={() => router.push('/')}
                        className="w-full py-4 bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-200"
                    >
                        <Megaphone size={20} /> 내 행사 가보자고에 홍보하기
                    </button>
                    <button
                        onClick={onShowSendModal}
                        className="w-full py-4 bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                    >
                        <Send size={20} /> 회원에게 보내기
                    </button>
                </div>
            ) : (
                <>
                    <button
                        onClick={onAddToCalendar}
                        className="w-full py-4 bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200 mb-4"
                    >
                        <CalendarPlus size={20} /> 가보자고 캘린더에 일정 등록
                    </button>

                    {/* Wayo Promotional Banner */}
                    <div
                        onClick={() => router.push('/')}
                        className="w-full bg-gradient-to-r from-[#E74C3C] to-[#c0392b] rounded-2xl p-6 cursor-pointer hover:shadow-xl transition-all group"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-white/80 text-xs font-bold mb-1">초대장을 만들고 싶으신가요?</p>
                                <h3 className="text-white text-xl font-black mb-2">와요~ 🎉</h3>
                                <p className="text-white/90 text-sm">무료로 나만의 초대장을 만들어보세요</p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                <span className="text-2xl">→</span>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* RSVP Form Section */}
            <div className="bg-[#FAFAFA] rounded-2xl p-6">
                {!hasResponded ? (
                    <div className="space-y-4">
                        <h3 className="text-center font-bold text-gray-900 mb-6">참석 여부를 알려주세요</h3>
                        <InvitationRSVPForm
                            invitationId={id}
                            onSuccess={(data) => {
                                setHasResponded(true);
                                if (data.ticket) setMyTicket(data.ticket);
                                if (!localStorage.getItem("authToken")) {
                                    setShowSignupModal(true);
                                }
                                refreshGuests();
                            }}
                        />
                    </div>
                ) : isEditingRSVP && myGuestId ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900">참석 의사 변경하기</h3>
                            <button
                                onClick={() => setIsEditingRSVP(false)}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                취소
                            </button>
                        </div>
                        <RSVPForm
                            invitationId={Number(id)}
                            guestId={myGuestId}
                            currentStatus={myGuestStatus}
                            currentMessage={myGuestMessage}
                            onUpdate={() => {
                                setIsEditingRSVP(false);
                                refreshGuests();
                            }}
                        />
                    </div>
                ) : (
                    <div className="text-center py-6 animate-in zoom-in">
                        <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
                        <p className="font-bold text-gray-900 text-lg">
                            {myGuestStatus === "accepted" ? "참석이 확인되었습니다!" :
                                myGuestStatus === "declined" ? "불참으로 확인되었습니다" :
                                    "응답이 등록되었습니다"}
                        </p>
                        <p className="text-gray-500 mt-2 text-sm mb-6">
                            {myGuestStatus === "accepted" ? "소중한 발걸음 기다리겠습니다." :
                                myGuestStatus === "declined" ? "다음 기회에 뵙겠습니다." :
                                    "참석 여부를 결정하시면 알려주세요."}
                        </p>

                        {/* Edit RSVP Button */}
                        {myGuestId && (
                            <button
                                onClick={() => setIsEditingRSVP(true)}
                                className="mb-6 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:border-gray-300 transition-all mx-auto"
                            >
                                <Edit2 size={18} /> 참석 의사 변경하기
                            </button>
                        )}

                        {myTicket && (
                            <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-xl max-w-xs mx-auto transform hover:scale-105 transition-transform">
                                <div className="text-xl font-black text-gray-900 mb-2 border-b-2 border-dashed border-gray-200 pb-2">
                                    GABOJAGO TICKET
                                </div>
                                <div className="bg-gray-100 p-2 rounded-lg mb-4">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${myTicket.qr_code}`}
                                        alt="QR Code"
                                        className="w-full aspect-square"
                                    />
                                </div>
                                <p className="text-xs font-mono text-gray-400 break-all">{myTicket.qr_code}</p>
                                <p className="text-sm font-bold text-blue-600 mt-2">입장 시 이 코드를 보여주세요!</p>
                            </div>
                        )}
                        {!myTicket && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <p className="text-blue-800 font-bold mb-2">✨ 더 편리하게 이용하세요</p>
                                <button onClick={() => router.push('/signup')} className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">가입하고 내 티켓 저장하기</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
