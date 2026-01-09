class ApplicationController < ActionController::API
  include ActionController::MimeResponds
  
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :authenticate_user_from_token!

  private

  def authenticate_user_from_token!
    return unless request.headers['Authorization'].present?
    
    token = request.headers['Authorization'].split(' ').last
    begin
      jwt_payload = JWT.decode(token, ENV.fetch('DEVISE_JWT_SECRET_KEY') { 'fc83693998748956983745237856237856489375892375892375892374589237589' }).first
      @current_user = User.find(jwt_payload['sub'])
    rescue JWT::ExpiredSignature, JWT::VerificationError, JWT::DecodeError
      # Token is invalid or expired
      @current_user = nil
    end
  end

  def current_user
    @current_user
  end

  def user_signed_in?
    current_user.present?
  end

  def authenticate_user!
    unless user_signed_in?
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:nickname, :phone])
    devise_parameter_sanitizer.permit(:account_update, keys: [:nickname, :phone])
  end
end
