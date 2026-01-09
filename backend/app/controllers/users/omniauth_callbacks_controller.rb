class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  respond_to :json

  def google_oauth2
    @user = User.from_omniauth(request.env['omniauth.auth'])

    if @user.persisted?
      # JWT 토큰 생성 및 응답
      sign_in(@user)
      # JWT 토큰 생성
      # devise-jwt 환경에서 sign_in 후에 request.env['warden-jwt_auth.token']가 비어있는 경우가 있으므로
      # Warden::JWTAuth::UserEncoder를 사용하여 수동으로 토큰 생성
      token, _ = Warden::JWTAuth::UserEncoder.new.call(@user, :user, nil)
      
      # origin 파라미터가 있으면 우선 사용, 없으면 ENV['FRONTEND_URL'] 혹은 기본값 사용
      default_url = ENV['FRONTEND_URL'] || "http://wayo.co.kr/"
      redirect_uri = params[:origin] || request.env['omniauth.origin'] || default_url
      
      # 토큰을 쿼리 스트링으로 전달
      redirect_to "#{redirect_uri}?token=#{token}&email=#{@user.email}&id=#{@user.id}&avatar_url=#{@user.avatar_url}", allow_other_host: true
    else
      session['devise.google_data'] = request.env['omniauth.auth'].except(:extra)
      base_url = ENV['FRONTEND_URL'] || "http://wayo.co.kr"
      redirect_uri = base_url.end_with?('/') ? base_url : "#{base_url}/"
      redirect_to "#{redirect_uri}login?error=auth_failed", allow_other_host: true
    end
  end

  def failure
    base_url = ENV['FRONTEND_URL'] || "http://wayo.co.kr"
    redirect_uri = base_url.end_with?('/') ? base_url : "#{base_url}/"
    redirect_to "#{redirect_uri}login?error=failure", allow_other_host: true
  end
end
