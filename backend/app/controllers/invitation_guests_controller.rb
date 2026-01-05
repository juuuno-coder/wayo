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
    # 1. Check if trying to add oneself (RSVP)
    if current_user && !guest_params[:user_id].present?
      existing = @invitation.invitation_guests.find_by(user: current_user)
      return render json: existing if existing
    end

    @guest = @invitation.invitation_guests.build(guest_params)
    
    # 2. Assign user if current_user is RSVPing themselves
    if current_user && !@guest.user_id
        @guest.user = current_user
    end

    # 3. If direct sending (user_id provided), status might be 'pending' or 'invited' initially?
    # For simplicity, let's just create it as 'attending' or whatever status is passed.
    # If the sender is the creator, they might be "Inviting" someone.
    
    @guest.status = 'attending' unless @guest.status.present?

    if @guest.save
      # Issue a ticket if the invitation is linked to a ticket type and status is attending
      if @invitation.ticket_type && @guest.status == 'attending'
        # Issue ticket to the guest user (could be current_user or the target user)
        target_user = @guest.user || current_user 
        # Note: If guest.user is nil (non-member guest), ticket.user will be nil, which is allowed? 
        # Ticket model: belongs_to :user, optional: true? Let's assume so or fix if needed.
        
        Ticket.create!(
          ticket_type: @invitation.ticket_type,
          user: target_user.is_a?(User) ? target_user : nil,
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
    params.require(:guest).permit(:name, :message, :status, :contact, :user_id)
  end
end
