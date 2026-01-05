File.open('debug_result_2.txt', 'w:UTF-8') do |f|
  begin
    f.puts "Starting debug 2..."
    path = File.expand_path("config/boot", Dir.pwd)
    f.puts "Path to require: #{path}"
    require path
    f.puts "Success!"
  rescue Exception => e
    f.puts "EXCEPTION: #{e.class}"
    f.puts "MESSAGE: #{e.message}"
    f.puts e.backtrace
  end
end
