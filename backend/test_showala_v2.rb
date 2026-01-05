require 'nokogiri'
require 'open-uri'

url = "https://www.showala.com/ex/ex_proc.php?action=exPagingNew&page=1"
user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
referer = "https://www.showala.com/ex/ex_list.php"

begin
  raw_response = URI.open(url, "User-Agent" => user_agent, "Referer" => referer).read
  puts "Raw Response Length: #{raw_response.length}"
  puts "First 100 chars: #{raw_response[0..100]}"
  
  html_chunk = raw_response.split(':::').first
  if html_chunk
    doc = Nokogiri::HTML(html_chunk)
    items = doc.css('li.ex_item')
    puts "Found #{items.count} items"
    
    items.first(3).each do |item|
       puts "Title: #{item.css('.ex_tit a').text.strip}"
    end
  else
    puts "No HTML chunk found"
  end
rescue => e
  puts "Error: #{e.message}"
end
