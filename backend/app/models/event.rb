class Event < ApplicationRecord
  include EventConstants
  
  has_many :likes, as: :likeable
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :reviews, as: :reviewable
  has_many :visits
  has_many :ticket_types, dependent: :destroy
  
  # 카테고리 확장: festival, exhibition, art, contest, concert, sports, market, education, food, other
  CATEGORIES = EventConstants::CATEGORIES.keys.freeze
  
  validates :title, presence: true
  validates :category, presence: true, inclusion: { in: CATEGORIES }
  validates :approval_status, inclusion: { in: %w[pending approved rejected] }
  validates :start_date, presence: true
  
  # 기본 스코프
  scope :upcoming, -> { approved.where('end_date >= ?', Date.today).order(start_date: :asc) }
  scope :ongoing, -> { approved.where('start_date <= ? AND end_date >= ?', Date.today, Date.today) }
  
  # 승인 상태 스코프
  scope :approved, -> { where(approval_status: 'approved') }
  scope :pending, -> { where(approval_status: 'pending') }
  scope :rejected, -> { where(approval_status: 'rejected') }
  
  # 지역별 필터 스코프
  scope :by_region, ->(region) { where(region: region) if region.present? }
  
  # 카테고리별 필터 스코프
  scope :by_category, ->(category) {
    if category.is_a?(String) && category.include?(',')
      categories = category.split(',').map(&:strip)
      approved.where(category: categories)
    elsif category.is_a?(Array)
      approved.where(category: category)
    else
      approved.where(category: category) if category.present?
    end
  }
  
  # 복합 필터
  scope :filter_by, ->(params) {
    result = approved
    result = result.by_category(params[:category]) if params[:category].present?
    result = result.by_region(params[:region]) if params[:region].present?
    result = result.where('title LIKE ? OR location LIKE ?', "%#{params[:q]}%", "%#{params[:q]}%") if params[:q].present?
    result
  }
  
  # 콜백: 저장 전 지역 자동 감지
  before_save :auto_detect_region, if: -> { region.blank? && location.present? }
  
  def status
    return 'ended' if end_date && end_date < Date.today
    return 'ongoing' if start_date <= Date.today && (!end_date || end_date >= Date.today)
    'upcoming'
  end
  
  def duration_text
    if end_date
      "#{start_date.strftime('%Y.%m.%d')} - #{end_date.strftime('%Y.%m.%d')}"
    else
      start_date.strftime('%Y.%m.%d')
    end
  end
  
  # 지역명 반환
  def region_name
    EventConstants::REGIONS.dig(region, :name) || '전국'
  end
  
  # 카테고리명 반환
  def category_name
    EventConstants::CATEGORIES.dig(category, :name) || '기타'
  end
  
  private
  
  def auto_detect_region
    self.region = Event.detect_region_from_location(location)
  end
end

