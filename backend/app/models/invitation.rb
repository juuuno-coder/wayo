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

  after_save_commit :broadcast_to_user
  after_destroy_commit :broadcast_to_user

  private

  def broadcast_to_user
    return unless user_id
    ActionCable.server.broadcast(
      "invitation_user_#{user_id}",
      {
        type: 'INVITATION_UPDATED',
        invitation: self.as_json(include: :invitation_guests)
      }
    )
  end
end
