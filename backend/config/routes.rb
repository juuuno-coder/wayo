Rails.application.routes.draw do
  get "ticket_types/index"
  # Sidekiq Web UI (개발/관리자용)
  require 'sidekiq/web'
  require 'sidekiq/cron/web'
  mount Sidekiq::Web => '/sidekiq'
  
  resources :invitations do
    collection do
      post :sync
      get :received
    end
    member do
      post :track_view
      get :stats
    end
    resources :guests, controller: 'invitation_guests', only: [:index, :create, :show] do
      member do
        patch :rsvp, action: :update_rsvp
      end
    end
  end
  resources :ticket_types, only: [:index, :show]
  resources :tickets, only: [:index, :show, :create] do
    post :verify, on: :collection
  end
  
  resources :guests, only: [] do
    member do
      post :claim
    end
  end
  
  devise_for :users, defaults: { format: :json }, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations',
    omniauth_callbacks: 'users/omniauth_callbacks'
  }
  resources :users, only: [:show, :update] do
    collection do
      get :search
      get :me
      post :update_password
    end
  end
  
  # Events (축제/박람회/전시회/공모전)
  resources :events do
    post 'like', to: 'likes#toggle'
    resources :reviews, only: [:index, :create]
    resources :comments, only: [:index, :create, :destroy]
    collection do
      get 'search'
      get 'ongoing'
      get 'metadata'
    end
  end
  
  # 기존 Items는 유지 (추후 제거 예정)
  resources :items do
    post 'like', to: 'likes#toggle'
    collection do
      get 'search'
    end
    resources :reviews, only: [:index, :create]
  end
  
  get 'likes', to: 'likes#index'
  get 'feed', to: 'feeds#index'
  
  resources :cart_items, only: [:index, :create, :update, :destroy]
  resources :orders, only: [:index, :show, :create]
  post 'payments/verify', to: 'payments#verify'
  resources :visits
  
  resources :posts do
    resources :comments, only: [:index, :create, :destroy]
  end
  
  namespace :admin do
    resources :events, only: [:index, :update, :destroy] do
      member do
        patch :approve
        patch :reject
      end
      collection do
        post :bulk_approve
        post :fetch
        post :normalize
      end
    end
  end
  
  # MCP (Model Context Protocol) Endpoints for AI Agents
  namespace :mcp do
    # [가보자고] 축제/전시 전문 에이전트
    scope :gabojago do
      get 'sse', to: 'gabojago#sse'      # Connection Handshake
      post 'messages', to: 'gabojago#messages' # Tool Execution
    end
  end

  # Health check route
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
