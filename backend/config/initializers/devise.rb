# frozen_string_literal: true

Devise.setup do |config|
  config.mailer_sender = 'please-change-me-at-config-initializers-devise@example.com'
  require 'devise/orm/active_record'
  config.case_insensitive_keys = [:email]
  config.strip_whitespace_keys = [:email]
  config.skip_session_storage = [:http_auth]
  config.stretches = Rails.env.test? ? 1 : 12
  config.reconfirmable = true
  config.expire_all_remember_me_on_sign_out = true
  config.password_length = 6..128
  config.email_regexp = /\A[^@\s]+@[^@\s]+\z/
  config.reset_password_within = 6.hours
  config.sign_out_via = :delete
  
  # JWT Config
  config.jwt do |jwt|
    jwt.secret = 'fc83693998748956983745237856237856489375892375892375892374589237589' # In prod, use ENV
    jwt.dispatch_requests = [
      ['POST', %r{^/users/sign_in$}]
    ]
    jwt.revocation_requests = [
      ['DELETE', %r{^/users/sign_out$}]
    ]
    jwt.expiration_time = 1.day.to_i
  end
  
  config.navigational_formats = [] # API Mode: Don't redirect

  # OmniAuth Google Config
  config.omniauth :google_oauth2, 
                  ENV['GOOGLE_CLIENT_ID'], 
                  ENV['GOOGLE_CLIENT_SECRET'], 
                  {
                    scope: 'email, profile',
                    prompt: 'select_account',
                    image_aspect_ratio: 'square',
                    image_size: 50
                  }

  # Allow GET requests for OmniAuth (Required for window.location.href)
  OmniAuth.config.allowed_request_methods = [:post, :get]
  OmniAuth.config.silence_get_warning = true
end
