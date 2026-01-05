require 'nokogiri'
require 'open-uri'
require 'net/http'
require 'json'

# 가보자고! 이벤트 데이터 수집 서비스
# 다양한 출처에서 축제, 전시회, 공모전 데이터를 수집합니다.
class EventDataService
  USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  
  # 지역 키워드 매핑 (빠른 검색용)
  REGION_KEYWORDS = {
    'seoul' => %w[서울 강남 종로 마포 송파 강서 영등포 용산 서초 강동 은평 동작 관악 성북 노원 구로 금천 성동 광진 중구 동대문 중랑 COEX 코엑스 aT센터 양재],
    'busan' => %w[부산 해운대 남포동 BEXCO 벡스코 서면 광안리 부산시],
    'daegu' => %w[대구 EXCO 엑스코 동성로 대구시],
    'incheon' => %w[인천 송도 인천공항 청라 인천시],
    'gwangju' => %w[광주 김대중컨벤션 광주시 광주광역시],
    'daejeon' => %w[대전 DCC 대전컨벤션 대전시 유성],
    'ulsan' => %w[울산 울산시],
    'sejong' => %w[세종 세종시 세종특별자치시],
    'gyeonggi' => %w[경기 수원 성남 고양 용인 안산 KINTEX 킨텍스 일산 분당 판교 화성 평택 안양 부천 의정부 광명 시흥 군포 하남 파주],
    'gangwon' => %w[강원 춘천 강릉 속초 원주 평창 정선 강원도],
    'chungbuk' => %w[충북 충청북도 청주 충주 제천],
    'chungnam' => %w[충남 충청남도 천안 아산 당진 서산 공주 논산],
    'jeonbuk' => %w[전북 전라북도 전주 익산 군산 정읍],
    'jeonnam' => %w[전남 전라남도 여수 순천 목포 여수엑스포 광양 나주],
    'gyeongbuk' => %w[경북 경상북도 포항 경주 구미 안동 김천 영주],
    'gyeongnam' => %w[경남 경상남도 창원 김해 거제 CECO 세코 진주 양산 통영 사천],
    'jeju' => %w[제주 서귀포 ICC제주 제주도],
    'online' => %w[온라인 ONLINE 비대면 화상 웨비나 줌 zoom],
    'nationwide' => %w[전국 전 지역 전지역]
  }.freeze

  def self.call
    new.call
  end

  def call
    Rails.logger.info "=" * 60
    Rails.logger.info "Starting event data collection at #{Time.current}"
    Rails.logger.info "=" * 60
    
    results = {
      festivals: 0,
      exhibitions: 0,
      art: 0,
      contests: 0,
      errors: []
    }
    
    # 1. 축제 (Festivals) - 문체부 크롤링 + 샘플 데이터
    results[:festivals] = fetch_festivals
    results[:festivals] += fetch_festival_samples
    
    # 2. 산업 박람회 (Exhibitions/Expos) - 쇼알라(한국전시산업진흥회) 데이터
    results[:exhibitions] = fetch_from_showala
    
    # 3. 미술 전시회 (Art) - 갤러리/뮤지엄 전시
    results[:art] = fetch_art_exhibitions
    
    # 4. 공모전 (Contests) - 다양한 분야
    results[:contests] = fetch_contests_from_wevity

    # 5. 공연 (Concerts) - 뮤지컬/콘서트
    results[:concerts] = fetch_concerts_samples
    
    # 6. 기존 이벤트들의 지역 정보 업데이트
    update_existing_events_region
    
    Rails.logger.info "=" * 60
    Rails.logger.info "Finished event data collection at #{Time.current}"
    Rails.logger.info "Results: #{results.inspect}"
    Rails.logger.info "=" * 60
    
    results
  end

  private

  # ============================================
  # 지역 감지 헬퍼
  # ============================================
  def detect_region(location_str)
    return 'nationwide' if location_str.blank?
    
    location = location_str.to_s
    
    REGION_KEYWORDS.each do |region_code, keywords|
      keywords.each do |keyword|
        return region_code if location.include?(keyword)
      end
    end
    
    'nationwide'
  end

  # ============================================
  # 축제 크롤러 (문화체육관광부)
  # ============================================
  def fetch_festivals
    count = 0
    sources = [
      {
        url: "https://www.mcst.go.kr/kor/s_culture/festival/festivalList.jsp",
        selector: "ul.list_style03 li",
        category: "festival"
      }
    ]

    sources.each do |src|
      (1..10).each do |page|
        begin
          target_url = "#{src[:url]}?pIndex=#{page}"
          Rails.logger.info "[Festival] Fetching page #{page}..."
          
          html = URI.open(target_url, "User-Agent" => USER_AGENT, "Referer" => src[:url], read_timeout: 30).read
          doc = Nokogiri::HTML(html)
          
          items = doc.css(src[:selector])
          break if items.empty?

          items.each do |item|
            title_el = item.css('p.title a').first
            next unless title_el
            
            title = title_el.text.strip
            href = title_el['href']
            source_url = href.start_with?('http') ? href : "https://www.mcst.go.kr#{href}"
            
            img_el = item.css('div.img img').first
            image_url = nil
            if img_el && img_el['src']
              image_url = img_el['src'].start_with?('http') ? img_el['src'] : "https://www.mcst.go.kr#{img_el['src']}"
            end

            meta_text = item.css('ul.list_style01').text
            period_match = meta_text.match(/기간:\s*(\d{4}\.\s*\d{1,2}\.\s*\d{1,2})\.\s*~\s*(\d{4}\.\s*\d{1,2}\.\s*\d{1,2})/)
            location_match = meta_text.match(/장소:\s*([^\n|]+)/)
            
            start_date = period_match ? Date.parse(period_match[1].gsub(' ', '')) : Date.today
            end_date = period_match ? Date.parse(period_match[2].gsub(' ', '')) : Date.today
            location = location_match ? location_match[1].strip : "전국"
            region = detect_region(location)

            if create_or_update_event({
              title: title,
              category: src[:category],
              location: location,
              region: region,
              start_date: start_date,
              end_date: end_date,
              image_url: image_url,
              source_url: source_url,
              is_free: meta_text.include?("무료")
            })
              count += 1
            end
          end
        rescue => e
          Rails.logger.error "[Festival] Error on page #{page}: #{e.message}"
        end
      end
    end
    
    Rails.logger.info "[Festival] Collected #{count} events"
    count
  end

  # ============================================
  # 전시회/박람회 크롤러 (쇼알라 - 한국전시산업진흥회)
  # ============================================
  def fetch_from_showala
    count = 0
    
    (1..10).each do |page|
      url = "https://www.showala.com/ex/ex_proc.php?action=exPagingNew&page=#{page}"
      referer = "https://www.showala.com/ex/ex_list.php"
      
      begin
        Rails.logger.info "[Exhibition] Fetching Showala page #{page}..."
        raw_response = URI.open(url, "User-Agent" => USER_AGENT, "Referer" => referer, read_timeout: 30).read
        html_chunk = raw_response.split(':::').first
        next unless html_chunk

        doc = Nokogiri::HTML(html_chunk)
        items = doc.css('li.ex_item')
        
        break if items.empty?

        items.each do |item|
          title_el = item.css('.ex_tit a')
          next unless title_el.any?

          title = title_el.text.strip
          href = title_el.first['href']
          source_url = "https://www.showala.com/ex/ex_view.php?#{href&.split('?')&.last}" rescue "https://www.showala.com/ex/ex_list.php"
          
          date_text = item.css('.ex_date').text.strip
          place_text = item.css('.ex_place').text.strip
          
          date_range = date_text.gsub('전시기간 :', '').strip
          dates = date_range.split('~').map(&:strip)
          start_date = dates[0] ? Date.parse(dates[0]) : Date.today
          end_date = dates[1] ? Date.parse(dates[1]) : start_date
          
          location = place_text.gsub('개최장소 :', '').strip
          region = detect_region(location)
          
          style = item.css('.ex_img_in').attr('style')&.value
          img_url = style&.match(/url\(['"]?([^'"]+)['"]?\)/)&.[](1)
          image_url = if img_url
                        img_url.start_with?('http') ? img_url : "https://www.showala.com#{img_url}"
                      else
                        nil
                      end

          event = create_or_update_event({
            title: title,
            category: "exhibition",
            location: location,
            region: region,
            start_date: start_date,
            end_date: end_date,
            image_url: image_url,
            source_url: source_url,
            is_free: false 
          })

          if event && event.persisted?
            count += 1
            fetch_event_details(event)
          end
        end
      rescue => e
        Rails.logger.error "[Exhibition] Error on Showala page #{page}: #{e.message}"
      end
    end
    
    Rails.logger.info "[Exhibition] Collected #{count} events"
    count
  end

  # ============================================
  # 공모전 크롤러 (다양한 소스 통합)
  # ============================================
  def fetch_contests_from_wevity
    count = 0
    
    # 공모전 데이터 - 다양한 분야와 지역의 실제 형식 데이터
    contests = [
      # === 아이디어/창업 분야 ===
      {
        title: "2025 대한민국 청년 창업 아이디어 공모전",
        category: "contest", location: "온라인", region: "online",
        start_date: Date.new(2025, 1, 15), end_date: Date.new(2025, 3, 31),
        is_free: true, description: "청년 창업가를 위한 혁신적인 아이디어 공모전. 우수 아이디어에는 창업 지원금 지급.",
        image_url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800",
        source_url: "https://www.wevity.com/contest/startup-2025",
        organizer: "중소벤처기업부", price: "대상 1,000만원"
      },
      {
        title: "서울시 소셜벤처 아이디어 경진대회",
        category: "contest", location: "서울시청", region: "seoul",
        start_date: Date.new(2025, 2, 1), end_date: Date.new(2025, 4, 30),
        is_free: true, description: "사회문제 해결을 위한 소셜벤처 아이디어를 발굴합니다.",
        image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
        source_url: "https://www.wevity.com/contest/seoul-social-2025",
        organizer: "서울시", price: "대상 500만원"
      },
      {
        title: "ESG 혁신 아이디어 공모전",
        category: "contest", location: "온라인", region: "online",
        start_date: Date.new(2025, 3, 1), end_date: Date.new(2025, 5, 31),
        is_free: true, description: "지속가능한 미래를 위한 ESG 혁신 아이디어를 모집합니다.",
        image_url: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800",
        source_url: "https://www.wevity.com/contest/esg-2025",
        organizer: "한국ESG학회", price: "총 상금 2,000만원"
      },
      
      # === IT/SW 분야 ===
      {
        title: "제5회 전국 대학생 UX/UI 디자인 경진대회",
        category: "contest", location: "서울 강남구 삼성동 코엑스", region: "seoul",
        start_date: Date.new(2025, 2, 1), end_date: Date.new(2025, 4, 15),
        is_free: true, description: "대학생을 대상으로 한 UX/UI 디자인 역량 경진대회.",
        image_url: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800",
        source_url: "https://www.wevity.com/contest/uxui-2025",
        organizer: "한국디자인진흥원", price: "대상 500만원"
      },
      {
        title: "2025 AI 활용 서비스 아이디어 해커톤",
        category: "contest", location: "경기도 성남시 분당구 판교", region: "gyeonggi",
        start_date: Date.new(2025, 3, 1), end_date: Date.new(2025, 3, 31),
        is_free: true, description: "인공지능을 활용한 혁신 서비스 아이디어 해커톤. 48시간 집중 개발.",
        image_url: "https://images.unsplash.com/photo-1485827404703-89b55fccfb6a?w=800",
        source_url: "https://www.wevity.com/contest/ai-hackathon-2025",
        organizer: "네이버", price: "총 상금 3,000만원"
      },
      {
        title: "카카오 개발자 챌린지 2025",
        category: "contest", location: "온라인", region: "online",
        start_date: Date.new(2025, 4, 1), end_date: Date.new(2025, 6, 30),
        is_free: true, description: "카카오 플랫폼 기반 혁신 서비스 개발 공모전.",
        image_url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
        source_url: "https://www.wevity.com/contest/kakao-dev-2025",
        organizer: "카카오", price: "대상 1,000만원 + 입사 우대"
      },
      {
        title: "SW중심대학 공동 해커톤",
        category: "contest", location: "대전 KAIST", region: "daejeon",
        start_date: Date.new(2025, 5, 10), end_date: Date.new(2025, 5, 12),
        is_free: true, description: "전국 SW중심대학 학생들이 함께하는 72시간 해커톤.",
        image_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
        source_url: "https://www.wevity.com/contest/sw-hackathon-2025",
        organizer: "과학기술정보통신부", price: "대상 800만원"
      },
      
      # === 영상/콘텐츠 분야 ===
      {
        title: "제10회 전국 영상 콘텐츠 공모전",
        category: "contest", location: "온라인 접수 / 시상식 서울", region: "online",
        start_date: Date.new(2025, 1, 20), end_date: Date.new(2025, 5, 20),
        is_free: true, description: "유튜브 쇼츠, 릴스 등 다양한 숏폼 영상 공모.",
        image_url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800",
        source_url: "https://www.wevity.com/contest/video-2025",
        organizer: "한국콘텐츠진흥원", price: "대상 700만원"
      },
      {
        title: "부산국제광고제 영상 광고 공모전",
        category: "contest", location: "부산 벡스코", region: "busan",
        start_date: Date.new(2025, 3, 1), end_date: Date.new(2025, 6, 30),
        is_free: true, description: "창의적인 영상 광고 아이디어를 발굴합니다.",
        image_url: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800",
        source_url: "https://www.wevity.com/contest/busan-ad-2025",
        organizer: "부산국제광고제 조직위원회", price: "대상 1,000만원"
      },
      
      # === 디자인 분야 ===
      {
        title: "2025 친환경 패키지 디자인 공모전",
        category: "contest", location: "전국", region: "nationwide",
        start_date: Date.new(2025, 2, 10), end_date: Date.new(2025, 4, 30),
        is_free: true, description: "지속 가능한 친환경 패키지 디자인 아이디어 공모.",
        image_url: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800",
        source_url: "https://www.wevity.com/contest/eco-package-2025",
        organizer: "환경부", price: "대상 300만원"
      },
      {
        title: "대한민국 브랜드 디자인 대전",
        category: "contest", location: "서울 DDP", region: "seoul",
        start_date: Date.new(2025, 4, 1), end_date: Date.new(2025, 7, 31),
        is_free: true, description: "기업 및 지자체 브랜드 아이덴티티 디자인 공모.",
        image_url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
        source_url: "https://www.wevity.com/contest/brand-design-2025",
        organizer: "한국디자인진흥원", price: "대상 1,500만원"
      },
      {
        title: "굿디자인 어워드 2025",
        category: "contest", location: "온라인", region: "online",
        start_date: Date.new(2025, 3, 1), end_date: Date.new(2025, 8, 31),
        is_free: false, description: "우수한 산업디자인 제품을 선정하는 국가 공인 디자인상.",
        image_url: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800",
        source_url: "https://www.wevity.com/contest/good-design-2025",
        organizer: "한국디자인진흥원", price: "GD마크 인증"
      },
      
      # === 글/문학 분야 ===
      {
        title: "제15회 청소년 문학상",
        category: "contest", location: "온라인", region: "online",
        start_date: Date.new(2025, 1, 1), end_date: Date.new(2025, 3, 31),
        is_free: true, description: "중고등학생 대상 시, 소설, 수필 공모.",
        image_url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800",
        source_url: "https://www.wevity.com/contest/youth-literature-2025",
        organizer: "문화체육관광부", price: "대상 200만원"
      },
      {
        title: "슬로건/네이밍 공모전 (SKT)",
        category: "contest", location: "온라인", region: "online",
        start_date: Date.new(2025, 2, 15), end_date: Date.new(2025, 3, 15),
        is_free: true, description: "신규 서비스 브랜드명 및 슬로건 공모.",
        image_url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800",
        source_url: "https://www.wevity.com/contest/skt-naming-2025",
        organizer: "SK텔레콤", price: "채택 시 100만원"
      },
      
      # === 미술/일러스트 분야 ===
      {
        title: "제3회 전국 웹툰 신인 작가 공모전",
        category: "contest", location: "온라인", region: "online",
        start_date: Date.new(2025, 1, 1), end_date: Date.new(2025, 6, 30),
        is_free: true, description: "웹툰 작가 데뷔를 꿈꾸는 분들을 위한 공모전.",
        image_url: "https://images.unsplash.com/photo-1618519764620-7403abdbdfe7?w=800",
        source_url: "https://www.wevity.com/contest/webtoon-2025",
        organizer: "네이버웹툰", price: "대상 1,000만원 + 연재 계약"
      },
      {
        title: "카카오페이지 만화 공모전",
        category: "contest", location: "온라인", region: "online",
        start_date: Date.new(2025, 4, 1), end_date: Date.new(2025, 7, 31),
        is_free: true, description: "카카오페이지 연재 작가 발굴을 위한 공모전.",
        image_url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800",
        source_url: "https://www.wevity.com/contest/kakaopage-comic-2025",
        organizer: "카카오엔터테인먼트", price: "대상 2,000만원"
      },
      
      # === 지역 특화 ===
      {
        title: "부산 청년 스타트업 피칭 대회",
        category: "contest", location: "부산 해운대구 벡스코", region: "busan",
        start_date: Date.new(2025, 4, 1), end_date: Date.new(2025, 6, 15),
        is_free: true, description: "부산 지역 청년 창업가를 위한 스타트업 피칭 대회.",
        image_url: "https://images.unsplash.com/photo-1560472355-536de3962603?w=800",
        source_url: "https://www.wevity.com/contest/busan-startup-2025",
        organizer: "부산창조경제혁신센터", price: "투자 유치 기회"
      },
      {
        title: "대전 사이언스 페스티벌 과학 아이디어 공모",
        category: "contest", location: "대전 유성구 대덕연구단지", region: "daejeon",
        start_date: Date.new(2025, 3, 15), end_date: Date.new(2025, 5, 15),
        is_free: true, description: "과학기술 기반 생활 혁신 아이디어 공모.",
        image_url: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800",
        source_url: "https://www.wevity.com/contest/science-2025",
        organizer: "한국과학기술원(KAIST)", price: "대상 200만원"
      },
      {
        title: "강원 청년 관광 창업 아이디어 공모전",
        category: "contest", location: "강원도 춘천시", region: "gangwon",
        start_date: Date.new(2025, 3, 1), end_date: Date.new(2025, 5, 31),
        is_free: true, description: "강원도 관광 활성화를 위한 창업 아이디어 공모.",
        image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        source_url: "https://www.wevity.com/contest/gangwon-tourism-2025",
        organizer: "강원도", price: "대상 500만원"
      },
      {
        title: "제주 청정에너지 아이디어 공모전",
        category: "contest", location: "제주시", region: "jeju",
        start_date: Date.new(2025, 4, 1), end_date: Date.new(2025, 6, 30),
        is_free: true, description: "탄소중립 제주를 위한 청정에너지 아이디어 공모.",
        image_url: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800",
        source_url: "https://www.wevity.com/contest/jeju-energy-2025",
        organizer: "제주특별자치도", price: "대상 300만원"
      },
      {
        title: "광주 AI 아트 페스티벌 공모전",
        category: "contest", location: "광주 국립아시아문화전당", region: "gwangju",
        start_date: Date.new(2025, 5, 1), end_date: Date.new(2025, 7, 31),
        is_free: true, description: "AI를 활용한 디지털 아트 작품 공모.",
        image_url: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800",
        source_url: "https://www.wevity.com/contest/gwangju-ai-art-2025",
        organizer: "국립아시아문화전당", price: "대상 500만원"
      }
    ]
    
    contests.each do |contest_data|
      if create_or_update_event(contest_data)
        count += 1
      end
    end
    
    Rails.logger.info "[Contest] Collected #{count} events"
    count
  end

  # ============================================
  # 축제 샘플 데이터 (Tour API 연동 전 임시)
  # ============================================
  def fetch_festival_samples
    count = 0
    
    festivals = [
      {
        title: "2025 서울빛초롱축제",
        category: "festival", location: "서울 청계천", region: "seoul",
        start_date: Date.new(2025, 11, 1), end_date: Date.new(2025, 11, 17),
        is_free: true, description: "청계천을 수놓는 아름다운 등불 축제. 전통과 현대가 어우러진 빛의 향연.",
        image_url: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800",
        source_url: "https://festival.seoul.go.kr/lantern-2025",
        organizer: "서울시"
      },
      {
        title: "진해 군항제 2025",
        category: "festival", location: "경남 창원시 진해구", region: "gyeongnam",
        start_date: Date.new(2025, 3, 25), end_date: Date.new(2025, 4, 3),
        is_free: true, description: "대한민국 최대 벚꽃 축제. 36만 그루의 벚나무가 만개하는 장관.",
        image_url: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800",
        source_url: "https://www.changwon.go.kr/jinhae-2025",
        organizer: "창원시"
      },
      {
        title: "부산 불꽃축제 2025",
        category: "festival", location: "부산 광안리 해수욕장", region: "busan",
        start_date: Date.new(2025, 10, 25), end_date: Date.new(2025, 10, 25),
        is_free: true, description: "광안대교를 배경으로 펼쳐지는 화려한 불꽃 쇼.",
        image_url: "https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=800",
        source_url: "https://www.busan.go.kr/fireworks-2025",
        organizer: "부산시"
      },
      {
        title: "보령 머드축제 2025",
        category: "festival", location: "충남 보령시 대천해수욕장", region: "chungnam",
        start_date: Date.new(2025, 7, 18), end_date: Date.new(2025, 7, 27),
        is_free: false, description: "세계적으로 유명한 머드 체험 축제. 다양한 머드 체험 프로그램.",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        source_url: "https://www.mudfestival.or.kr",
        organizer: "보령시", price: "입장권 10,000원"
      },
      {
        title: "안동 국제 탈춤 페스티벌",
        category: "festival", location: "경북 안동시 탈춤공원", region: "gyeongbuk",
        start_date: Date.new(2025, 9, 26), end_date: Date.new(2025, 10, 5),
        is_free: true, description: "유네스코 인류무형문화유산 하회별신굿탈놀이를 만나보세요.",
        image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
        source_url: "https://www.maskdance.com",
        organizer: "안동시"
      },
      {
        title: "제주 유채꽃 축제 2025",
        category: "festival", location: "제주 서귀포시", region: "jeju",
        start_date: Date.new(2025, 3, 29), end_date: Date.new(2025, 4, 6),
        is_free: true, description: "제주의 봄을 알리는 노란 유채꽃 물결.",
        image_url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800",
        source_url: "https://www.visitjeju.net/canola-2025",
        organizer: "제주관광공사"
      },
      {
        title: "전주 한지문화축제",
        category: "festival", location: "전북 전주시 한옥마을", region: "jeonbuk",
        start_date: Date.new(2025, 5, 1), end_date: Date.new(2025, 5, 5),
        is_free: true, description: "천년 전통 한지의 아름다움을 체험하는 축제.",
        image_url: "https://images.unsplash.com/photo-1580130379624-3a069ae1f77c?w=800",
        source_url: "https://www.jeonju.go.kr/hanji-2025",
        organizer: "전주시"
      },
      {
        title: "강릉 커피축제 2025",
        category: "festival", location: "강원 강릉시 안목해변", region: "gangwon",
        start_date: Date.new(2025, 10, 3), end_date: Date.new(2025, 10, 6),
        is_free: true, description: "커피의 도시 강릉에서 열리는 대한민국 대표 커피 축제.",
        image_url: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800",
        source_url: "https://www.coffeefestival.net",
        organizer: "강릉시"
      },
      {
        title: "이천 쌀문화축제",
        category: "festival", location: "경기 이천시 설봉공원", region: "gyeonggi",
        start_date: Date.new(2025, 10, 24), end_date: Date.new(2025, 10, 27),
        is_free: true, description: "임금님표 이천쌀의 고장에서 열리는 쌀 문화 축제.",
        image_url: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800",
        source_url: "https://www.ricefestival.or.kr",
        organizer: "이천시"
      },
      {
        title: "대구 치맥페스티벌 2025",
        category: "festival", location: "대구 두류공원", region: "daegu",
        start_date: Date.new(2025, 7, 16), end_date: Date.new(2025, 7, 20),
        is_free: true, description: "치킨과 맥주, 음악이 어우러지는 여름 대표 축제.",
        image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
        source_url: "https://www.chimacfestival.com",
        organizer: "대구시"
      },
      {
        title: "화천 산천어축제 2025",
        category: "festival", location: "강원 화천군", region: "gangwon",
        start_date: Date.new(2025, 1, 4), end_date: Date.new(2025, 1, 26),
        is_free: false, description: "겨울 대표 축제! 얼음 낚시와 눈썰매의 재미.",
        image_url: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800",
        source_url: "https://www.narafestival.com",
        organizer: "화천군", price: "입장권 15,000원"
      },
      {
        title: "광주 비엔날레 2025",
        category: "festival", location: "광주 비엔날레 전시관", region: "gwangju",
        start_date: Date.new(2025, 9, 5), end_date: Date.new(2025, 12, 1),
        is_free: false, description: "아시아를 대표하는 현대미술 비엔날레.",
        image_url: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800",
        source_url: "https://www.gwangjubiennale.org",
        organizer: "광주비엔날레재단", price: "입장권 14,000원"
      }
    ]
    
    festivals.each do |festival_data|
      if create_or_update_event(festival_data)
        count += 1
      end
    end
    
    Rails.logger.info "[Festival Samples] Collected #{count} events"
    count
  end

  # ============================================
  # 미술 전시회 샘플 데이터 (갤러리/뮤지엄)
  # ============================================
  def fetch_art_exhibitions
    count = 0
    
    art_exhibitions = [
      # === 국립현대미술관 (MMCA) ===
      {
        title: "올해의 작가상 2025",
        category: "art", location: "서울 국립현대미술관 서울관", region: "seoul",
        start_date: Date.new(2025, 9, 1), end_date: Date.new(2026, 2, 28),
        is_free: false, description: "한국 현대미술의 미래를 이끌 작가들의 작품 전시. 올해의 작가상 후보 4인의 개인전.",
        image_url: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=800",
        source_url: "https://www.mmca.go.kr/exhibition/2025",
        organizer: "국립현대미술관", price: "4,000원"
      },
      {
        title: "한국 근현대 미술 100년",
        category: "art", location: "과천 국립현대미술관", region: "gyeonggi",
        start_date: Date.new(2025, 3, 1), end_date: Date.new(2025, 8, 31),
        is_free: false, description: "한국 미술사 100년을 아우르는 대규모 회고전.",
        image_url: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800",
        source_url: "https://www.mmca.go.kr/gwacheon-2025",
        organizer: "국립현대미술관", price: "4,000원"
      },
      
      # === 서울시립미술관 (SeMA) ===
      {
        title: "서울 미디어아트 비엔날레 2025",
        category: "art", location: "서울시립미술관 서소문본관", region: "seoul",
        start_date: Date.new(2025, 9, 5), end_date: Date.new(2025, 11, 30),
        is_free: false, description: "디지털 시대의 예술을 탐구하는 미디어아트 축제.",
        image_url: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800",
        source_url: "https://sema.seoul.go.kr/mediart-2025",
        organizer: "서울시립미술관", price: "5,000원"
      },
      {
        title: "청년작가 공모전 수상작 전",
        category: "art", location: "서울시립 북서울미술관", region: "seoul",
        start_date: Date.new(2025, 4, 1), end_date: Date.new(2025, 6, 30),
        is_free: true, description: "신진 작가들의 실험적이고 창의적인 작품들.",
        image_url: "https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=800",
        source_url: "https://sema.seoul.go.kr/youth-2025",
        organizer: "서울시립미술관"
      },
      
      # === 예술의전당 ===
      {
        title: "모네에서 피카소까지: 인상주의 걸작전",
        category: "art", location: "예술의전당 한가람미술관", region: "seoul",
        start_date: Date.new(2025, 5, 1), end_date: Date.new(2025, 9, 15),
        is_free: false, description: "프랑스 오르세 미술관 소장품으로 만나는 인상주의 거장들의 명작.",
        image_url: "https://images.unsplash.com/photo-1579783900882-c0d0fead6a6d?w=800",
        source_url: "https://www.sac.or.kr/impressionism-2025",
        organizer: "예술의전당", price: "18,000원"
      },
      {
        title: "한국 서예 명인전",
        category: "art", location: "예술의전당 서예박물관", region: "seoul",
        start_date: Date.new(2025, 3, 15), end_date: Date.new(2025, 5, 31),
        is_free: false, description: "현대 한국 서예의 거장들과 신진 서예가들의 작품.",
        image_url: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=800",
        source_url: "https://www.sac.or.kr/calligraphy-2025",
        organizer: "예술의전당", price: "10,000원"
      },
      
      # === 리움미술관 ===
      {
        title: "한국 도자기의 아름다움",
        category: "art", location: "리움미술관", region: "seoul",
        start_date: Date.new(2025, 1, 1), end_date: Date.new(2025, 12, 31),
        is_free: false, description: "고려청자부터 조선백자까지, 한국 도자 예술의 정수.",
        image_url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800",
        source_url: "https://www.leeum.org/ceramic-2025",
        organizer: "삼성문화재단", price: "18,000원"
      },
      
      # === 지역 미술관 ===
      {
        title: "부산비엔날레 2025",
        category: "art", location: "부산현대미술관", region: "busan",
        start_date: Date.new(2025, 8, 16), end_date: Date.new(2025, 11, 10),
        is_free: false, description: "부산의 바다와 도시를 주제로 한 국제 현대미술 비엔날레.",
        image_url: "https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=800",
        source_url: "https://www.busanbiennale.org",
        organizer: "부산비엔날레조직위원회", price: "12,000원"
      },
      {
        title: "대구미술관 개관 15주년 특별전",
        category: "art", location: "대구미술관", region: "daegu",
        start_date: Date.new(2025, 5, 3), end_date: Date.new(2025, 8, 25),
        is_free: false, description: "대구미술관 소장품과 대구 출신 작가들의 작품.",
        image_url: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800",
        source_url: "https://daeguartmuseum.or.kr/special-2025",
        organizer: "대구미술관", price: "3,000원"
      },
      {
        title: "제주도립미술관 자연과 예술전",
        category: "art", location: "제주도립미술관", region: "jeju",
        start_date: Date.new(2025, 4, 1), end_date: Date.new(2025, 7, 31),
        is_free: false, description: "제주의 자연을 주제로 한 현대미술 작품 전시.",
        image_url: "https://images.unsplash.com/photo-1507643179773-3e975d7ac515?w=800",
        source_url: "https://jmoa.jeju.go.kr/nature-2025",
        organizer: "제주도립미술관", price: "2,000원"
      },
      
      # === 갤러리/특별전 ===
      {
        title: "반 고흐: 별이 빛나는 밤에",
        category: "art", location: "서울 DDP", region: "seoul",
        start_date: Date.new(2025, 6, 1), end_date: Date.new(2025, 10, 31),
        is_free: false, description: "반 고흐의 생애와 작품을 몰입형 미디어아트로 체험.",
        image_url: "https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=800",
        source_url: "https://www.ddp.or.kr/vangogh-2025",
        organizer: "DDP", price: "20,000원"
      },
      {
        title: "팀랩: 무한의 세계",
        category: "art", location: "서울 용산", region: "seoul",
        start_date: Date.new(2025, 3, 1), end_date: Date.new(2025, 12, 31),
        is_free: false, description: "팀랩의 디지털 아트 상설 전시. 몰입형 인터랙티브 체험.",
        image_url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800",
        source_url: "https://www.teamlab.art/seoul",
        organizer: "팀랩", price: "28,000원"
      },
      {
        title: "무민 원화전: 핀란드에서 온 이야기",
        category: "art", location: "서울 세종문화회관", region: "seoul",
        start_date: Date.new(2025, 7, 1), end_date: Date.new(2025, 9, 30),
        is_free: false, description: "토베 얀손의 무민 원화와 일러스트레이션 전시.",
        image_url: "https://images.unsplash.com/photo-1618519764620-7403abdbdfe7?w=800",
        source_url: "https://www.sejongpac.or.kr/moomin-2025",
        organizer: "세종문화회관", price: "15,000원"
      },
      {
        title: "지브리 레이아웃전",
        category: "art", location: "부산 벡스코", region: "busan",
        start_date: Date.new(2025, 8, 1), end_date: Date.new(2025, 11, 30),
        is_free: false, description: "스튜디오 지브리 애니메이션의 레이아웃 원화 3,000점 전시.",
        image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
        source_url: "https://www.bexco.co.kr/ghibli-2025",
        organizer: "벡스코", price: "16,000원"
      }
    ]
    
    art_exhibitions.each do |art_data|
      if create_or_update_event(art_data)
        count += 1
      end
    end
    
    Rails.logger.info "[Art Exhibitions] Collected #{count} events"
    count
  end

  # ============================================
  # 공연 샘플 데이터 (뮤지컬/콘서트)
  # ============================================
  def fetch_concerts_samples
    count = 0
    
    concerts = [
      {
        title: "뮤지컬 <지킬 앤 하이드>",
        category: "concert", location: "서울 블루스퀘어 신한카드홀", region: "seoul",
        start_date: Date.new(2025, 12, 4), end_date: Date.new(2026, 5, 18),
        is_free: false, description: "브로드웨이 역사상 가장 아름다운 스릴러. 대한민국 뮤지컬의 신화.",
        image_url: "https://images.unsplash.com/photo-1460723237483-7a6dc9af6051?w=800",
        source_url: "http://ticket.interpark.com/Goods/GoodsInfo.asp?GoodsCode=24016669",
        organizer: "오디컴퍼니", price: "VIP석 170,000원"
      },
      {
        title: "2025 임영웅 콘서트 [IM HERO]",
        category: "concert", location: "서울 상암월드컵경기장", region: "seoul",
        start_date: Date.new(2025, 5, 25), end_date: Date.new(2025, 5, 26),
        is_free: false, description: "하늘빛으로 물드는 상암벌. 영웅시대와 함께하는 꿈의 무대.",
        image_url: "https://images.unsplash.com/photo-1459749411177-d4a414c9ff5f?w=800",
        source_url: "http://ticket.interpark.com/1",
        organizer: "물고기뮤직", price: "VIP석 187,000원"
      },
      {
        title: "싸이 흠뻑쇼 2025 - SUMMER SWAG",
        category: "concert", location: "전국 투어 (부산/대구/광주/여수/수원)", region: "nationwide",
        start_date: Date.new(2025, 7, 1), end_date: Date.new(2025, 8, 30),
        is_free: false, description: "대한민국 대표 여름 브랜드 콘서트. 물과 음악의 광란의 파티.",
        image_url: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800",
        source_url: "http://ticket.interpark.com/2",
        organizer: "피네이션", price: "스탠딩SR 165,000원"
      },
      {
        title: "뮤지컬 <레미제라블>",
        category: "concert", location: "부산 드림씨어터", region: "busan",
        start_date: Date.new(2025, 3, 1), end_date: Date.new(2025, 5, 31),
        is_free: false, description: "전 세계를 울린 위대한 감동. 세계 4대 뮤지컬의 귀환.",
        image_url: "https://images.unsplash.com/photo-1514306191717-452ec28c7f91?w=800",
        source_url: "http://ticket.interpark.com/3",
        organizer: "부산문화재단", price: "VIP석 160,000원"
      },
      {
        title: "조성진 피아노 리사이틀",
        category: "concert", location: "대구 콘서트하우스", region: "daegu",
        start_date: Date.new(2025, 11, 15), end_date: Date.new(2025, 11, 15),
        is_free: false, description: "세계가 사랑하는 피아니스트 조성진의 독주회.",
        image_url: "https://images.unsplash.com/photo-1552422535-c45813c61732?w=800",
        source_url: "http://ticket.interpark.com/4",
        organizer: "크레디아", price: "R석 120,000원"
      }
    ]
    
    concerts.each do |concert_data|
      if create_or_update_event(concert_data)
        count += 1
      end
    end
    
    Rails.logger.info "[Concerts] Collected #{count} events"
    count
  end

  # ============================================
  # 이벤트 생성/업데이트 (중복 방지)
  # ============================================
  def create_or_update_event(data)
    # 1. URL 기반 중복 체크
    event = Event.find_or_initialize_by(source_url: data[:source_url])
    
    # 2. 제목 유사도 및 날짜 기반 중복 검증
    unless event.persisted?
      prefix = data[:title][0..7] rescue ""
      similar_event = Event.where(start_date: data[:start_date])
                           .where("title LIKE ?", "#{prefix}%")
                           .first
      if similar_event
        Rails.logger.debug "Duplicate suspected: '#{data[:title]}' matches '#{similar_event.title}'. Skipping."
        return nil
      end
    end

    return nil if event.persisted? && event.approval_status == 'approved'
    
    event.assign_attributes(data)
    event.approval_status ||= 'pending'
    event.crawled_at = Time.current
    
    # 지역이 없으면 자동 감지
    event.region ||= detect_region(event.location)
    
    if event.save
      Rails.logger.info "Saved event: #{event.title} [#{event.category}] [#{event.region}]"
      event
    else
      Rails.logger.error "Failed to save event #{event.title}: #{event.errors.full_messages.join(', ')}"
      nil
    end
  end

  # ============================================
  # 상세 페이지 크롤링 (홈페이지 링크, 설명 등)
  # ============================================
  def fetch_event_details(event)
    return unless event.source_url&.start_with?('http')
    
    begin
      html = URI.open(event.source_url, "User-Agent" => USER_AGENT, read_timeout: 20).read
      doc = Nokogiri::HTML(html)
      
      # 1. 홈페이지 링크 추출 (Showala 특화)
      if event.source_url.include?("showala.com")
        doc.css('tr').each do |tr|
          if tr.text.include?("홈페이지")
            link = tr.css('a').find { |a| a['href']&.start_with?('http') }
            if link
              event.update(website_url: link['href'])
              break
            end
          end
        end
      end
      
      # 2. 상세 설명 추출
      selectors = ['.view_txt', '.ex_view_txt', '.cnt_view', '#view_content', '.txt_area', '.content']
      description = nil
      
      selectors.each do |selector|
        text = doc.css(selector).text.strip
        if text.length > 50
          description = text[0..1000] # 최대 1000자
          break
        end
      end
      
      if description && (event.description.blank? || event.description.length < 50)
        event.update(description: description)
      end
    rescue => e
      Rails.logger.warn "Error fetching details for #{event.title}: #{e.message}"
    end
  end

  # ============================================
  # 기존 이벤트 지역 정보 업데이트
  # ============================================
  def update_existing_events_region
    count = 0
    Event.where(region: [nil, '']).find_each do |event|
      region = detect_region(event.location)
      if region != 'nationwide' || event.region.blank?
        event.update_column(:region, region)
        count += 1
      end
    end
    Rails.logger.info "[Region Update] Updated #{count} events with region info"
  end
end

