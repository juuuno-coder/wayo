class AddRegionToEvents < ActiveRecord::Migration[8.1]
  def change
    add_column :events, :region, :string
  end
end
