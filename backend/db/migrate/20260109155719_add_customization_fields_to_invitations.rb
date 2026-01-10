class AddCustomizationFieldsToInvitations < ActiveRecord::Migration[8.1]
  def change
    add_column :invitations, :primary_color, :string
    add_column :invitations, :secondary_color, :string
    add_column :invitations, :text_color, :string
    add_column :invitations, :background_color, :string
    add_column :invitations, :bgm_volume, :integer, default: 50
    add_column :invitations, :auto_play_bgm, :boolean, default: false
  end
end
