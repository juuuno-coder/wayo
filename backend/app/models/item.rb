class Item < ApplicationRecord
  has_many :likes
  has_many :liked_users, through: :likes, source: :user
  has_many :reviews
end
