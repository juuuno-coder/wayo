class UsersController < ApplicationController
  before_action :authenticate_user!

  def update
    if current_user.update(user_params)
      render json: current_user
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    render json: current_user
  end

  def me
    render json: current_user
  end

  def search
    if params[:query].blank?
      render json: []
      return
    end

    query = params[:query].downcase
    # Search by nickname or email (partial match), excluding current user
    @users = User.where("LOWER(nickname) LIKE ? OR LOWER(email) LIKE ?", "%#{query}%", "%#{query}%")
                 .where.not(id: current_user.id)
                 .limit(10)
                 
    render json: @users.as_json(only: [:id, :nickname, :email, :location])
  end

  private

  def user_params
    params.require(:user).permit(:nickname, :location, :interests)
  end
end
