class InvitationGuest < ApplicationRecord
  belongs_to :invitation
  belongs_to :user, optional: true
  has_one :ticket, dependent: :destroy
  
  validates :name, presence: true
  validates :status, presence: true
end
