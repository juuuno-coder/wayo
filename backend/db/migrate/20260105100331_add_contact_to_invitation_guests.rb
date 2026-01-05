class AddContactToInvitationGuests < ActiveRecord::Migration[8.1]
  def change
    add_column :invitation_guests, :contact, :string
  end
end
