class FetchEventsJob < ApplicationJob
  queue_as :default

  def perform
    EventDataService.call
  end
end
