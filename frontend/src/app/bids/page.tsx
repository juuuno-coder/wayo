"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Bid {
  id: number;
  title: string;
  agency?: string;
  deadline?: string;
  status?: string;
}

export default function BidsPage() {
  const router = useRouter();
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/bids`);
      if (res.ok) {
        setBids(await res.json());
      } else {
        console.error("Failed to fetch bids", res.status);
      }
    } catch (err) {
      console.error("Error fetching bids:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-full pb-24">
      <header className="sticky top-0 bg-white z-40 px-6 py-4 border-b border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold">입찰/조달 정보</h1>
      </header>

      <main className="px-6 py-6">
        {loading ? (
          <div className="flex justify-center py-10">로딩중...</div>
        ) : bids.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            조회된 입찰정보가 없습니다.
          </div>
        ) : (
          <ul className="space-y-4">
            {bids.map((b) => (
              <li
                key={b.id}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition"
                onClick={() => router.push(`/bids/${b.id}`)}
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {b.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {b.agency || "주관기관 정보 없음"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      마감: {b.deadline || "-"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      상태: {b.status || "-"}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
