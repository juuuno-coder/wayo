class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  def create
    existing_user = User.find_by(email: sign_up_params[:email])
    
    if existing_user
      # 이미 사용자가 존재하는 경우, 통합 가입 여부를 확인 (단순 이메일 중복 이상의 처리)
      render json: { 
        status: 'integrated_account_exists', 
        message: '이미 통합 회원이십니다. 기존 계정으로 바로 로그인하실 수 있습니다.',
        email: existing_user.email
      }, status: :unprocessable_entity
      return
    end

    build_resource(sign_up_params)

    resource.save
    if resource.persisted?
      if resource.active_for_authentication?
        sign_up(resource_name, resource)
        render json: resource
      else
        expire_data_after_sign_in!
        render json: resource
      end
    else
      clean_up_passwords resource
      set_minimum_password_length
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  protected

  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation, :nickname, :signup_origin)
  end
end
