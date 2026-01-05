class AddStyleFieldsToInvitations < ActiveRecord::Migration[8.1]
  def change
    add_column :invitations, :font_style, :string
    add_column :invitations, :bgm, :string
    add_column :invitations, :text_effect, :string
  end
end
