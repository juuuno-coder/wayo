class CreatePosts < ActiveRecord::Migration[8.1]
  def change
    create_table :posts do |t|
      t.string :title
      t.text :content
      t.string :category
      t.references :user, null: false, foreign_key: true
      t.string :image_url
      t.integer :likes_count
      t.integer :comments_count

      t.timestamps
    end
  end
end
