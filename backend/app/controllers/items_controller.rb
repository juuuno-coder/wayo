class ItemsController < ApplicationController
  # API 모드이므로 CSRF 토큰 비활성화 (필요시) 또는 skip_before_action
  # devise_jwt 등을 쓰고 있다면 인증이 필요 없는 public API로 설정
  
  def index
    # 최신순 정렬
    @items = Item.all.order(created_at: :desc)
    render json: @items
  end

  def show
    @item = Item.find(params[:id])
    
    # 리뷰 정보 포함
    item_data = @item.as_json.merge(
      average_rating: @item.reviews.average(:rating)&.round(1) || 0,
      review_count: @item.reviews.count,
      reviews: @item.reviews.includes(:user).order(created_at: :desc).limit(5).map do |review|
        {
          id: review.id,
          rating: review.rating,
          content: review.content,
          created_at: review.created_at,
          user_email: review.user.email
        }
      end
    )
    
    render json: item_data
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Item not found' }, status: :not_found
  end

  def search
    query = params[:q]
    if query.present?
      # SQLite에서는 LIKE, Postgres에서는 ILIKE 사용 (여기선 개발용이므로 LIKE)
      @items = Item.where("title LIKE ? OR description LIKE ?", "%#{query}%", "%#{query}%")
    else
      @items = []
    end
    render json: @items
  end
end
