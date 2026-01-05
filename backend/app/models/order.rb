class Order < ApplicationRecord
  belongs_to :user
  has_many :order_items, dependent: :destroy
  has_many :items, through: :order_items
  has_one :payment, dependent: :destroy
  
  validates :total_price, presence: true, numericality: { greater_than: 0 }
  validates :status, presence: true
  
  before_create :set_merchant_uid

  # 주문 상태: pending(결제대기), paid(결제완료), shipping(배송중), delivered(배송완료), cancelled(취소)
  enum :status, {
    pending: 'pending',
    paid: 'paid',
    shipping: 'shipping',
    delivered: 'delivered',
    cancelled: 'cancelled'
  }, default: 'pending'

  private

  def set_merchant_uid
    self.merchant_uid = "order_#{Time.now.to_i}_#{SecureRandom.hex(3)}"
  end
end
