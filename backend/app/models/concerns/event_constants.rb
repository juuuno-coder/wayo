# frozen_string_literal: true

# 이벤트 관련 상수 정의
# 지역, 카테고리 분류 체계
module EventConstants
  extend ActiveSupport::Concern

  # ============================================
  # 지역 분류 (17개 광역시/도 + 온라인/전국)
  # ============================================
  REGIONS = {
    'seoul' => { name: '서울', short: '서울', keywords: ['서울', '강남', '종로', '마포', '송파', '강서', '영등포'] },
    'busan' => { name: '부산', short: '부산', keywords: ['부산', '해운대', '남포동', 'BEXCO', '벡스코'] },
    'daegu' => { name: '대구', short: '대구', keywords: ['대구', 'EXCO', '엑스코'] },
    'incheon' => { name: '인천', short: '인천', keywords: ['인천', '송도', '인천공항'] },
    'gwangju' => { name: '광주', short: '광주', keywords: ['광주', '김대중컨벤션센터'] },
    'daejeon' => { name: '대전', short: '대전', keywords: ['대전', 'DCC', '대전컨벤션센터'] },
    'ulsan' => { name: '울산', short: '울산', keywords: ['울산'] },
    'sejong' => { name: '세종', short: '세종', keywords: ['세종', '세종시'] },
    'gyeonggi' => { name: '경기', short: '경기', keywords: ['경기', '수원', '성남', '고양', '용인', '안산', 'KINTEX', '킨텍스', '일산'] },
    'gangwon' => { name: '강원', short: '강원', keywords: ['강원', '춘천', '강릉', '속초', '원주', '평창'] },
    'chungbuk' => { name: '충북', short: '충북', keywords: ['충북', '충청북도', '청주', '충주'] },
    'chungnam' => { name: '충남', short: '충남', keywords: ['충남', '충청남도', '천안', '아산', '계룡'] },
    'jeonbuk' => { name: '전북', short: '전북', keywords: ['전북', '전라북도', '전주', '익산', '군산'] },
    'jeonnam' => { name: '전남', short: '전남', keywords: ['전남', '전라남도', '여수', '순천', '목포', '여수엑스포'] },
    'gyeongbuk' => { name: '경북', short: '경북', keywords: ['경북', '경상북도', '포항', '경주', '구미', '안동'] },
    'gyeongnam' => { name: '경남', short: '경남', keywords: ['경남', '경상남도', '창원', '김해', '거제', 'CECO'] },
    'jeju' => { name: '제주', short: '제주', keywords: ['제주', '서귀포', 'ICC제주'] },
    'online' => { name: '온라인', short: '온라인', keywords: ['온라인', 'ONLINE', '비대면', '화상'] },
    'nationwide' => { name: '전국', short: '전국', keywords: ['전국', '전 지역'] }
  }.freeze

  # ============================================
  # 카테고리 분류
  # ============================================
  CATEGORIES = {
    'festival' => { name: '축제', emoji: '🎉', color: 'bg-green-500' },
    'exhibition' => { name: '박람회', emoji: '🏢', color: 'bg-blue-500' },
    'art' => { name: '전시회', emoji: '🎨', color: 'bg-purple-500' },
    'contest' => { name: '공모전', emoji: '🏆', color: 'bg-orange-500' },
    'concert' => { name: '공연', emoji: '🎵', color: 'bg-pink-500' },
    'sports' => { name: '스포츠', emoji: '⚽', color: 'bg-red-500' },
    'market' => { name: '마켓/플리마켓', emoji: '🛍️', color: 'bg-yellow-500' },
    'education' => { name: '교육/세미나', emoji: '📚', color: 'bg-indigo-500' },
    'food' => { name: '음식/푸드페스타', emoji: '🍔', color: 'bg-amber-500' },
    'other' => { name: '기타', emoji: '📌', color: 'bg-gray-500' }
  }.freeze

  # ============================================
  # 공모전 세부 분류
  # ============================================
  CONTEST_TYPES = {
    'design' => { name: '디자인', keywords: ['디자인', 'UI', 'UX', '그래픽', '시각'] },
    'idea' => { name: '아이디어/기획', keywords: ['아이디어', '기획', '창업', '사업계획'] },
    'it' => { name: 'IT/SW', keywords: ['IT', '소프트웨어', 'SW', '프로그래밍', '앱', '웹', 'AI', '인공지능'] },
    'video' => { name: '영상/UCC', keywords: ['영상', 'UCC', '유튜브', '콘텐츠', '광고'] },
    'writing' => { name: '글/문학', keywords: ['글', '수필', '시', '소설', '에세이', '문학', '작문', '슬로건'] },
    'art' => { name: '미술/사진', keywords: ['미술', '회화', '일러스트', '캐릭터', '사진', '포토'] },
    'music' => { name: '음악/가창', keywords: ['음악', '작곡', '노래', '가창', '밴드'] },
    'architecture' => { name: '건축/인테리어', keywords: ['건축', '인테리어', '설계', '조경'] },
    'academic' => { name: '학술/논문', keywords: ['논문', '학술', '연구', '리서치'] },
    'other' => { name: '기타', keywords: [] }
  }.freeze

  included do
    # Scope for filtering by region
    scope :by_region, ->(region) { where(region: region) if region.present? }
    
    # Scope for filtering by category
    scope :by_category, ->(category) { where(category: category) if category.present? }
  end

  class_methods do
    # 위치 문자열에서 지역 코드 추출
    def detect_region_from_location(location_str)
      return 'nationwide' if location_str.blank?
      
      location = location_str.to_s.downcase
      
      REGIONS.each do |code, data|
        data[:keywords].each do |keyword|
          return code if location.include?(keyword.downcase)
        end
      end
      
      # 기본값: 전국
      'nationwide'
    end
    
    # 제목/내용에서 카테고리 추론 (보조용)
    def detect_category_from_text(text)
      return 'other' if text.blank?
      
      text_lower = text.to_s.downcase
      
      # 공모전 키워드
      return 'contest' if text_lower.match?(/공모전|공모|경진대회|경연|콘테스트/)
      
      # 축제 키워드
      return 'festival' if text_lower.match?(/축제|페스티벌|festival|festa/)
      
      # 전시회/박람회 구분
      return 'art' if text_lower.match?(/전시회|미술|갤러리|아트/)
      return 'exhibition' if text_lower.match?(/박람회|엑스포|expo|fair/)
      
      # 공연
      return 'concert' if text_lower.match?(/공연|콘서트|뮤지컬|오페라|연극/)
      
      # 마켓
      return 'market' if text_lower.match?(/마켓|플리마켓|장터|바자회/)
      
      # 음식
      return 'food' if text_lower.match?(/푸드|음식|맛집|요리|먹거리/)
      
      'other'
    end
  end
end
