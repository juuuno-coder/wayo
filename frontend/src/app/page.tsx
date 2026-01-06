"use client";

import { useEffect, useState } from "react";
import WayoHome from "@/components/home/WayoHome";
import GabojagoHome from "@/components/home/GabojagoHome";

export default function Home() {
  const [isGabojago, setIsGabojago] = useState<boolean | null>(null);

  useEffect(() => {
    // Simple domain check
    // If hostname includes 'gabojago', render GabojagoHome
    // Otherwise (wayo.co.kr or others), render WayoHome
    const hostname = window.location.hostname;
    setIsGabojago(hostname.includes("gabojago"));
  }, []);

  if (isGabojago === null) {
    // Loading State: You can replace this with a nice spinner
    // This prevents hydration mismatch by rendering nothing initially on server
    // and then rendering the correct component on client.
    return null;
  }

  return isGabojago ? <GabojagoHome /> : <WayoHome />;
}
