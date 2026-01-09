class UsersController < ApplicationController
  before_action :authenticate_user!

  def update
    if current_user.update(user_params)
      render json: current_user
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update_password
    if current_user.valid_password?(params[:current_password])
      if current_user.update(password: params[:new_password], password_confirmation: params[:new_password_confirmation])
        render json: { message: "비밀번호가 성공적으로 변경되었습니다." }
      else
        render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { errors: ["현재 비밀번호가 일치하지 않습니다."] }, status: :unauthorized
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
