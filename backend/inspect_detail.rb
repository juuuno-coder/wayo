require 'nokogiri'
require 'open-uri'

url = "https://www.showala.com/ex/ex_view.php?idx=3209"
user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"

puts "Fetching #{url}..."
begin
  html = URI.open(url, "User-Agent" => user_agent).read
  puts "Download success. Length: #{html.length}"
  doc = Nokogiri::HTML(html)
  
  title = doc.css('.ex_tit').text.strip
  puts "Title: #{title}"
  
  # Search for text containers
  ['.view_txt', '.ex_view_txt', '.txt_area', '#view_content', '.cnt_view'].each do |sel|
    content = doc.css(sel).text.strip
    puts "Selector '#{sel}': #{content.length} chars"
    puts "Preview: #{content[0..100]}" if content.length > 0
  end
  
rescue OpenURI::HTTPError => e
  puts "HTTP Error: #{e.message}"
rescue => e
  puts "Error: #{e.message}"
end
