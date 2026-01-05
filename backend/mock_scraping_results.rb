# Mocking scraping results for demonstration purposes

# 1. Festival (ID 1)
e1 = Event.find_by(id: 1)
if e1
  desc = <<~DESC
    [2026 호미곶 한민족 해맞이 축전]
    
    희망찬 2026년의 첫 태양을 대한민국 내륙 최동단 호미곶에서 맞이하세요!
    
    '호미곶의 빛, 세계를 비추다'라는 주제로 열리는 이번 축제는 
    다채로운 공연과 체험 프로그램으로 관람객들에게 잊지 못할 추억을 선사할 예정입니다.
    
    [주요 프로그램]
    - 전야제: 2025 송년 콘서트, 카운트다운 불꽃쇼
    - 해맞이 행사: 대북 공연, 신년 축하 메시지 선포, 해군 6항공전단 축하 비행
    - 부대 행사: 1만 명 떡국 나눔, 소만 엽서 보내기, 지역 특산물 장터
    
    [교통 안내]
    행사 당일 극심한 혼잡이 예상되오니 셔틀버스를 이용해 주시기 바랍니다.
    (포항역, 터미널 등 주요 지점 운행)
  DESC
  e1.update(description: desc)
  puts "Updated Festival: #{e1.title}"
end

# 2. Art Exhibition (ID 5 - assuming ID 5 is the one with image)
e2 = Event.where(category: 'art').first
if e2
  desc = <<~DESC
    [현대 미술의 거장, 그들의 시선을 따라가다]
    
    피카소부터 앤디 워홀까지, 20세기를 수놓은 현대 미술 거장들의 원화를 
    한자리에 모은 대규모 기획전입니다.
    
    이번 전시는 단순히 작품을 감상하는 것을 넘어,
    작가들의 삶과 철학, 그리고 그들이 살았던 시대를 입체적으로 조명합니다.
    
    [전시 구성]
    SECTION 1. 입체파와 추상미술의 태동
    SECTION 2. 팝아트, 예술과 대중문화의 경계를 허물다
    SECTION 3. 현대 미술의 다원화와 새로운 시도들
    
    [도슨트 운영]
    평일: 11:00 / 14:00 / 16:00
    주말: 11:00 / 13:00 / 15:00 / 17:00
    * 정규 도슨트 외 오디오 가이드 대여 가능 (3,000원)
  DESC
  e2.update(description: desc)
  puts "Updated Art: #{e2.title}"
end

# 3. Contest (ID 7)
e3 = Event.where(category: 'contest').first
if e3
  desc = <<~DESC
    [제1회 전국 대학생 인공지능(AI) 앱 개발 아이디어 공모전]
    
    세상을 바꿀 당신의 아이디어를 기다립니다!
    AI 기술을 활용하여 사회 문제를 해결하거나 새로운 가치를 창출할 수 있는
    창의적인 웹/앱 서비스 아이디어를 제안해 주세요.
    
    [참가 자격]
    - 국내외 대학(원) 재학생 및 휴학생 (개인 또는 4인 이내 팀)
    
    [공모 주제]
    - 생활 편의, 교육, 헬스케어, 금융, 사회문제 해결 등 AI 활용 자유 주제
    
    [시상 내역]
    - 대상(1팀): 상장 및 상금 500만원
    - 최우수상(2팀): 상장 및 상금 300만원
    - 우수상(3팀): 상장 및 상금 100만원
    - 입선(5팀): 상장 및 기념품
    
    * 수상팀에게는 주최사 인턴십 기회 및 채용 시 서류 전형 면제 혜택 제공
  DESC
  e3.update(description: desc)
  puts "Updated Contest: #{e3.title}"
end
