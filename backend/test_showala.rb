require 'nokogiri'
require 'open-uri'

# URL found by subagent: https://www.showala.com/ex/ex_proc.php?action=exPagingNew&page=1
url = "https://www.showala.com/ex/ex_proc.php?action=exPagingNew&page=1"
user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"

begin
  # The response format is HTML_CHUNK:::PAGE:::TOTAL
  raw_response = URI.open(url, "User-Agent" => user_agent).read
  html_chunk = raw_response.split(':::').first
  
  doc = Nokogiri::HTML(html_chunk)
  items = doc.css('li.ex_item')
  
  puts "Found #{items.count} items"
  
  items.each do |item|
    title = item.css('.ex_tit a').text.strip
    date_text = item.css('.ex_date').text.strip # "전시기간 : 2025-11-28 ~ 2026-02-04"
    place_text = item.css('.ex_place').text.strip # "개최장소 : 제주한라컨벤션센터"
    
    # Image URL is in style attribute: background-image:url('/data/exhibit/...')
    style = item.css('.ex_img_in').attr('style')&.value
    img_url = style&.match(/url\(['"]?([^'"]+)['"]?\)/)&.[](1)
    full_img_url = img_url ? "https://www.showala.com#{img_url}" : nil
    
    # Clean up prefixes
    date_clean = date_text.gsub('전시기간 :', '').strip
    place_clean = place_text.gsub('개최장소 :', '').strip
    
    puts "Title: #{title}"
    puts "Date: #{date_clean}"
    puts "Place: #{place_clean}"
    puts "Image: #{full_img_url}"
    puts "---"
  end
rescue => e
  puts "Error: #{e.message}"
end
