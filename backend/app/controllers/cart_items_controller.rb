class CartItemsController < ApplicationController
  before_action :authenticate_user!

  # 장바구니 목록 조회
  def index
    @cart_items = current_user.cart_items.includes(:item)
    
    cart_data = @cart_items.map do |cart_item|
      {
        id: cart_item.id,
        quantity: cart_item.quantity,
        item: cart_item.item
      }
    end
    
    render json: cart_data
  end

  # 장바구니에 추가
  def create
    item = Item.find(params[:item_id])
    cart_item = current_user.cart_items.find_or_initialize_by(item: item)
    
    if cart_item.new_record?
      cart_item.quantity = params[:quantity] || 1
    else
      cart_item.quantity += (params[:quantity] || 1).to_i
    end
    
    if cart_item.save
      render json: { message: '장바구니에 추가되었습니다', cart_item: cart_item }, status: :created
    else
      render json: { errors: cart_item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # 수량 변경
  def update
    cart_item = current_user.cart_items.find(params[:id])
    
    if cart_item.update(quantity: params[:quantity])
      render json: cart_item
    else
      render json: { errors: cart_item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # 장바구니에서 삭제
  def destroy
    cart_item = current_user.cart_items.find(params[:id])
    cart_item.destroy
    
    render json: { message: '삭제되었습니다' }
  end
end
