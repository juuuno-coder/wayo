
require 'open-uri'
require 'nokogiri'

url = "https://www.showala.com/ex/ex_view.php?idx=3293"
puts "Fetching #{url}"

html = URI.open(url, "User-Agent" => "Mozilla/5.0").read
doc = Nokogiri::HTML(html)

puts "Searching for homepage link..."
# Strategy 1: Look for "홈페이지" text
doc.traverse do |node|
  if node.text? && node.text.include?("홈페이지")
    parent = node.parent
    # Check siblings or parent's siblings for a link
    puts "Found '홈페이지' in #{node.name}: #{node.text.strip}"
    
    # Check if there is an 'a' tag nearby
    link = parent.css('a').first || parent.next_element&.css('a')&.first || parent.parent.css('a').find { |a| a['href']&.start_with?('http') }
    
    if link
      puts "  => Found link: #{link['href']}"
    end
  end
end

# Strategy 2: Look for typical table structure
doc.css('tr').each do |tr|
  if tr.text.include?("홈페이지")
    link = tr.css('a').first
    if link
       puts "Table Row Match: #{link['href']}"
    end
  end
end
