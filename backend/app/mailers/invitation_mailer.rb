class InvitationMailer < ApplicationMailer
  default from: 'Wayo <no-reply@wayo.co.kr>'

  def send_invitation_email(guest, invitation)
    @guest = guest
    @invitation = invitation
    @url = "https://wayo.co.kr/invitations/#{invitation.id}?guest_id=#{guest.id}" # Auto-login guest context

    mail(to: guest.contact, subject: "[Wayo] #{@invitation.sender_name || '호스트'}님의 초대장이 도착했습니다!")
  end
end
