ENV["BUNDLE_GEMFILE"] ||= File.expand_path("../Gemfile", __dir__)

require "bundler/setup" # Set up gems listed in the Gemfile.
# Bootsnap is disabled to prevent encoding issues with Korean paths on Windows
# require "bootsnap/setup" # Speed up boot time by caching expensive operations.
