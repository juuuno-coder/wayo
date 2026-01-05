# Sidekiq 초기화 설정
require 'sidekiq'
require 'sidekiq-cron'

# Redis 연결 설정
Sidekiq.configure_server do |config|
  config.redis = { url: ENV.fetch('REDIS_URL') { 'redis://localhost:6379/1' } }
  
  # Sidekiq-cron 스케줄 로드
  schedule_file = Rails.root.join('config', 'sidekiq.yml')
  
  if File.exist?(schedule_file)
    schedule = YAML.load_file(schedule_file)
    
    if schedule[:schedule]
      Sidekiq::Cron::Job.load_from_hash!(schedule[:schedule])
      Rails.logger.info "[Sidekiq] Loaded #{schedule[:schedule].keys.size} cron jobs"
    end
  end
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV.fetch('REDIS_URL') { 'redis://localhost:6379/1' } }
end
