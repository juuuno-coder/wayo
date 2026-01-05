class CreateVisits < ActiveRecord::Migration[8.1]
  def change
    create_table :visits do |t|
      t.references :user, null: false, foreign_key: true
      t.references :event, null: false, foreign_key: true
      t.datetime :visited_at
      t.text :content
      t.json :images
      t.json :decoration_metadata

      t.timestamps
    end
  end
end
