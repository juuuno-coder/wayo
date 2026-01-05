
require 'open-uri'
require 'nokogiri'

base_url = "https://www.showala.com/ex/ex_list.php"
puts "Fetching list from #{base_url}"

begin
  html = URI.open(base_url, "User-Agent" => "Mozilla/5.0 (Windows NT 10.0; Win64; x64)").read
  doc = Nokogiri::HTML(html)
  
  first_item = doc.css('.ex_tit a').first
  unless first_item
    puts "No items found in list."
    exit
  end
  
  href = first_item['href']
  detail_url = "https://www.showala.com/ex/ex_view.php?#{href.split('?').last}"
  puts "Found item: #{first_item.text.strip}"
  puts "Detail URL: #{detail_url}"
  
  # Fetch detail
  html_detail = URI.open(detail_url, "User-Agent" => "Mozilla/5.0 (Windows NT 10.0; Win64; x64)").read
  doc_detail = Nokogiri::HTML(html_detail)
  
  puts "Inspecting detail page..."
  found_link = nil
  
  # Look for '홈페이지' in table rows
  doc_detail.css('tr').each do |tr|
    header = tr.css('th').text
    if header.include?("홈페이지") || tr.text.include?("홈페이지")
      link = tr.css('a').find { |a| a['href']&.start_with?('http') }
      if link
        found_link = link['href']
        puts "FOUND HOMEPAGE: #{found_link}"
        break
      end
    end
  end
  
  unless found_link
    puts "Homepage link not found in standard table row."
    # Dump table rows for debugging
    doc_detail.css('tr').each { |tr| puts "TR: #{tr.text.gsub(/\s+/, ' ').strip}" }
  end

rescue => e
  puts "Error: #{e.class} - #{e.message}"
end
