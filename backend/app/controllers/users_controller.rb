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

  private

  def user_params
    params.require(:user).permit(:nickname, :location, :interests)
  end
end
