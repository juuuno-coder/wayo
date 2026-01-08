class AddEventEndDateToInvitations < ActiveRecord::Migration[8.1]
  def change
    add_column :invitations, :event_end_date, :datetime
  end
end
