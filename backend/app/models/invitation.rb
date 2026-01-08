class Invitation < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :event, optional: true
  belongs_to :ticket_type, optional: true
  has_many_attached :images
  has_many :invitation_guests, dependent: :destroy
  
  validates :title, presence: true
  validates :event_date, presence: true
  validates :status, presence: true

  enum :status, { draft: 'draft', published: 'published', sending: 'sending', completed: 'completed' }, default: 'draft'
end
