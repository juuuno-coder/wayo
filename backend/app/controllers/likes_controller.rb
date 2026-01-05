class LikesController < ApplicationController
  before_action :authenticate_user! # Devise JWT 인증 필수

  def toggle
    likeable = find_likeable
    return render json: { error: 'Invalid resource' }, status: :bad_request unless likeable

    like = current_user.likes.find_by(likeable: likeable)

    if like
      like.destroy
      render json: { liked: false, message: 'Unliked' }
    else
      current_user.likes.create!(likeable: likeable)
      render json: { liked: true, message: 'Liked' }
    end
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def index
    # Return separated lists or a combined list. For now returning separated.
    # N+1 query optimization using includes
    likes = current_user.likes.includes(:likeable)
    
    liked_events = likes.select { |l| l.likeable_type == 'Event' }.map(&:likeable)
    liked_items = likes.select { |l| l.likeable_type == 'Item' }.map(&:likeable)

    render json: { 
      events: liked_events, 
      items: liked_items,
      count: likes.size
    }
  end

  private

  def find_likeable
    if params[:item_id]
      Item.find(params[:item_id])
    elsif params[:event_id]
      Event.find(params[:event_id])
    end
  end
end
