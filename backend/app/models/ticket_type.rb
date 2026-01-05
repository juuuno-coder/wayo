class TicketType < ApplicationRecord
  belongs_to :event
  has_many :tickets, dependent: :destroy
  
  validates :name, presence: true
  validates :price, numericality: { greater_than_or_equal_to: 0 }
  validates :quantity, numericality: { greater_than_or_equal_to: 0 }
end
