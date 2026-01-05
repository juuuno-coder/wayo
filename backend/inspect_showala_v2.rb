
require 'open-uri'
require 'nokogiri'

url = "https://www.showala.com/ex/ex_view.php?idx=3293"
puts "Fetching #{url}"

begin
  html = URI.open(url, "User-Agent" => "Mozilla/5.0 (Windows NT 10.0; Win64; x64)").read
  doc = Nokogiri::HTML(html)

  found = false
  # Strategy: Look for table row with "홈페이지"
  doc.css('tr').each do |tr|
    if tr.text.include?("홈페이지")
      link = tr.css('a').first
      if link
         puts "Table Row Match: #{link['href']}"
         found = true
      end
    end
  end

  unless found
    puts "No explicit homepage row found. Dumping all links:"
    doc.css('a').each do |a|
      puts "Link: #{a.text.strip} -> #{a['href']}" if a['href']&.start_with?('http')
    end
  end

rescue => e
  puts "Error: #{e.class} - #{e.message}"
end
