class SmsService
  def initialize
    @api_key = ENV['COOLSMS_API_KEY']
    @api_secret = ENV['COOLSMS_API_SECRET']
    @sender_number = ENV['COOLSMS_SENDER_NUMBER'] || '01000000000' # Default or env
  end

  def send_message(to, text)
    # Placeholder for actual API call logic
    # In a real scenario with cool-sms-sdk-ruby or net/http:
    
    # 1. Check if keys exist
    unless @api_key.present? && @api_secret.present?
      Rails.logger.warn "[SMS] Skipped: Missing COOLSMS_API_KEY or COOLSMS_API_SECRET. Content: #{text} to #{to}"
      return false
    end

    # 2. Log the attempt (Simulation)
    Rails.logger.info "[SMS] Sending to #{to}: #{text}"

    # 3. Actual Implementation (Example using generic HTTP if we were to implement)
    # uri = URI("https://api.coolsms.co.kr/messages/v4/send")
    # ... http post ...

    # For now, we return true to simulate success in log
    true
  rescue => e
    Rails.logger.error "[SMS] Failed to send: #{e.message}"
    false
  end
end
