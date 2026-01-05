File.open('debug_result.txt', 'w:UTF-8') do |f|
  begin
    f.puts "Starting debug..."
    f.puts "Current Dir: #{Dir.pwd}"
    
    app_path = File.expand_path("config/application", Dir.pwd)
    f.puts "APP_PATH calculated: #{app_path}"
    
    f.puts "Attempting to require config/boot..."
    require_relative "config/boot"
    f.puts "config/boot loaded successfully."
    
    f.puts "Attempting to require rails/commands..."
    require "rails/commands"
    f.puts "rails/commands loaded successfully."
    
  rescue Exception => e
    f.puts "EXCEPTION CAUGHT: #{e.class}"
    f.puts "MESSAGE: #{e.message}"
    f.puts "BACKTRACE:"
    f.puts e.backtrace
  end
end
