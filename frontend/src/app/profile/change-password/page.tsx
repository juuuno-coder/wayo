"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Lock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Inter } from "next/font/google";
import { API_BASE_URL } from "@/config";
import { useAuth } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export default function ChangePasswordPage() {
    const router = useRouter();
    const { token } = useAuth();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
            setError("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        if (newPassword.length < 6) {
            setError("비밀번호는 최소 6자 이상이어야 합니다.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/users/update_password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                    new_password_confirmation: confirmPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/profile");
                }, 2000);
            } else {
                setError(data.errors?.[0] || "비밀번호 변경에 실패했습니다.");
            }
        } catch (err) {
            setError("네트워크 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`min-h-screen bg-[#FDFBF7] py-12 px-6 ${inter.className}`}>
            <div className="max-w-md mx-auto">
                <button
                    onClick={() => router.back()}
                    className="mb-8 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium"
                >
                    <ChevronLeft size={20} />
                    돌아가기
                </button>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">비밀번호 변경</h1>
                        <p className="text-gray-400 font-medium">계정 보안을 위해 비밀번호를 정기적으로 변경해 주세요.</p>
                    </div>

                    {success ? (
                        <div className="py-8 text-center">
                            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">변경 완료!</h2>
                            <p className="text-gray-500">잠시 후 프로필 페이지로 이동합니다.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">현재 비밀번호</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        required
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="현재 비밀번호를 입력하세요"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">새 비밀번호</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="새 비밀번호를 입력하세요"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">새 비밀번호 확인</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="새 비밀번호를 다시 입력하세요"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-[#E74C3C] text-white rounded-2xl font-bold shadow-lg shadow-red-100 hover:bg-[#D44333] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        변경 중...
                                    </>
                                ) : (
                                    "비밀번호 변경하기"
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
