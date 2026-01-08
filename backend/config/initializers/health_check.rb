# Health check endpoint for monitoring
Rails.application.routes.draw do
  get '/health', to: proc { [200, {}, ['OK']] }
end
