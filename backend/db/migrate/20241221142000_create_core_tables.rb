class CreateCoreTables < ActiveRecord::Migration[8.1]
  def change
    create_table :items do |t|
      t.string :title
      t.text :description
      t.integer :price
      t.string :category
      t.string :image_url
      t.timestamps
    end

    create_table :events do |t|
      t.string :title
      t.string :category
      t.text :description
      t.date :start_date
      t.date :end_date
      t.string :location
      t.string :image_url
      t.string :organizer
      t.string :website_url
      t.boolean :is_free, default: false
      t.string :price
      t.timestamps
    end

    create_table :likes do |t|
      t.references :user, null: false, foreign_key: true
      t.references :likeable, polymorphic: true, null: false
      t.timestamps
    end

    create_table :reviews do |t|
      t.references :user, null: false, foreign_key: true
      t.references :reviewable, polymorphic: true, null: false
      t.integer :rating
      t.text :content
      t.timestamps
    end

    create_table :cart_items do |t|
      t.references :user, null: false, foreign_key: true
      t.references :item, null: false, foreign_key: true
      t.integer :quantity, default: 1
      t.timestamps
    end

    create_table :orders do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :total_price
      t.string :status
      t.timestamps
    end

    create_table :order_items do |t|
      t.references :order, null: false, foreign_key: true
      t.references :item, null: false, foreign_key: true
      t.integer :quantity
      t.integer :price
      t.timestamps
    end
  end
end
