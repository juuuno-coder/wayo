"use client";

import { useEffect, useState } from "react";
import GabojagoLogin from "./GabojagoLogin";
import WayoLogin from "./WayoLogin";

export default function LoginPage() {
  const [isGabojago, setIsGabojago] = useState<boolean | null>(null);

  useEffect(() => {
    const hostname = window.location.hostname;
    // 'gabojago'가 포함된 도메인이면 GabojagoLogin 렌더링
    setIsGabojago(hostname.includes("gabojago"));
  }, []);

  // Hydration 이슈 방지를 위해 초기 로딩 시 아무것도 렌더링하지 않거나 로딩 스피너 표시
  if (isGabojago === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return isGabojago ? <GabojagoLogin /> : <WayoLogin />;
}
