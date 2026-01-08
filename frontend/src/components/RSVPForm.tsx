"use client";

import { useState } from "react";
import { Check, X, Clock, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import Toast from "./Toast";
import { API_BASE_URL } from "@/config";

interface RSVPFormProps {
    invitationId: number;
    guestId: number;
    currentStatus: string;
    currentMessage?: string;
    onUpdate: () => void;
}

export default function RSVPForm({
    invitationId,
    guestId,
    currentStatus,
    currentMessage = "",
    onUpdate,
}: RSVPFormProps) {
    const [status, setStatus] = useState(currentStatus);
    const [message, setMessage] = useState(currentMessage);
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");

            const res = await fetch(
                `${API_BASE_URL}/invitations/${invitationId}/guests/${guestId}/rsvp`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status, message }),
                }
            );

            if (res.ok) {
                setToastMessage("참석 의사가 업데이트되었습니다!");
                setShowToast(true);
                onUpdate();
            } else {
                const error = await res.json();
                setToastMessage(error.error || "업데이트에 실패했습니다");
                setShowToast(true);
            }
        } catch (error) {
            console.error("Failed to update RSVP:", error);
            setToastMessage("서버 오류가 발생했습니다");
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    const statusOptions = [
        {
            value: "accepted",
            label: "참석합니다",
            icon: <Check size={20} />,
            color: "border-green-500 bg-green-50 text-green-700",
            activeColor: "ring-2 ring-green-500 bg-green-100",
        },
        {
            value: "declined",
            label: "불참합니다",
            icon: <X size={20} />,
            color: "border-red-500 bg-red-50 text-red-600",
            activeColor: "ring-2 ring-red-500 bg-red-100",
        },
        {
            value: "pending",
            label: "아직 미정입니다",
            icon: <Clock size={20} />,
            color: "border-gray-300 bg-gray-50 text-gray-600",
            activeColor: "ring-2 ring-gray-400 bg-gray-100",
        },
    ];

    const hasChanges = status !== currentStatus || message !== currentMessage;

    return (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">참석 의사를 알려주세요</h3>
            <p className="text-sm text-gray-500 mb-6">
                현재 상태:{" "}
                <span className="font-bold">
                    {statusOptions.find((opt) => opt.value === currentStatus)?.label}
                </span>
            </p>

            {/* Status Selection */}
            <div className="space-y-3 mb-6">
                {statusOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setStatus(option.value)}
                        className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${status === option.value
                            ? `${option.color} ${option.activeColor}`
                            : "border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${status === option.value ? "bg-white shadow-sm" : "bg-gray-100"
                                }`}
                        >
                            {option.icon}
                        </div>
                        <span className="font-bold text-lg">{option.label}</span>
                        {status === option.value && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="ml-auto"
                            >
                                <Check size={24} className="text-current" />
                            </motion.div>
                        )}
                    </button>
                ))}
            </div>

            {/* Message Input */}
            <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <MessageSquare size={16} />
                    메시지 (선택사항)
                </label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="호스트에게 전할 메시지를 입력해주세요"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
                    rows={3}
                />
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={!hasChanges || loading}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${hasChanges && !loading
                    ? "bg-blue-500 text-white hover:bg-blue-600 active:scale-95 shadow-lg shadow-blue-200"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
            >
                {loading ? "저장 중..." : hasChanges ? "변경사항 저장하기" : "변경사항 없음"}
            </button>

            {/* Toast Notification */}
            <Toast
                message={toastMessage}
                type="success"
                isVisible={showToast}
                onClose={() => setShowToast(false)}
                duration={3000}
            />
        </div>
    );
}
