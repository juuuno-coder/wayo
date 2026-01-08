class GuestsController < ApplicationController
  before_action :authenticate_user!, only: [:update, :claim]

  # GET /invitations/:invitation_id/guests
  def index
    invitation = Invitation.find(params[:invitation_id])
    render json: invitation.guests
  end

  # POST /invitations/:invitation_id/guests
  def create
    invitation = Invitation.find(params[:invitation_id])
    
    # Check if user is logged in (optional) through Devise
    # current_user will be available if token is valid
    
    guest = invitation.guests.new(guest_params)
    guest.user = current_user if user_signed_in?

    if guest.save
      render json: guest, status: :created
    else
      render json: guest.errors, status: :unprocessable_entity
    end
  end

  # POST /guests/:id/claim
  def claim
    return render json: { error: 'Not authenticated' }, status: :unauthorized unless user_signed_in?

    guest = Guest.find(params[:id])

    # Only allow claiming if currently unassigned
    if guest.user_id.nil?
      if guest.update(user_id: current_user.id)
        render json: { message: 'Guest record claimed successfully', guest: guest }, status: :ok
      else
        render json: guest.errors, status: :unprocessable_entity
      end
    elsif guest.user_id == current_user.id
      render json: { message: 'Already claimed' }, status: :ok
    else
      render json: { error: 'Guest record already belongs to another user' }, status: :forbidden
    end
  end

  private

  def guest_params
    params.require(:guest).permit(:name, :message, :status, :ticket_id)
  end
end
