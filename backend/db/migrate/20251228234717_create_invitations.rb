class CreateInvitations < ActiveRecord::Migration[8.1]
  def change
    create_table :invitations do |t|
      t.string :title
      t.text :description
      t.datetime :event_date
      t.string :location
      t.string :cover_image_url
      t.string :theme_color
      t.string :theme_ribbon
      t.references :user, null: false, foreign_key: true
      t.references :event, null: true, foreign_key: true

      t.timestamps
    end
  end
end
