class AddSignupOriginToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :signup_origin, :string
  end
end
