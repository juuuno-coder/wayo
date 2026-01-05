class CreatePayments < ActiveRecord::Migration[8.1]
  def change
    create_table :payments do |t|
      t.references :user, null: false, foreign_key: true
      t.references :order, null: false, foreign_key: true
      t.integer :amount, null: false
      t.string :status, null: false, default: 'ready'
      t.string :imp_uid
      t.string :merchant_uid, null: false
      t.string :pay_method
      t.datetime :paid_at
      t.string :receipt_url

      t.timestamps
    end
    add_index :payments, :imp_uid, unique: true
    add_index :payments, :merchant_uid, unique: true
  end
end
