class AddSenderNameToInvitations < ActiveRecord::Migration[8.1]
  def change
    add_column :invitations, :sender_name, :string
  end
end
