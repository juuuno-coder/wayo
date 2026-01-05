"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { MoveLeft, Package, Truck, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  item: {
    id: number;
    title: string;
    image_url: string;
    price: number;
  };
}

interface Order {
  id: number;
  total_price: number;
  status: string;
  shipping_address: string;
  created_at: string;
  items: OrderItem[];
}

const statusText: Record<string, string> = {
  pending: "결제 대기",
  paid: "결제 완료",
  shipping: "배송 중",
  delivered: "배송 완료",
  cancelled: "취소됨",
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }

    if (params?.id) {
      fetchOrder(token, params.id as string);
    }
  }, [params, router]);

  const fetchOrder = async (token: string, id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/orders/${id}`, {
        headers: {
          Authorization: token,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center">
        주문을 찾을 수 없습니다.
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* 상단 헤더 */}
      <header className="bg-white px-6 py-4 flex items-center gap-4 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <MoveLeft size={24} />
        </button>
        <h1 className="text-lg font-bold">주문 상세</h1>
      </header>

      {/* 주문 상태 */}
      <div className="bg-white px-6 py-8 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${order.status === "delivered"
                ? "bg-green-100"
                : order.status === "shipping"
                  ? "bg-blue-100"
                  : "bg-gray-100"
              }`}
          >
            {order.status === "shipping" || order.status === "delivered" ? (
              <Truck
                size={24}
                className={
                  order.status === "delivered"
                    ? "text-green-600"
                    : "text-blue-600"
                }
              />
            ) : (
              <Package size={24} className="text-gray-600" />
            )}
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {statusText[order.status]}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(order.created_at).toLocaleString("ko-KR")}
            </p>
          </div>
        </div>
      </div>

      {/* 배송지 정보 */}
      <div className="bg-white px-6 py-6 mt-2">
        <div className="flex items-start gap-3">
          <MapPin size={20} className="text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-gray-900 mb-1">배송지</p>
            <p className="text-gray-600">{order.shipping_address}</p>
          </div>
        </div>
      </div>

      {/* 주문 상품 */}
      <div className="bg-white px-6 py-6 mt-2">
        <h2 className="text-lg font-bold text-gray-900 mb-4">주문 상품</h2>
        <div className="space-y-4">
          {order.items.map((orderItem) => (
            <Link
              key={orderItem.id}
              href={`/items/${orderItem.item.id}`}
              className="flex gap-4"
            >
              <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                <Image
                  src={orderItem.item.image_url}
                  alt={orderItem.item.title}
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 line-clamp-2 leading-snug mb-1">
                  {orderItem.item.title}
                </h3>
                <p className="text-sm text-gray-500">
                  수량: {orderItem.quantity}개
                </p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {(orderItem.price * orderItem.quantity).toLocaleString()}원
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 결제 정보 */}
      <div className="bg-white px-6 py-6 mt-2">
        <h2 className="text-lg font-bold text-gray-900 mb-4">결제 정보</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>상품 금액</span>
            <span>{order.total_price.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>배송비</span>
            <span>무료</span>
          </div>
          <div className="h-px bg-gray-100 my-3" />
          <div className="flex justify-between text-xl font-bold text-gray-900">
            <span>총 결제 금액</span>
            <span>{order.total_price.toLocaleString()}원</span>
          </div>
        </div>
      </div>
    </div>
  );
}
