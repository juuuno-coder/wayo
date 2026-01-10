class FaqsController < ApplicationController
  before_action :set_faq, only: [:update, :destroy]
  before_action :require_admin, only: [:admin_index, :create, :update, :destroy]

  # Public endpoint - GET /faqs
  def index
    @faqs = Faq.order(:position)
    render json: @faqs
  end

  # Admin endpoint - GET /admin/faqs
  def admin_index
    @faqs = Faq.order(:position)
    render json: @faqs
  end

  # Admin endpoint - POST /admin/faqs
  def create
    @faq = Faq.new(faq_params)
    
    if @faq.save
      render json: @faq, status: :created
    else
      render json: { errors: @faq.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # Admin endpoint - PATCH/PUT /admin/faqs/:id
  def update
    if @faq.update(faq_params)
      render json: @faq
    else
      render json: { errors: @faq.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # Admin endpoint - DELETE /admin/faqs/:id
  def destroy
    @faq.destroy
    head :no_content
  end

  private

  def set_faq
    @faq = Faq.find(params[:id])
  end

  def faq_params
    params.require(:faq).permit(:question, :answer, :position)
  end

  def require_admin
    # Simple admin check - you can enhance this with proper role-based auth
    # For now, just check if user is logged in
    unless current_user
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  def current_user
    return nil unless request.headers['Authorization']
    
    token = request.headers['Authorization'].sub(/^Bearer\s+/, '')
    begin
      decoded = JWT.decode(token, Rails.application.credentials.secret_key_base, true, { algorithm: 'HS256' })
      User.find_by(id: decoded[0]['user_id'])
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      nil
    end
  end
end
