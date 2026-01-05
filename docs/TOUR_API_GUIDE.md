# 🗺️ 한국관광공사 Tour API 연동 가이드

## 📋 개요

한국관광공사 Tour API를 통해 전국 축제, 관광지, 행사 정보를 실시간으로 수집할 수 있습니다.

## 🔑 API 키 발급 방법

### 1단계: 공공데이터포털 회원가입

1. [공공데이터포털](https://data.go.kr) 접속
2. 회원가입 및 로그인

### 2단계: API 검색 및 신청

1. 검색창에 **"한국관광공사\_국문 관광정보 서비스"** 검색
2. 검색 결과에서 해당 API 클릭
3. **"활용신청"** 버튼 클릭

### 3단계: 활용 신청서 작성

- **활용 목적**: 모바일/웹 서비스 개발
- **상세 기능 정보**: 축제, 행사, 관광지 정보 제공 앱 개발
- 라이선스 동의 체크 후 신청

### 4단계: API 키 확인

1. 마이페이지 → **'데이터 활용'** → **'OpenAPI 인증키 발급 현황'**
2. **일반 인증키(Decoding)** 복사하여 사용

## 📡 API 엔드포인트

### 축제/공연 정보

```
GET http://apis.data.go.kr/B551011/KorService1/searchFestival1
```

### 파라미터

| 파라미터       | 필수 | 설명                         |
| -------------- | ---- | ---------------------------- |
| serviceKey     | O    | 발급받은 API 키              |
| numOfRows      | X    | 한 페이지 결과 수 (기본: 10) |
| pageNo         | X    | 페이지 번호                  |
| MobileOS       | O    | OS 구분 (ETC, AND, IOS)      |
| MobileApp      | O    | 앱 이름                      |
| \_type         | X    | 응답 타입 (json)             |
| eventStartDate | X    | 행사 시작일 (YYYYMMDD)       |
| eventEndDate   | X    | 행사 종료일 (YYYYMMDD)       |
| areaCode       | X    | 지역 코드                    |

### 지역 코드

| 코드 | 지역 |
| ---- | ---- |
| 1    | 서울 |
| 2    | 인천 |
| 3    | 대전 |
| 4    | 대구 |
| 5    | 광주 |
| 6    | 부산 |
| 7    | 울산 |
| 8    | 세종 |
| 31   | 경기 |
| 32   | 강원 |
| 33   | 충북 |
| 34   | 충남 |
| 35   | 경북 |
| 36   | 경남 |
| 37   | 전북 |
| 38   | 전남 |
| 39   | 제주 |

## 💻 Rails 연동 예시

### 1. Gemfile에 추가

```ruby
gem 'httparty'
```

### 2. 환경 변수 설정

```bash
# .env 또는 credentials
TOUR_API_KEY=your_api_key_here
```

### 3. 서비스 클래스 예시

```ruby
# app/services/tour_api_service.rb
require 'httparty'

class TourApiService
  BASE_URL = "http://apis.data.go.kr/B551011/KorService1"

  def initialize
    @api_key = Rails.application.credentials.dig(:tour_api, :key) || ENV['TOUR_API_KEY']
  end

  def fetch_festivals(start_date: Date.today, end_date: Date.today + 90.days, page: 1)
    response = HTTParty.get("#{BASE_URL}/searchFestival1", query: {
      serviceKey: @api_key,
      numOfRows: 100,
      pageNo: page,
      MobileOS: 'ETC',
      MobileApp: 'Gabojago',
      _type: 'json',
      eventStartDate: start_date.strftime('%Y%m%d'),
      eventEndDate: end_date.strftime('%Y%m%d')
    })

    parse_response(response)
  end

  private

  def parse_response(response)
    return [] unless response.success?

    body = JSON.parse(response.body)
    items = body.dig('response', 'body', 'items', 'item') || []

    items.map do |item|
      {
        title: item['title'],
        location: item['addr1'],
        start_date: Date.parse(item['eventstartdate']),
        end_date: Date.parse(item['eventenddate']),
        image_url: item['firstimage'],
        description: item['overview'],
        source_url: "https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=#{item['contentid']}"
      }
    end
  end
end
```

## ⚠️ 주의사항

1. **일일 호출 제한**: 개발 단계에서는 일일 1,000건 제한
2. **운영 전환**: 실서비스 시 운영 계정으로 전환 필요
3. **데이터 갱신**: 축제 정보는 시즌별로 변경되므로 정기 갱신 필요
4. **이미지 저작권**: Tour API 이미지는 출처 표기 필요

## 📅 다음 단계

1. API 키 발급 완료
2. 환경 변수에 키 저장
3. `TourApiService` 구현
4. `EventDataService`에서 Tour API 호출 추가
5. 정기 크롤링 스케줄 설정 (Sidekiq + 크론)

---

_이 가이드는 가보자고 프로젝트를 위해 작성되었습니다._
