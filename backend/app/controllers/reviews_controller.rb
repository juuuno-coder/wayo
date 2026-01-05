class ReviewsController < ApplicationController
  before_action :authenticate_user!, only: [:create]

  # 리뷰 목록
  def index
    reviewable = find_reviewable
    return render json: { error: 'Invalid resource' }, status: :bad_request unless reviewable

    @reviews = reviewable.reviews.includes(:user).order(created_at: :desc)
    
    reviews_data = @reviews.map do |review|
      {
        id: review.id,
        rating: review.rating,
        content: review.content,
        created_at: review.created_at,
        user_email: review.user.email
      }
    end
    
    render json: reviews_data
  end

  # 리뷰 작성
  def create
    reviewable = find_reviewable
    return render json: { error: 'Invalid resource' }, status: :bad_request unless reviewable

    review = current_user.reviews.build(
      reviewable: reviewable,
      rating: params[:rating],
      content: params[:content]
    )
    
    if review.save
      render json: { message: '리뷰가 등록되었습니다', review: review }, status: :created
    else
      render json: { errors: review.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def find_reviewable
    if params[:item_id]
      Item.find(params[:item_id])
    elsif params[:event_id]
      Event.find(params[:event_id])
    end
  end
end
