class AddDetailsToOrders < ActiveRecord::Migration[8.1]
  def change
    add_column :orders, :shipping_address, :string
    add_column :orders, :buyer_name, :string
    add_column :orders, :buyer_phone, :string
    add_column :orders, :merchant_uid, :string
  end
end
