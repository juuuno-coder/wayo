class EventReportsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_event_report, only: %i[ show update destroy ]

  # GET /event_reports
  def index
    @event_reports = current_user.event_reports
    render json: @event_reports
  end

  # GET /event_reports/1
  def show
    render json: @event_report
  end

  # POST /event_reports
  def create
    @event_report = current_user.event_reports.build(event_report_params)
    @event_report.status ||= 'pending' # Default status

    if @event_report.save
      render json: @event_report, status: :created, location: @event_report
    else
      render json: @event_report.errors, status: :unprocessable_content
    end
  end

  # PATCH/PUT /event_reports/1
  def update
    if @event_report.update(event_report_params)
      render json: @event_report
    else
      render json: @event_report.errors, status: :unprocessable_content
    end
  end

  # DELETE /event_reports/1
  def destroy
    @event_report.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_event_report
      @event_report = EventReport.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def event_report_params
      params.expect(event_report: [ :user_id, :report_type, :title, :content, :location, :date_info, :status ])
    end
end
