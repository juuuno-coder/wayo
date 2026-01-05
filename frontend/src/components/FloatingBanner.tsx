"use client";

import { X } from "lucide-react";
import { useState } from "react";

export default function FloatingBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed lg:absolute bottom-24 left-0 right-0 w-full px-4 z-40 lg:max-w-none lg:translate-x-0">
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl px-6 py-4 shadow-2xl flex items-center justify-between">
        <div className="flex-1">
          <p className="font-bold text-lg mb-1">🎉 신규 이벤트 등록!</p>
          <p className="text-sm text-white/90">지금 바로 확인해보세요</p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors shrink-0"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
