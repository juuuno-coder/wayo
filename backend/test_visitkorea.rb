require 'nokogiri'
require 'open-uri'

url = "https://korean.visitkorea.or.kr/kfes/list/w_festival_list.do"
user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"

begin
  html = URI.open(url, "User-Agent" => user_agent).read
  doc = Nokogiri::HTML(html)
  puts "HTML Title: #{doc.at('title')&.text}"
  # Check for list items
  # Based on visitkorea, items are likely in .festival_list or similar
  # Let's print some classes
  puts "Body classes: #{doc.at('body')&.attr('class')}"
rescue => e
  puts "Error: #{e.message}"
end
