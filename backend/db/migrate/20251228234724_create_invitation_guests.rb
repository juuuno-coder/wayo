class CreateInvitationGuests < ActiveRecord::Migration[8.1]
  def change
    create_table :invitation_guests do |t|
      t.references :invitation, null: false, foreign_key: true
      t.references :user, null: true, foreign_key: true
      t.string :name
      t.string :status
      t.text :message

      t.timestamps
    end
  end
end
