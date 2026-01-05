# 이벤트 크롤링 백그라운드 작업
# Sidekiq을 통해 비동기로 실행되며, 정기적으로 스케줄링 가능
class EventCrawlerWorker
  include Sidekiq::Worker
  
  sidekiq_options queue: :default, retry: 3
  
  def perform
    Rails.logger.info "[EventCrawlerWorker] Starting event crawling job at #{Time.current}"
    
    begin
      # EventDataService 호출
      results = EventDataService.call
      
      Rails.logger.info "[EventCrawlerWorker] Completed successfully"
      Rails.logger.info "[EventCrawlerWorker] Results: #{results.inspect}"
      
      # 결과를 슬랙이나 이메일로 알림 (선택사항)
      # notify_results(results) if results[:errors].any?
      
      results
    rescue => e
      Rails.logger.error "[EventCrawlerWorker] Error: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      raise e # Sidekiq retry 메커니즘 활용
    end
  end
  
  private
  
  # 결과 알림 (선택사항)
  def notify_results(results)
    # 슬랙, 이메일 등으로 크롤링 결과 전송
    # 예: SlackNotifier.notify("Event crawling completed: #{results}")
  end
end
