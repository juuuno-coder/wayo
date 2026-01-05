class AddInvitationGuestIdToTickets < ActiveRecord::Migration[8.1]
  def change
    add_reference :tickets, :invitation_guest, null: true, foreign_key: true
  end
end
