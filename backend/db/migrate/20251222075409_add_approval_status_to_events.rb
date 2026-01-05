class AddApprovalStatusToEvents < ActiveRecord::Migration[8.1]
  def change
    add_column :events, :approval_status, :string, default: 'pending'
    add_column :events, :source_url, :string
    add_column :events, :crawled_at, :datetime
  end
end
