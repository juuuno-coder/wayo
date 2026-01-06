"use client";

import { useEffect, useState } from "react";
import GabojagoSignup from "./GabojagoSignup";
import WayoSignup from "./WayoSignup";

export default function SignupPage() {
  const [isGabojago, setIsGabojago] = useState<boolean | null>(null);

  useEffect(() => {
    const hostname = window.location.hostname;
    setIsGabojago(hostname.includes("gabojago"));
  }, []);

  if (isGabojago === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return isGabojago ? <GabojagoSignup /> : <WayoSignup />;
}
