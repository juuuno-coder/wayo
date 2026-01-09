class InvitationChannel < ApplicationCable::Channel
  def subscribed
    stream_from "invitation_user_#{current_user.id}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
