module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      token = request.params[:token]
      if token
        begin
          # WARDEN_JWT_AUTHENTICATION_SECRET를 사용하여 디코딩 시도
          # 또는 Devise-JWT의 기본 설정을 따름
          # 여기서는 단순화를 위해 우선 유효성 검사 로직을 추가하거나
          # Devise를 통한 연결 확인을 수행합니다.
          # 실제 구현에서는 JWT.decode 등을 사용해야 할 수 있습니다.
          
          # 임시: 토큰이 있으면 인증된 것으로 간주 (추후 강화)
          # 실제 운영 환경에서는 JWT 토큰 파싱 로직이 필요합니다.
          user = User.find_by(id: decode_token(token))
          if user
            user
          else
            reject_unauthorized_connection
          end
        rescue
          reject_unauthorized_connection
        end
      else
        reject_unauthorized_connection
      end
    end

    def decode_token(token)
      # Devise-JWT의 비밀키를 가져와서 해독
      secret = Rails.application.credentials.fetch(:devise_jwt_secret_key) { ENV['DEVISE_JWT_SECRET_KEY'] }
      decoded = JWT.decode(token, secret, true, { algorithm: 'HS256' })
      decoded.first['sub']
    end
  end
end
