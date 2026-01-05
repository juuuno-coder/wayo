class MakeCommentsPolymorphic < ActiveRecord::Migration[8.1]
  def change
    remove_reference :comments, :post, foreign_key: true
    add_reference :comments, :commentable, polymorphic: true, index: true
  end
end
