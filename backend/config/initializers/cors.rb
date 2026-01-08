Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(
      'http://localhost:3000',
      'https://localhost:3000',
      /https?:\/\/.*\.wayo\.co\.kr/,  # All subdomains of wayo.co.kr
      /https:\/\/wayo\.co\.kr/,        # Main domain
      /https:\/\/.*\.vercel\.app$/     # Vercel deployments
    )

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,
      expose: ['Authorization']
  end
end
