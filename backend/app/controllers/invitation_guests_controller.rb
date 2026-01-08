class InvitationGuestsController < ApplicationController
  before_action :authenticate_user!
  skip_before_action :authenticate_user!, only: [:index, :create, :show]
  before_action :set_invitation, only: [:index, :create, :update_rsvp]
  before_action :set_guest, only: [:show, :update_rsvp]

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
    
    # 2. Assign user if current_user is RSVPing themselves OR by email lookup
    if current_user && !@guest.user_id
        @guest.user = current_user
    elsif !@guest.user_id && @guest.contact.present? && @guest.contact.match?( URI::MailTo::EMAIL_REGEXP )
        # Auto-link to existing user by email
        linked_user = User.find_by(email: @guest.contact)
        @guest.user = linked_user if linked_user
    end

    # 3. If direct sending (user_id provided), status might be 'pending' or 'invited' initially?
    # For simplicity, let's just create it as 'attending' or whatever status is passed.
    # If the sender is the creator, they might be "Inviting" someone.
    
    @guest.status = 'accepted' unless @guest.status.present?

    if @guest.save
      # Issue a ticket if the invitation is linked to a ticket type and status is attending
      if @invitation.ticket_type && @guest.status == 'accepted'
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
      
      # Send Email if contact is an email address
      if @guest.contact.present?
        if @guest.contact.match?(URI::MailTo::EMAIL_REGEXP)
          InvitationMailer.send_invitation_email(@guest, @invitation).deliver_later
        elsif @guest.contact.gsub('-', '').match?(/^01[0-9]{8,9}$/)
          # Check for phone number (remove hyphens, check for 01012345678 format)
          # Send SMS
          # Use a background job in production, but calling service directly for MVP
          msg = "[Wayo] #{@invitation.sender_name || '호스트'}님의 초대장이 도착했습니다.\n확인하기: https://wayo.fly.dev/invitations/#{@invitation.id}?guest_id=#{@guest.id}"
          SmsService.new.send_message(@guest.contact, msg)
        end
      end
      
      render json: @guest.as_json(include: { ticket: { only: [:id, :qr_code, :status] } }), status: :created
    else
      render json: @guest.errors, status: :unprocessable_content
    end
  end

  # GET /invitations/:invitation_id/guests/:id
  def show
    render json: @guest.as_json(include: { ticket: { only: [:id, :qr_code, :status] }, invitation: { only: [:id, :title] } })
  end

  # PATCH /invitations/:invitation_id/guests/:id/rsvp
  def update_rsvp
    # Authorization: user must be the guest or invitation owner
    unless authorized_to_update?
      render json: { error: 'Unauthorized' }, status: :forbidden
      return
    end

    if @guest.update(rsvp_params)
      # Handle ticket creation/deletion based on status change
      handle_ticket_on_rsvp_change
      
      render json: @guest.as_json(include: { ticket: { only: [:id, :qr_code, :status] } })
    else
      render json: { errors: @guest.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_invitation
    @invitation = Invitation.find(params[:invitation_id])
  end

  def guest_params
    params.require(:guest).permit(:name, :message, :status, :contact, :user_id)
  end

  def set_guest
    @guest = InvitationGuest.find(params[:id])
  end

  def rsvp_params
    params.permit(:status, :message)
  end

  def authorized_to_update?
    # Guest can update their own RSVP
    return true if @guest.user_id == current_user&.id
    
    # Invitation owner can update any guest's RSVP
    return true if @invitation.user_id == current_user&.id
    
    false
  end

  def handle_ticket_on_rsvp_change
    return unless @invitation.ticket_type

    if @guest.status == 'accepted' && !@guest.ticket
      # Create ticket when accepting
      Ticket.create!(
        ticket_type: @invitation.ticket_type,
        user: @guest.user,
        invitation_guest: @guest,
        status: 'active'
      )
    elsif @guest.status != 'accepted' && @guest.ticket
      # Optionally cancel ticket when declining/pending
      @guest.ticket.update(status: 'cancelled')
    end
  end
end
