class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, :omniauthable, 
         jwt_revocation_strategy: Devise::JWT::RevocationStrategies::Null,
         omniauth_providers: [:google_oauth2]

  def self.from_omniauth(auth)
    user = where(provider: auth.provider, uid: auth.uid).first_or_initialize do |u|
      u.email = auth.info.email
      u.password = Devise.friendly_token[0, 20]
    end
    
    user.nickname = auth.info.name
    user.avatar_url = auth.info.image
    user.save
    user
  end

  has_many :likes, dependent: :destroy
  has_many :visits, dependent: :destroy
  has_many :liked_items, through: :likes, source: :item
  has_many :cart_items
  has_many :cart_products, through: :cart_items, source: :item
  has_many :orders
  has_many :reviews
  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :invitations, dependent: :destroy
  has_many :invitation_guests, dependent: :destroy

  # Simple revocation strategy for MVP (Null). 
  # For real production, use JTIMatcher or Denylist.
end
