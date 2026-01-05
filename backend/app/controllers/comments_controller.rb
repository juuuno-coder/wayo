class CommentsController < ApplicationController
  before_action :authenticate_user!
  
  def create
    @commentable = find_commentable
    @comment = @commentable.comments.build(comment_params)
    @comment.user = current_user
    
    if @comment.save
      render json: @comment.as_json(include: :user), status: :created
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @comment = current_user.comments.find(params[:id])
    @comment.destroy
    head :no_content
  end

  private

  def find_commentable
    if params[:post_id]
      Post.find(params[:post_id])
    elsif params[:event_id]
      Event.find(params[:event_id])
    end
  end

  def comment_params
    params.require(:comment).permit(:content, :parent_id, :comment_type)
  end
end
