"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
    message: string;
    type?: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export default function Toast({
    message,
    type = "info",
    isVisible,
    onClose,
    duration = 3000,
}: ToastProps) {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    const icons = {
        success: <CheckCircle size={20} className="text-green-500" />,
        error: <AlertCircle size={20} className="text-red-500" />,
        info: <Info size={20} className="text-blue-500" />,
    };

    const bgColors = {
        success: "bg-green-50 border-green-200",
        error: "bg-red-50 border-red-200",
        info: "bg-blue-50 border-blue-200",
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="fixed top-4 right-4 z-[9999] max-w-sm"
                >
                    <div
                        className={`${bgColors[type]} border rounded-2xl shadow-lg p-4 flex items-start gap-3`}
                    >
                        <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
                        <p className="flex-1 text-sm font-medium text-gray-800">{message}</p>
                        <button
                            onClick={onClose}
                            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
