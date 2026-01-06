class AddDefaultLayoutToInvitations < ActiveRecord::Migration[8.1]
  def change
    add_column :invitations, :default_layout, :string, default: 'spread'
  end
end
