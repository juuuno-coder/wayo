require 'httparty'

# 한국관광공사 Tour API 서비스
# 공공데이터포털에서 API 키 발급 필요: https://data.go.kr
class TourApiService
  include HTTParty
  base_uri 'http://apis.data.go.kr/B551011/KorService1'
  
  # API 키는 환경 변수 또는 credentials에서 가져옴
  def initialize
    @api_key = Rails.application.credentials.dig(:tour_api, :key) || ENV['TOUR_API_KEY']
    
    if @api_key.blank?
      Rails.logger.warn "[TourAPI] API key not found. Please set TOUR_API_KEY environment variable."
    end
  end
  
  # 축제/공연 정보 조회
  # @param start_date [Date] 검색 시작일
  # @param end_date [Date] 검색 종료일
  # @param area_code [Integer] 지역 코드 (1:서울, 6:부산 등)
  # @param page [Integer] 페이지 번호
  # @return [Array<Hash>] 축제 정보 배열
  def fetch_festivals(start_date: Date.today, end_date: Date.today + 90.days, area_code: nil, page: 1)
    return [] if @api_key.blank?
    
    begin
      response = self.class.get('/searchFestival1', query: build_query_params({
        eventStartDate: start_date.strftime('%Y%m%d'),
        eventEndDate: end_date.strftime('%Y%m%d'),
        areaCode: area_code,
        numOfRows: 100,
        pageNo: page
      }))
      
      parse_response(response)
    rescue => e
      Rails.logger.error "[TourAPI] Error fetching festivals: #{e.message}"
      []
    end
  end
  
  # 관광지 정보 조회
  def fetch_tourist_spots(area_code: nil, page: 1)
    return [] if @api_key.blank?
    
    begin
      response = self.class.get('/areaBasedList1', query: build_query_params({
        areaCode: area_code,
        contentTypeId: 12, # 12: 관광지
        numOfRows: 100,
        pageNo: page
      }))
      
      parse_response(response)
    rescue => e
      Rails.logger.error "[TourAPI] Error fetching tourist spots: #{e.message}"
      []
    end
  end
  
  # 상세 정보 조회
  def fetch_detail(content_id:, content_type_id:)
    return nil if @api_key.blank?
    
    begin
      response = self.class.get('/detailCommon1', query: build_query_params({
        contentId: content_id,
        contentTypeId: content_type_id,
        defaultYN: 'Y',
        firstImageYN: 'Y',
        addrinfoYN: 'Y',
        mapinfoYN: 'Y',
        overviewYN: 'Y'
      }))
      
      items = parse_response(response)
      items.first
    rescue => e
      Rails.logger.error "[TourAPI] Error fetching detail: #{e.message}"
      nil
    end
  end
  
  private
  
  # 공통 쿼리 파라미터 생성
  def build_query_params(params = {})
    {
      serviceKey: @api_key,
      MobileOS: 'ETC',
      MobileApp: 'Gabojago',
      _type: 'json'
    }.merge(params.compact)
  end
  
  # API 응답 파싱
  def parse_response(response)
    return [] unless response.success?
    
    body = JSON.parse(response.body)
    
    # API 에러 체크
    result_code = body.dig('response', 'header', 'resultCode')
    if result_code != '0000'
      result_msg = body.dig('response', 'header', 'resultMsg')
      Rails.logger.error "[TourAPI] API Error: #{result_code} - #{result_msg}"
      return []
    end
    
    # 아이템 추출
    items = body.dig('response', 'body', 'items', 'item')
    return [] if items.blank?
    
    # 배열로 변환 (단일 아이템인 경우 배열로 감싸기)
    items = [items] unless items.is_a?(Array)
    
    items.map { |item| normalize_item(item) }
  end
  
  # 아이템 정규화 (Event 모델에 맞게 변환)
  def normalize_item(item)
    {
      title: clean_html(item['title']),
      location: item['addr1'] || item['addr2'] || '정보 없음',
      start_date: parse_date(item['eventstartdate']),
      end_date: parse_date(item['eventenddate']),
      image_url: item['firstimage'] || item['firstimage2'],
      description: clean_html(item['overview']),
      source_url: build_detail_url(item['contentid']),
      organizer: item['sponsor1'] || '한국관광공사',
      price: item['usetimefestival'],
      is_free: item['usetimefestival']&.include?('무료') || false,
      # Tour API 메타데이터
      tour_api_content_id: item['contentid'],
      tour_api_content_type_id: item['contenttypeid'],
      latitude: item['mapy'],
      longitude: item['mapx']
    }
  end
  
  # HTML 태그 제거
  def clean_html(text)
    return nil if text.blank?
    text.gsub(/<[^>]*>/, '').strip
  end
  
  # 날짜 파싱
  def parse_date(date_str)
    return Date.today if date_str.blank?
    Date.parse(date_str)
  rescue
    Date.today
  end
  
  # 상세 페이지 URL 생성
  def build_detail_url(content_id)
    "https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=#{content_id}"
  end
  
  # 지역 코드 매핑 (Tour API 지역 코드 -> 우리 시스템 지역 코드)
  AREA_CODE_MAPPING = {
    1 => 'seoul',
    2 => 'incheon',
    3 => 'daejeon',
    4 => 'daegu',
    5 => 'gwangju',
    6 => 'busan',
    7 => 'ulsan',
    8 => 'sejong',
    31 => 'gyeonggi',
    32 => 'gangwon',
    33 => 'chungbuk',
    34 => 'chungnam',
    35 => 'gyeongbuk',
    36 => 'gyeongnam',
    37 => 'jeonbuk',
    38 => 'jeonnam',
    39 => 'jeju'
  }.freeze
  
  def self.area_code_to_region(area_code)
    AREA_CODE_MAPPING[area_code.to_i] || 'nationwide'
  end
end
