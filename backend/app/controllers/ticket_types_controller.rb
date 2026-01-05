class TicketTypesController < ApplicationController
  def index
    @ticket_types = TicketType.includes(:event).all
    render json: @ticket_types.as_json(include: { event: { only: [:title, :location] } })
  end
  
  def show
    @ticket_type = TicketType.includes(:event).find(params[:id])
    render json: @ticket_type.as_json(include: { event: { only: [:title, :location] } })
  end
end
