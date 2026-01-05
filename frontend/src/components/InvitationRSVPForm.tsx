"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

interface InvitationRSVPFormProps {
    invitationId: string | number;
    onSuccess: (data: any) => void;
    className?: string;
}

export default function InvitationRSVPForm({ invitationId, onSuccess, className = "" }: InvitationRSVPFormProps) {
    const [name, setName] = useState("");
    const [contact, setContact] = useState(""); // Phone or Email
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim()) {
            alert("성함을 입력해주세요.");
            return;
        }
        if (!contact.trim()) {
            alert("연락처를 입력해주세요. (티켓/안내 발송용)");
            return;
        }

        setLoading(true);
        try {
            // Try to get auth token if user is logged in
            const token = localStorage.getItem("authToken");
            const headers: Record<string, string> = {
                "Content-Type": "application/json",
            };
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/invitations/${invitationId}/guests`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    guest: {
                        name,
                        contact,
                        message,
                        status: "attending",
                    },
                }),
            });

            if (res.ok) {
                const data = await res.json();
                // Save guest ID locally for recognition
                localStorage.setItem(`wayo_guest_${invitationId}`, String(data.id));
                onSuccess(data);
            } else {
                const err = await res.text();
                console.error(err);
                alert("오류가 발생했습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            console.error("RSVP Error:", error);
            alert("서버 통신 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Name</label>
                <input
                    type="text"
                    placeholder="성함"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none transition-all font-bold text-gray-900 placeholder:font-normal placeholder:text-gray-400"
                />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Contact</label>
                <input
                    type="text"
                    placeholder="연락처 (안내/티켓 발송용)"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none transition-all font-bold text-gray-900 placeholder:font-normal placeholder:text-gray-400"
                />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Message</label>
                <textarea
                    placeholder="전하고 싶은 말씀 (선택)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none transition-all h-24 resize-none text-gray-900 placeholder:text-gray-400"
                />
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        처리 중...
                    </>
                ) : (
                    <>
                        <CheckCircle2 size={20} />
                        참석 확인하기
                    </>
                )}
            </button>
            <p className="text-[11px] text-gray-400 text-center">
                * 제출 시 행사 호스트에게 알림이 전송됩니다.
            </p>
        </div>
    );
}
