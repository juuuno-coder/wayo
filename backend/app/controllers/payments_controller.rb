class PaymentsController < ApplicationController
  before_action :authenticate_user!

  # 아임포트 결제 완료 후 검증 및 저장
  def verify
    imp_uid = params[:imp_uid]
    merchant_uid = params[:merchant_uid]
    amount = params[:amount]

    # 유효한 주문인지 확인
    # merchant_uid 형식 예: order_1703900000_15 (order_timestamp_id)
    order_id = merchant_uid.split('_').last
    @order = Order.find_by(id: order_id)

    if @order.nil?
      return render json: { success: false, error: '주문 정보를 찾을 수 없습니다.' }, status: :not_found
    end

    # 실제로는 여기서 I'mport API를 호출하여 실제 결제 금액과 amount를 비교해야 함
    # 현재는 학습 목적으로 바로 승인 처리
    
    begin
      Payment.transaction do
        @payment = Payment.create!(
          user: current_user,
          order: @order,
          imp_uid: imp_uid,
          merchant_uid: merchant_uid,
          amount: amount,
          status: 'completed',
          pay_method: params[:pay_method] || 'card',
          paid_at: Time.current,
          receipt_url: params[:receipt_url]
        )

        @order.update!(status: 'paid')
      end

      render json: { success: true, message: '결제 및 검증이 완료되었습니다.', payment: @payment }
    rescue => e
      render json: { success: false, error: "결제 처리 중 오류 발생: #{e.message}" }, status: :internal_server_error
    end
  end

  # 결제 실패 시 기록 (옵션)
  def failure
    render json: { success: false, message: '결제가 취소되었거나 실패했습니다.' }
  end
end
