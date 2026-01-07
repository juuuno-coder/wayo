Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV['FRONTEND_URL'] || 'http://localhost:3400', 'http://127.0.0.1:3400', 'http://localhost:3000', 'https://wayo.co.kr', 'https://www.wayo.co.kr', 'http://wayo.co.kr', 'http://wayo.co.kr:3400', 'http://gabojago.wayo.co.kr', 'https://gabojago.wayo.co.kr', 'http://gabojago.wayo.co.kr:3400'

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      expose: ['Authorization'] # JWT 토큰 헤더 노출 허용
  end
end
