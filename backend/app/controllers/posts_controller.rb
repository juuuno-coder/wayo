class PostsController < ApplicationController
  before_action :authenticate_user!, only: [:create]
  
  def index
    @posts = Post.includes(:user).order(created_at: :desc)
    render json: @posts.as_json(include: { user: { only: [:id, :email] } }, methods: :comments_count)
  end

  def show
    @post = Post.includes(comments: [:user, :replies]).find(params[:id])
    render json: @post.as_json(include: { 
      user: { only: [:id, :email] },
      comments: { 
        include: { 
          user: { only: [:id, :email] },
          replies: { include: { user: { only: [:id, :email] } } }
        }
      }
    })
  end

  def create
    @post = current_user.posts.build(post_params)
    if @post.save
      render json: @post, status: :created
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  private

  def post_params
    params.require(:post).permit(:title, :content, :category, :image_url)
  end
end
