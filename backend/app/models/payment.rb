class Payment < ApplicationRecord
  belongs_to :user
  belongs_to :order

  # 결제 상태 상수
  STATUS = {
    pending: 'pending',
    completed: 'completed',
    failed: 'failed',
    canceled: 'canceled'
  }.freeze

  validates :amount, presence: true
  validates :status, presence: true, inclusion: { in: STATUS.values }
  validates :imp_uid, uniqueness: true, allow_nil: true
  validates :merchant_uid, presence: true
end
