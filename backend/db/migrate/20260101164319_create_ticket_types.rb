class CreateTicketTypes < ActiveRecord::Migration[8.1]
  def change
    create_table :ticket_types do |t|
      t.references :event, null: false, foreign_key: true
      t.string :name
      t.integer :price
      t.integer :quantity
      t.text :description

      t.timestamps
    end
  end
end
