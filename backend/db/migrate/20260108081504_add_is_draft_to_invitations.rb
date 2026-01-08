class AddIsDraftToInvitations < ActiveRecord::Migration[8.1]
  def change
    add_column :invitations, :is_draft, :boolean, default: true
  end
end
