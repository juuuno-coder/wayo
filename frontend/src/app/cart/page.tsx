"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";

interface CartItem {
  id: number;
  quantity: number;
  item: {
    id: number;
    title: string;
    price: number;
    image_url: string;
  };
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
      fetchCart(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCart = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/cart_items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setCartItems(data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/cart_items/${cartItemId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (res.ok) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === cartItemId ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (cartItemId: number) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/cart_items/${cartItemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.item.price * item.quantity,
    0
  );

  const createOrder = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const address = prompt("배송지 주소를 입력해주세요:");
    if (!address) return;

    try {
      // 1. 주문 생성 API
      const orderRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shipping_address: address,
          buyer_phone: "010-1234-5678", // 임시
        }),
      });

      if (!orderRes.ok) {
        throw new Error("주문 생성 실패");
      }

      const orderData = await orderRes.json();
      const { merchant_uid, amount, buyer_email, buyer_name, buyer_tel } = orderData;

      // 2. 아임포트 결제 위젯 호출
      const { IMP } = window as any;
      if (!IMP) {
        alert("결제 채널을 불러오지 못했습니다. 새로고침 후 다시 시도해주세요.");
        return;
      }

      // 테스트용 가맹점 식별코드 (실제 사용 시 본인의 식별코드로 변경 필요)
      IMP.init("imp12345678");

      IMP.request_pay({
        pg: "html5_inicis", // PG사 (이니시스 테스트)
        pay_method: "card",
        merchant_uid: merchant_uid,
        name: cartItems.length > 1
          ? `${cartItems[0].item.title} 외 ${cartItems.length - 1}건`
          : cartItems[0].item.title,
        amount: amount,
        buyer_email: buyer_email,
        buyer_name: buyer_name,
        buyer_tel: buyer_tel,
        buyer_addr: address,
      }, async (rsp: any) => {
        if (rsp.success) {
          // 3. 결제 성공 시 서버 검증 및 저장
          try {
            const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/payments/verify`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                imp_uid: rsp.imp_uid,
                merchant_uid: rsp.merchant_uid,
                amount: amount,
                pay_method: rsp.pay_method,
                receipt_url: rsp.receipt_url
              }),
            });

            if (verifyRes.ok) {
              alert("✅ 결제가 완료되었습니다!");
              router.push("/orders"); // 주문 목록으로 이동
            } else {
              alert("❌ 결제 검증에 실패했습니다. 고객센터에 문의해주세요.");
            }
          } catch (e) {
            console.error("Verification Error:", e);
            alert("검증 중 오류가 발생했습니다.");
          }
        } else {
          alert(`❌ 결제 실패: ${rsp.error_msg}`);
        }
      });

    } catch (error) {
      console.error("Order/Payment Error:", error);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-24">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart size={40} className="text-blue-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          장바구니를 확인하세요
        </h2>
        <p className="text-gray-500 text-center mb-8">
          로그인하고 상품을 담아보세요!
        </p>
        <button
          onClick={() => router.push("/login")}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl active:scale-[0.98] transition-transform shadow-lg shadow-blue-500/20"
        >
          로그인하러 가기
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      <header className="bg-white px-6 py-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">장바구니</h1>
        <p className="text-sm text-gray-500 mt-1">
          {loading ? "불러오는 중..." : `총 ${cartItems.length}개 상품`}
        </p>
      </header>

      <div className="px-6 py-6">
        {loading ? (
          <div className="flex justify-center py-10">Loading...</div>
        ) : cartItems.length > 0 ? (
          <div className="space-y-4">
            {cartItems.map((cartItem) => (
              <div
                key={cartItem.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex gap-4">
                  <Link
                    href={`/items/${cartItem.item.id}`}
                    className="flex-shrink-0"
                  >
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                      <Image
                        src={cartItem.item.image_url}
                        alt={cartItem.item.title}
                        fill
                        className="object-cover rounded-xl"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/items/${cartItem.item.id}`}>
                        <h3 className="font-medium text-gray-900 line-clamp-2 leading-snug mb-1">
                          {cartItem.item.title}
                        </h3>
                      </Link>
                      <p className="text-lg font-bold text-gray-900">
                        {cartItem.item.price.toLocaleString()}원
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(cartItem.id, cartItem.quantity - 1)
                          }
                          className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 active:bg-gray-200"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(cartItem.id, cartItem.quantity + 1)
                          }
                          className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 active:bg-gray-200"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(cartItem.id)}
                        className="text-red-500 hover:text-red-600 p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <ShoppingCart size={64} className="mb-4 text-gray-200" />
            <p className="text-gray-500 font-medium">장바구니가 비어있어요</p>
            <p className="text-sm text-gray-400 mt-2">
              마음에 드는 상품을 담아보세요!
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl active:scale-[0.98] transition-transform"
            >
              상품 둘러보기
            </button>
          </div>
        )}
      </div>

      {/* 하단 고정 주문 바 */}
      {cartItems.length > 0 && (
        <div className="fixed lg:absolute bottom-20 w-full max-w-[480px] lg:max-w-none left-1/2 lg:left-0 -translate-x-1/2 lg:translate-x-0 bg-white border-t border-gray-100 p-4 pb-6 z-40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600">총 상품금액</span>
            <span className="text-2xl font-bold text-gray-900">
              {totalPrice.toLocaleString()}원
            </span>
          </div>
          <button
            onClick={createOrder}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl active:scale-[0.98] transition-transform shadow-lg shadow-blue-500/20"
          >
            주문하기
          </button>
        </div>
      )}
    </div>
  );
}
