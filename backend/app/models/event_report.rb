class EventReport < ApplicationRecord
  belongs_to :user
  
  REPORT_TYPES = %w[future past].freeze
  STATUSES = %w[pending processed rejected].freeze
  
  validates :title, presence: true
  validates :status, inclusion: { in: STATUSES }
  validates :report_type, inclusion: { in: REPORT_TYPES }
end
