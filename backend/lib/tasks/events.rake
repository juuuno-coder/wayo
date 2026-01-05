namespace :events do
  desc "Update existing events status to 'approved'"
  task approve_existing: :environment do
    count = Event.where(approval_status: nil).update_all(approval_status: 'approved')
    puts "Updated #{count} events to 'approved' status."
  end

  desc "Manually trigger event data collection"
  task fetch: :environment do
    puts "Starting manual data collection..."
    EventDataService.call
    puts "Data collection finished."
  end
end
