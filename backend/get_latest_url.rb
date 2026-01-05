
e = Event.where("source_url LIKE '%showala%'").order(crawled_at: :desc).first
if e
  puts "URL: #{e.source_url}"
else
  puts "No Showala event found."
end
