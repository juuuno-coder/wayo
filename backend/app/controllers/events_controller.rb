class EventsController < ApplicationController
  # 복합 지역 매핑 (프론트엔드의 간소화된 지역을 DB의 세부 지역으로 매핑)
  REGION_GROUPS = {
    'gyeonggi' => %w[gyeonggi incheon],
    'chungcheong' => %w[chungbuk chungnam sejong daejeon],
    'jeolla' => %w[jeonbuk jeonnam gwangju],
    'gyeongsang' => %w[gyeongbuk gyeongnam ulsan]
  }.freeze

  # 이벤트 목록 (카테고리/지역별 필터링 가능)
  def index
    @events = Event.approved.upcoming
    
    # 카테고리 필터
    @events = @events.by_category(params[:category]) if params[:category].present?
    
    # 지역 필터 (복합 지역 지원)
    if params[:region].present?
      requested_regions = params[:region].to_s.split(',').map(&:strip)
      
      # 확장된 지역 목록 생성
      expanded_regions = requested_regions.flat_map do |r|
        REGION_GROUPS.key?(r) ? REGION_GROUPS[r] : r
      end.uniq
      
      @events = @events.by_region(expanded_regions)
    end
    
    # 정렬
    @events = case params[:sort]
              when 'end_date' then @events.order(end_date: :asc)
              when 'popular' then @events.left_joins(:likes).group(:id).order('COUNT(likes.id) DESC')
              else @events.order(start_date: :asc)
              end
    
    # 페이지네이션 (옵션)
    if params[:limit].present?
      @events = @events.limit(params[:limit].to_i)
    end
    
    render json: @events
  end

  # 이벤트 상세
  def show
    @event = Event.find(params[:id])
    render json: @event.as_json.merge(
      region_name: @event.region_name,
      category_name: @event.category_name,
      status: @event.status
    )
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Event not found' }, status: :not_found
  end

  # 검색
  def search
    query = params[:q]
    if query.present?
      @events = Event.approved
                     .where("title LIKE ? OR location LIKE ? OR organizer LIKE ?", 
                            "%#{query}%", "%#{query}%", "%#{query}%")
                     .upcoming
      
      # 추가 필터 적용
      @events = @events.by_category(params[:category]) if params[:category].present?
      
      if params[:region].present?
        # TODO: Refactor region logic to shared method if needed, using simple by_region for now as search is mostly keyword based
        @events = @events.by_region(params[:region].to_s.split(','))
      end
    else
      @events = []
    end
    render json: @events
  end
  
  # 진행중인 이벤트
  def ongoing
    @events = Event.ongoing
    @events = @events.by_category(params[:category]) if params[:category].present?
    @events = @events.by_category(params[:category]) if params[:category].present?
    
    if params[:region].present?
        @events = @events.by_region(params[:region].to_s.split(','))
    end
    @events = @events.order(start_date: :asc)
    render json: @events
  end
  
  # 지역/카테고리 메타데이터 (프론트엔드용)
  def metadata
    render json: {
      regions: EventConstants::REGIONS.map { |code, data| { code: code, name: data[:name], short: data[:short] } },
      categories: EventConstants::CATEGORIES.map { |code, data| { code: code, name: data[:name], emoji: data[:emoji] } },
      stats: {
        total: Event.approved.count,
        by_category: EventConstants::CATEGORIES.keys.map { |cat| { category: cat, count: Event.approved.by_category(cat).count } },
        by_region: EventConstants::REGIONS.keys.map { |reg| { region: reg, count: Event.approved.by_region(reg).count } }
      }
    }
  end
end

