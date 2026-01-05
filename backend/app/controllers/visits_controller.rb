class VisitsController < ApplicationController
  before_action :authenticate_user!

  # GET /visits
  # Returns all visits for the current user (Passport Book data)
  def index
    @visits = current_user.visits.includes(:event).order(visited_at: :desc)
    
    render json: @visits.as_json(
      include: { 
        event: { 
          only: [:id, :title, :start_date, :end_date, :image_url, :location] 
        }
      }
    )
  end

  # POST /visits
  # Check-in to an event
  def create
    @visit = current_user.visits.build(visit_params)
    @visit.visited_at ||= Time.current

    if @visit.save
      render json: { message: 'Checked in successfully', visit: @visit }, status: :created
    else
      render json: { errors: @visit.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /visits/:id
  # Update visit details (decoration, content, photos)
  def update
    @visit = current_user.visits.find(params[:id])

    if @visit.update(visit_params)
      render json: { message: 'Visit updated', visit: @visit }
    else
      render json: { errors: @visit.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /visits/:id
  def destroy
    @visit = current_user.visits.find(params[:id])
    @visit.destroy
    render json: { message: 'Visit removed' }
  end

  private

  def visit_params
    params.require(:visit).permit(:event_id, :content, :visited_at, :decoration_metadata, images: [])
  end
end
