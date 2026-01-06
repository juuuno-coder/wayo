import { Share2, Megaphone, Send, CalendarPlus, CheckCircle2 } from "lucide-react";
import InvitationRSVPForm from "@/components/InvitationRSVPForm";
import { useRouter } from "next/navigation";

interface InvitationFooterProps {
    id: string;
    isCreator: boolean;
    hasResponded: boolean;
    myTicket: any;
    onShare: () => void;
    onAddToCalendar: () => void;
    onShowSendModal: () => void;
    setHasResponded: (val: boolean) => void;
    setMyTicket: (ticket: any) => void;
    setShowSignupModal: (val: boolean) => void;
}

export default function InvitationFooter({
    id,
    isCreator,
    hasResponded,
    myTicket,
    onShare,
    onAddToCalendar,
    onShowSendModal,
    setHasResponded,
    setMyTicket,
    setShowSignupModal
}: InvitationFooterProps) {
    const router = useRouter();

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
                <button
                    onClick={onAddToCalendar}
                    className="w-full py-4 bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                >
                    <CalendarPlus size={20} /> 가보자고 캘린더에 일정 등록
                </button>
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
                            }}
                        />
                    </div>
                ) : (
                    <div className="text-center py-6 animate-in zoom-in">
                        <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
                        <p className="font-bold text-gray-900 text-lg">참석이 확인되었습니다!</p>
                        <p className="text-gray-500 mt-2 text-sm mb-6">소중한 발걸음 기다리겠습니다.</p>

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
