class InvitationsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_invitation, only: %i[ show update destroy ]

  # GET /invitations
  def index
    # If unauthenticated, return empty array to prevent 401 bounce
    if current_user
      @invitations = current_user.invitations.with_attached_images
    else
      @invitations = []
    end
    render json: @invitations.map { |invitation| invitation_as_json(invitation) }
  end

  # GET /invitations/1
  def show
    render json: invitation_as_json(@invitation)
  end

  # GET /invitations/received
  def received
    if current_user
      @invitations = Invitation.joins(:invitation_guests)
                               .where(invitation_guests: { user_id: current_user.id })
                               .with_attached_images
                               .distinct
    else
      @invitations = []
    end
    render json: @invitations.map { |invitation| invitation_as_json(invitation) }
  end

  # POST /invitations/:id/track_view
  def track_view
    @invitation = Invitation.find(params[:id])
    # Simple increment. In production, use Redis or log-based counting to avoid write contention.
    @invitation.increment!(:view_count)
    render json: { view_count: @invitation.view_count }, status: :ok
  end

  # GET /invitations/:id/stats
  def stats
    @invitation = Invitation.find(params[:id])
    
    # Guest breakdown
    guests = @invitation.invitation_guests
    stats = {
      total_views: @invitation.view_count,
      rsvp_total: guests.count,
      rsvp_attending: guests.where(status: 'accepted').count,
      rsvp_declined: guests.where(status: 'declined').count,
      rsvp_pending: guests.where(status: 'pending').count,
    }
    
    render json: stats
  end

  skip_before_action :authenticate_user!, only: %i[ show track_view ]

  # POST /invitations
  def create
    Rails.logger.info "DEBUG: invitation_params: #{invitation_params.inspect}"
    @invitation = Invitation.new(invitation_params)
    @invitation.user = current_user if user_signed_in?

    # Explicitly attach images if present to ensure they are picked up
    if params[:invitation] && params[:invitation][:images].present?
      @invitation.images.attach(params[:invitation][:images])
    end

    if @invitation.save
      render json: invitation_as_json(@invitation), status: :created
    else
      Rails.logger.error "DEBUG: invitation errors: #{@invitation.errors.full_messages}"
      render json: @invitation.errors, status: :unprocessable_content
    end
  end

  # POST /invitations/sync
  def sync
    created_invitations = []
    
    # params[:invitations] is expected to be an array of invitation objects
    # Note: Images are difficult to sync via simple JSON array in one go if they require FormData.
    # Ideally, sync should handle metadata, and images might need separate handling or 
    # we assume pending invitations are mostly text-based or have explicit URLs.
    # For now, we'll iterate and create using strong params logic, adapting for array input.
    
    ActiveRecord::Base.transaction do
      if params[:invitations].present? && params[:invitations].is_a?(Array)
        params[:invitations].each do |inv_attr|
          # Permit attributes for each invitation
          # Note: ActionController::Parameters require careful handling for arrays
          # We'll construct a new object manually for simplicity and security
          
          # Map frontend PendingInvitation keys to Rails params
          invitation = current_user.invitations.build(
            title: inv_attr[:title],
            description: inv_attr[:description],
            event_date: inv_attr[:date], # Frontend uses 'date', Backend uses 'event_date'
            location: inv_attr[:location],
            cover_image_url: inv_attr[:coverImage], # Frontend uses 'coverImage'
            theme_color: inv_attr.dig(:theme, :color), # Nested theme object access
            theme_ribbon: inv_attr.dig(:theme, :ribbon),
            font_style: inv_attr[:fontStyle],
            bgm: inv_attr[:bgm],
            text_effect: inv_attr[:textEffect],
            # ticket_type_id logic might be needed if frontend stores it
          )
          
          if invitation.save
            created_invitations << invitation
          end
        end
      end
    end
    
    render json: { 
      message: "#{created_invitations.count} invitations synced", 
      invitations: created_invitations.map { |inv| invitation_as_json(inv) } 
    }, status: :ok
  rescue => e
    render json: { error: e.message }, status: :unprocessable_content
  end

  # PATCH/PUT /invitations/1
  def update
    if @invitation.update(invitation_params)
      render json: invitation_as_json(@invitation)
    else
      render json: @invitation.errors, status: :unprocessable_content
    end
  end

  # DELETE /invitations/1
  def destroy
    @invitation.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_invitation
      @invitation = Invitation.find(params.expect(:id))
    end

    def invitation_as_json(invitation)
      invitation.as_json.merge(
        image_urls: invitation.images.attached? ? invitation.images.map { |img| url_for(img) } : []
      )
    end

    # Only allow a list of trusted parameters through.
    def invitation_params
      params.fetch(:invitation, {}).permit(
        :title, :description, :sender_name, :event_date, :event_end_date, :location, :cover_image_url, 
        :theme_color, :theme_ribbon, :user_id, :event_id, :font_style, 
        :bgm, :text_effect, :ticket_type_id, :default_layout, :status, images: [],
        content_blocks: [:id, :type, data: {}]
      )
    end
end
