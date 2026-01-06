class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, :omniauthable, 
         jwt_revocation_strategy: Devise::JWT::RevocationStrategies::Null,
         omniauth_providers: [:google_oauth2]

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0, 20]
      user.nickname = auth.info.name
    end
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

  # Simple revocation strategy for MVP (Null). 
  # For real production, use JTIMatcher or Denylist.
end
