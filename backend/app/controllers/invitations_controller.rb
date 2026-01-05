class InvitationsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_invitation, only: %i[ show update destroy ]

  # GET /invitations
  def index
    @invitations = current_user.invitations
    render json: @invitations
  end

  # GET /invitations/1
  def show
    render json: @invitation
  end

  skip_before_action :authenticate_user!, only: %i[ show create ]

  # POST /invitations
  def create
    @invitation = Invitation.new(invitation_params)
    @invitation.user = current_user if user_signed_in?

    if @invitation.save
      render json: @invitation, status: :created, location: @invitation
    else
      render json: @invitation.errors, status: :unprocessable_content
    end
  end

  # PATCH/PUT /invitations/1
  def update
    if @invitation.update(invitation_params)
      render json: @invitation
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

    # Only allow a list of trusted parameters through.
    def invitation_params
      params.expect(invitation: [ :title, :description, :event_date, :location, :cover_image_url, :theme_color, :theme_ribbon, :user_id, :event_id, :font_style, :bgm, :text_effect, :ticket_type_id ])
    end
end
