class FeedsController < ApplicationController
  before_action :authenticate_user!

  def index
    # 1. 내가 쓴 댓글에 달린 답글 (Replies to my comments)
    my_comment_ids = current_user.comments.pluck(:id)
    replies = Comment.where(parent_id: my_comment_ids)
                     .where.not(user_id: current_user.id) # 내가 단 답글 제외
                     .includes(:user, :commentable)

    # 2. 내가 좋아요 누른 행사의 최신 기대글 (New cheers for events I liked)
    liked_event_ids = current_user.likes.where(likeable_type: 'Event').pluck(:likeable_id)
    event_comments = Comment.where(commentable_type: 'Event', commentable_id: liked_event_ids)
                            .where.not(user_id: current_user.id) # 내 글 제외
                            .includes(:user, :commentable)

    # 3. 데이터 통합 및 정렬 (Combine and Sort)
    feed_items = []

    replies.each do |r|
      feed_items << {
        type: 'reply',
        id: "reply-#{r.id}",
        user: { email: r.user.email.split('@').first },
        content: r.content,
        created_at: r.created_at,
        original_comment: r.parent.content,
        event_title: r.commentable_type == 'Event' ? r.commentable.title : (r.commentable.respond_to?(:title) ? r.commentable.title : '게시글'),
        target_id: r.commentable_id,
        target_type: r.commentable_type
      }
    end

    event_comments.each do |c|
      feed_items << {
        type: 'event_cheer',
        id: "cheer-#{c.id}",
        user: { email: c.user.email.split('@').first },
        content: c.content,
        created_at: c.created_at,
        event_title: c.commentable.title,
        event_image: c.commentable.image_url,
        comment_type: c.comment_type, # 'cheer', 'ticket_proof', etc.
        target_id: c.commentable_id,
        target_type: 'Event'
      }
    end

    # 최신순 정렬
    sorted_feed = feed_items.sort_by { |item| item[:created_at] }.reverse

    render json: sorted_feed
  end
end
