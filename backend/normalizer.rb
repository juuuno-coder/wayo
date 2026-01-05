# Normalizer script
puts "Normalizing events status..."
count = Event.where(approval_status: nil).update_all(approval_status: 'approved')
puts "Updated #{count} events."

puts "Triggering test data collection..."
EventDataService.call
puts "Data collection finished."
