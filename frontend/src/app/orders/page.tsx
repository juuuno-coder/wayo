"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, ChevronRight } from "lucide-react";
import { API_BASE_URL } from "@/config";
import Link from "next/link";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  item: {
    id: number;
    title: string;
    image_url: string;
  };
}

interface Order {
  id: number;
  total_price: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

const statusText: Record<string, string> = {
  pending: '결제 대기',
  paid: '결제 완료',
  shipping: '배송 중',
  delivered: '배송 완료',
  cancelled: '취소됨'
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchOrders(token);
  }, [router]);

  const fetchOrders = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <header className="bg-white px-6 py-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">주문 내역</h1>
        <p className="text-sm text-gray-500 mt-1">
          {loading ? "불러오는 중..." : `총 ${orders.length}건`}
        </p>
      </header>

      <div className="px-6 py-6">
        {loading ? (
          <div className="flex justify-center py-10">Loading...</div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block bg-white rounded-2xl p-5 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('ko-KR')}
                    </p>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {order.total_price.toLocaleString()}원
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'shipping' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                    }`}>
                    {statusText[order.status] || order.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Package size={16} />
                  <span className="text-sm">
                    {order.items[0]?.item.title}
                    {order.items.length > 1 && ` 외 ${order.items.length - 1}건`}
                  </span>
                  <ChevronRight size={16} className="ml-auto" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Package size={64} className="mb-4 text-gray-200" />
            <p className="text-gray-500 font-medium">주문 내역이 없어요</p>
            <p className="text-sm text-gray-400 mt-2">상품을 주문해보세요!</p>
            <button
              onClick={() => router.push("/")}
              className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl active:scale-[0.98] transition-transform"
            >
              상품 둘러보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
