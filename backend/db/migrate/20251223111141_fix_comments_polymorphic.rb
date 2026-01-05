class FixCommentsPolymorphic < ActiveRecord::Migration[8.1]
  def change
    add_column :comments, :commentable_id, :integer
    add_column :comments, :commentable_type, :string
    remove_column :comments, :post_id, :integer if column_exists?(:comments, :post_id)
    add_index :comments, [:commentable_type, :commentable_id]
  end
end
