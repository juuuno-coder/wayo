class Ticket < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :ticket_type
  belongs_to :invitation_guest, optional: true
  
  before_create :generate_qr_code
  
  private
  
  def generate_qr_code
    self.qr_code ||= SecureRandom.uuid
    self.status ||= 'active'
  end
end
