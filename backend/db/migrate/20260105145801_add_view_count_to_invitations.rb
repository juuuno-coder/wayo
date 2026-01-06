class AddViewCountToInvitations < ActiveRecord::Migration[8.1]
  def change
    add_column :invitations, :view_count, :integer, default: 0
  end
end
