class OrdersController < ApplicationController
  before_action :authenticate_user!

  # 주문 목록 조회
  def index
    @orders = current_user.orders.includes(order_items: :item).order(created_at: :desc)
    
    orders_data = @orders.map do |order|
      {
        id: order.id,
        total_price: order.total_price,
        status: order.status,
        shipping_address: order.shipping_address,
        created_at: order.created_at,
        items: order.order_items.map do |order_item|
          {
            id: order_item.id,
            quantity: order_item.quantity,
            price: order_item.price,
            item: order_item.item
          }
        end
      }
    end
    
    render json: orders_data
  end

  # 주문 상세 조회
  def show
    @order = current_user.orders.includes(order_items: :item).find(params[:id])
    
    order_data = {
      id: @order.id,
      total_price: @order.total_price,
      status: @order.status,
      shipping_address: @order.shipping_address,
      created_at: @order.created_at,
      items: @order.order_items.map do |order_item|
        {
          id: order_item.id,
          quantity: order_item.quantity,
          price: order_item.price,
          item: order_item.item
        }
      end
    }
    
    render json: order_data
  end

  # 주문 생성 (장바구니에서)
  def create
    # 장바구니 아이템 가져오기
    cart_items = current_user.cart_items.includes(:item)
    
    if cart_items.empty?
      render json: { error: '장바구니가 비어있습니다' }, status: :unprocessable_entity
      return
    end
    
    # 총 금액 계산
    total_price = cart_items.sum { |ci| ci.item.price * ci.quantity }
    
    order = current_user.orders.build(
      total_price: total_price,
      status: 'pending',
      shipping_address: params[:shipping_address],
      buyer_name: params[:buyer_name] || current_user.nickname,
      buyer_phone: params[:buyer_phone]
    )
    
    if order.save
      # 주문 아이템 생성
      cart_items.each do |cart_item|
        order.order_items.create!(
          item: cart_item.item,
          quantity: cart_item.quantity,
          price: cart_item.item.price
        )
      end
      
      # 장바구니 비우기 (결제 성공 후 비울지 여기서 비울지 선택 - 보통 결제 시작 단계에서 비우면 위험하므로 추후 로직 검토 필요)
      # cart_items.destroy_all
      
      render json: { 
        message: '주문이 생성되었습니다.', 
        order_id: order.id,
        merchant_uid: order.merchant_uid,
        amount: order.total_price,
        buyer_email: current_user.email,
        buyer_name: order.buyer_name || "고객님",
        buyer_tel: order.buyer_phone || "010-0000-0000"
      }, status: :created
    else
      render json: { errors: order.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
