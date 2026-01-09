"use client";

import { X, Edit2, Users, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InvitationActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    invitation: any;
    onEdit: () => void;
    onViewGuests: () => void;
    onViewInvitation: () => void;
}

export default function InvitationActionModal({
    isOpen,
    onClose,
    invitation,
    onEdit,
    onViewGuests,
    onViewInvitation,
}: InvitationActionModalProps) {
    if (!isOpen) return null;

    const actions = [
        {
            icon: Edit2,
            label: "수정하기",
            description: "초대장 내용을 수정합니다",
            color: "from-blue-500 to-blue-600",
            hoverColor: "hover:from-blue-600 hover:to-blue-700",
            onClick: onEdit,
        },
        {
            icon: Users,
            label: "게스트 목록 보기",
            description: "참석자 현황을 확인합니다",
            color: "from-green-500 to-green-600",
            hoverColor: "hover:from-green-600 hover:to-green-700",
            onClick: onViewGuests,
        },
        {
            icon: Eye,
            label: "초대장 보기",
            description: "완성된 초대장을 확인합니다",
            color: "from-purple-500 to-purple-600",
            hoverColor: "hover:from-purple-600 hover:to-purple-700",
            onClick: onViewInvitation,
        },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
                    >
                        {/* Header */}
                        <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
                            >
                                <X size={20} />
                            </button>
                            <h2 className="text-2xl font-black text-gray-900 mb-2">
                                {invitation?.title || "초대장"}
                            </h2>
                            <p className="text-sm text-gray-500">
                                원하는 작업을 선택해주세요
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="p-6 space-y-3">
                            {actions.map((action, index) => (
                                <motion.button
                                    key={action.label}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => {
                                        action.onClick();
                                        onClose();
                                    }}
                                    className={`w-full bg-gradient-to-r ${action.color} ${action.hoverColor} text-white rounded-2xl p-5 flex items-center gap-4 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 group`}
                                >
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                        <action.icon size={24} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="font-bold text-lg mb-1">{action.label}</p>
                                        <p className="text-sm text-white/80">{action.description}</p>
                                    </div>
                                    <div className="text-white/60 group-hover:text-white transition-colors">
                                        →
                                    </div>
                                </motion.button>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-6 pt-0">
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                취소
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
