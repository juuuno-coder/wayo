class CreateEventReports < ActiveRecord::Migration[8.1]
  def change
    create_table :event_reports do |t|
      t.references :user, null: false, foreign_key: true
      t.string :report_type
      t.string :title
      t.text :content
      t.string :location
      t.string :date_info
      t.string :status

      t.timestamps
    end
  end
end
