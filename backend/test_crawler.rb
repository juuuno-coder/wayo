require 'nokogiri'
require 'open-uri'

url = "https://www.mcst.go.kr/kor/s_culture/festival/festivalList.jsp"
begin
  doc = Nokogiri::HTML(URI.open(url))
  items = doc.css('ul.list_style03 li')
  items.each do |item|
    title = item.css('p.title a').text.strip
    img_src = item.css('div.img img').attr('src')&.value
    full_img_url = img_src ? "https://www.mcst.go.kr#{img_src}" : nil
    puts "Title: #{title}"
    puts "Image: #{full_img_url}"
    puts "---"
  end
rescue => e
  puts "Error: #{e.message}"
end
