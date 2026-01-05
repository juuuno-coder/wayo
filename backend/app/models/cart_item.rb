class CartItem < ApplicationRecord
  belongs_to :user
  belongs_to :item
  
  validates :quantity, presence: true, numericality: { greater_than: 0 }
  validates :item_id, uniqueness: { scope: :user_id }
end
