module Admin
  class EventsController < ApplicationController
    # Skip CSRF for API requests if needed, but better to use proper auth later
    # For now, keeping it simple as a proof of concept
    
    def index
      @events = Event.where(approval_status: params[:status] || 'pending')
                    .order(crawled_at: :desc)
      render json: @events
    end

    def approve
      @event = Event.find(params[:id])
      if @event.update(approval_status: 'approved')
        render json: { status: 'success', message: '이벤트가 승인되었습니다.' }
      else
        render json: { status: 'error', message: @event.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def reject
      @event = Event.find(params[:id])
      if @event.update(approval_status: 'rejected')
        render json: { status: 'success', message: '이벤트가 거절되었습니다.' }
      else
        render json: { status: 'error', message: @event.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      @event = Event.find(params[:id])
      if @event.update(event_params)
        render json: { status: 'success', message: '이벤트가 수정되었습니다.', event: @event }
      else
        render json: { status: 'error', message: @event.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      @event = Event.find(params[:id])
      if @event.destroy
        render json: { status: 'success', message: '이벤트가 삭제되었습니다.' }
      else
        render json: { status: 'error', message: @event.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def event_params
      params.require(:event).permit(:title, :description, :start_date, :end_date, :location, :image_url, :source_url, :category, :is_free, :approval_status)
    end

    def bulk_approve
      ids = params[:ids]
      if Event.where(id: ids).update_all(approval_status: 'approved')
        render json: { status: 'success', message: "#{ids.count}개의 이벤트가 승인되었습니다." }
      else
        render json: { status: 'error', message: '승인 중 오류가 발생했습니다.' }, status: :unprocessable_entity
      end
    end

    def fetch
      EventDataService.call
      render json: { status: 'success', message: '데이터 수집이 시작되었습니다.' }
    rescue => e
      render json: { status: 'error', message: e.message }, status: :internal_server_error
    end

    def normalize
      count = Event.where(approval_status: nil).update_all(approval_status: 'approved')
      render json: { status: 'success', message: "#{count}개의 데이터 정규화 완료" }
    end
  end
end
