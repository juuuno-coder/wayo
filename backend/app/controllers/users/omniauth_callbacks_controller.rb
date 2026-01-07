class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  respond_to :json

  def google_oauth2
    @user = User.from_omniauth(request.env['omniauth.auth'])

    if @user.persisted?
      # JWT 토큰 생성 및 응답
      sign_in(@user)
      token = request.env['warden-jwt_auth.token']
      
      # 클라이언트(Next.js)로 리디렉션하면서 토큰을 전달하거나 
      # 혹은 팝업 창 방식이라면 HTML 응답으로 토큰을 전달할 수 있습니다.
      # 여기서는 로그인을 완료하고 토큰을 헤더에 담아 전송하는 방식을 시뮬레이션합니다.
      
      # SPA 환경에서는 보통 리디렉션 URL에 토큰을 담는 방식이나
      # 혹은 특정 경로로 리디렉션 후 프론트에서 토큰을 가져가게 합니다.
      
      # origin 파라미터가 있으면 우선 사용, 없으면 ENV['FRONTEND_URL'] 혹은 기본값 사용
      default_url = ENV['FRONTEND_URL'] || "http://wayo.co.kr/"
      redirect_uri = params[:origin] || request.env['omniauth.origin'] || default_url
      
      # 보안 검증: 허용된 도메인인지 체크 (선택 사항이나 권장)
      # if !ALLOWED_HOSTS.include?(URI.parse(redirect_uri).host)
      #   redirect_uri = "http://wayo.co.kr/"
      # end

      # 토큰을 쿼리 스트링으로 전달 (주의: 실제 상용에서는 보안상 포스트 메시지나 다른 방식 권장)
      redirect_to "#{redirect_uri}?token=#{token}&email=#{@user.email}&id=#{@user.id}", allow_other_host: true
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
