# 기존 데이터 유지하고 Event 데이터만 추가
puts "Creating Events..."

Event.destroy_all

# 축제 (Festival)
Event.create!([
  {
    title: "2025 서울빛초롱축제",
    category: "festival",
    description: "청계천을 따라 펼쳐지는 겨울 빛 축제. 화려한 LED 조형물과 전통 등불이 어우러진 환상적인 야경을 즐길 수 있습니다.",
    start_date: Date.new(2025, 12, 15),
    end_date: Date.new(2026, 1, 31),
    location: "서울 청계천 일대",
    image_url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
    organizer: "서울특별시",
    website_url: "https://www.seoul.go.kr",
    is_free: true,
    price: "무료"
  },
  {
    title: "보령머드축제 2025",
    category: "festival",
    description: "세계적인 여름 축제! 머드 체험, 해변 공연, 불꽃놀이 등 다채로운 프로그램이 준비되어 있습니다.",
    start_date: Date.new(2025, 7, 18),
    end_date: Date.new(2025, 7, 27),
    location: "충남 보령시 대천해수욕장",
    image_url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
    organizer: "보령시청",
    website_url: "https://www.boryeong.go.kr",
    is_free: false,
    price: "입장료 10,000원"
  },
  {
    title: "진주남강유등축제",
    category: "festival",
    description: "남강을 수놓는 수만 개의 등불. 임진왜란 당시 의병들의 넋을 기리는 전통 축제입니다.",
    start_date: Date.new(2025, 10, 1),
    end_date: Date.new(2025, 10, 13),
    location: "경남 진주시 남강 일원",
    image_url: "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?w=800",
    organizer: "진주시",
    website_url: "https://www.jinju.go.kr",
    is_free: true,
    price: "무료"
  }
])

# 박람회 (Exhibition)
Event.create!([
  {
    title: "2025 서울모터쇼",
    category: "exhibition",
    description: "아시아 최대 규모의 모터쇼. 최신 자동차 기술과 친환경 모빌리티를 한자리에서 만나보세요.",
    start_date: Date.new(2025, 3, 28),
    end_date: Date.new(2025, 4, 7),
    location: "경기 고양시 킨텍스",
    image_url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800",
    organizer: "한국자동차산업협회",
    website_url: "https://www.seoulm

otorshow.org",
    is_free: false,
    price: "성인 15,000원"
  },
  {
    title: "코리아 푸드 엑스포 2025",
    category: "exhibition",
    description: "대한민국 식품산업의 모든 것. 최신 식품 트렌드와 K-푸드의 글로벌 경쟁력을 확인하세요.",
    start_date: Date.new(2025, 5, 14),
    end_date: Date.new(2025, 5, 17),
    location: "서울 삼성동 코엑스",
    image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
    organizer: "aT한국농수산식품유통공사",
    website_url: "https://www.at.or.kr",
    is_free: false,
    price: "사전등록 무료, 현장등록 10,000원"
  }
])

# 전시회 (Art Exhibition)
Event.create!([
  {
    title: "모네: 빛의 순간들",
    category: "art",
    description: "인상주의 거장 클로드 모네의 대표작 80여 점을 만나는 특별전. 수련, 건초더미 연작 등 명작이 한자리에.",
    start_date: Date.new(2025, 2, 1),
    end_date: Date.new(2025, 5, 31),
    location: "서울 용산구 국립중앙박물관",
    image_url: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800",
    organizer: "국립중앙박물관",
    website_url: "https://www.museum.go.kr",
    is_free: false,
    price: "성인 18,000원, 청소년 12,000원"
  },
  {
    title: "디지털 아트 페스티벌: 미래의 캔버스",
    category: "art",
    description: "AI, VR, 미디어아트가 만나는 디지털 예술의 향연. 체험형 전시로 누구나 예술가가 될 수 있습니다.",
    start_date: Date.new(2025, 6, 10),
    end_date: Date.new(2025, 8, 30),
    location: "서울 강남구 DDP",
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    organizer: "서울디자인재단",
    website_url: "https://www.seouldesign.or.kr",
    is_free: false,
    price: "성인 15,000원"
  }
])

# 공모전 (Contest)
Event.create!([
  {
    title: "2025 대한민국 청년 창업 아이디어 공모전",
    category: "contest",
    description: "혁신적인 창업 아이디어를 가진 청년들을 위한 공모전. 대상 5천만원, 총 상금 2억원!",
    start_date: Date.new(2025, 3, 1),
    end_date: Date.new(2025, 4, 30),
    location: "온라인 접수",
    image_url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800",
    organizer: "중소벤처기업부",
    website_url: "https://www.mss.go.kr",
    is_free: true,
    price: "무료 (참가비 없음)"
  },
  {
    title: "서울 도시재생 아이디어 공모",
    category: "contest",
    description: "서울의 미래를 함께 그립니다. 건축, 도시계획, 디자인 전공자 누구나 참여 가능!",
    start_date: Date.new(2025, 2, 15),
    end_date: Date.new(2025, 3, 31),
    location: "온라인 접수",
    image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    organizer: "서울특별시 도시재생본부",
    website_url: "https://www.seoul.go.kr",
    is_free: true,
    price: "무료"
  },
  {
    title: "K-콘텐츠 스토리 공모전 2025",
    category: "contest",
    description: "웹툰, 웹소설, 드라마 시나리오 등 다양한 장르의 스토리를 기다립니다. 수상작은 실제 제작 지원!",
    start_date: Date.new(2025, 4, 1),
    end_date: Date.new(2025, 6, 30),
    location: "온라인 접수",
    image_url: "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=800",
    organizer: "한국콘텐츠진흥원",
    website_url: "https://www.kocca.kr",
    is_free: true,
    price: "무료"
  }
])

puts "Events Created! Total: #{Event.count}"
puts "- 축제: #{Event.where(category: 'festival').count}개"
puts "- 박람회: #{Event.where(category: 'exhibition').count}개"
puts "- 전시회: #{Event.where(category: 'art').count}개"
puts "- 공모전: #{Event.where(category: 'contest').count}개"
