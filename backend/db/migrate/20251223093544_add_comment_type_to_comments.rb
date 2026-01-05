class AddCommentTypeToComments < ActiveRecord::Migration[8.1]
  def change
    add_column :comments, :comment_type, :string
  end
end
