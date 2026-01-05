class InvitationGuestsController < ApplicationController
  before_action :authenticate_user!
  skip_before_action :authenticate_user!, only: [:index, :create]
  before_action :set_invitation, only: [:index, :create]

  # GET /invitations/:invitation_id/guests
  def index
    @guests = @invitation.invitation_guests.includes(:ticket)
    render json: @guests.as_json(include: { ticket: { only: [:id, :qr_code, :status] } })
  end

  # POST /invitations/:invitation_id/guests
  def create
    # 이미 참여한 경우 체크 (회원인 경우)
    if current_user
      existing = @invitation.invitation_guests.find_by(user: current_user)
      return render json: existing if existing
    end

    @guest = @invitation.invitation_guests.build(guest_params)
    @guest.user = current_user if current_user
    @guest.status = 'attending' # Default status

    if @guest.save
      # Issue a ticket if the invitation is linked to a ticket type and status is attending
      if @invitation.ticket_type && @guest.status == 'attending'
        Ticket.create!(
          ticket_type: @invitation.ticket_type,
          user: current_user,
          invitation_guest: @guest,
          status: 'active'
        )
      end
      
      render json: @guest.as_json(include: { ticket: { only: [:id, :qr_code, :status] } }), status: :created
    else
      render json: @guest.errors, status: :unprocessable_content
    end
  end

  private

  def set_invitation
    @invitation = Invitation.find(params[:invitation_id])
  end

  def guest_params
    params.require(:guest).permit(:name, :message, :status)
  end
end
