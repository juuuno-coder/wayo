# Log: Gabojago*Project_Initialization (가보자고*프로젝트*초기화*및*환경*구축)

**Original Date:** 2025-12-20 14:18:27
**Key Goal:** 전국의 축제/행사 정보를 공유하고 소장용 디지털 티켓/스탬프 기능을 제공하는 '가보자고' 플랫폼의 서비스 기획, 기술 스택 확정 및 풀스택 개발 환경(Rails + Next.js) 구축

---

## 📝 상세 작업 일지 (Chronological)

### 1. 서비스 기획 및 레퍼런스 분석

**상황:** 2026년 전국민 도약 프로젝트 '가보자고'의 핵심 기능(티켓/여권 시스템, 스탬프 투어, 굿즈몰, 해보자고 서브메뉴) 제안 및 사용자 요구사항 분석
**해결:**

- **레퍼런스 분석:** `one-island.bstage.in`(팬덤 플랫폼)과 `pet-friends.co.kr`(화이트톤 커머스 UI) 분석을 통해 모바일 UX 중심의 디자인 방향 설정.
- **기술 스택 확정:** 안정적인 크롤링과 백그라운 작업을 위한 **Ruby on Rails (API)**와 고해상도 이미지 최적화 및 Aceternity UI 활용을 위한 **Next.js** 조합으로 결정.
- **아키텍처:** Cloudflare(CDN, R2)와 Azure(Server)를 활용한 비용 효율적 운영 전략 수립.

### 2. 데이터베이스 스키마 설계

**상황:** 축제, 유저, 티켓, 굿즈, 주문, 커뮤니티 등 복합적인 데이터 관계 정의 필요
**해결:**

- **[docs/schema.md]**: 8개 핵심 테이블(Users, Events, Categories, Tickets, Products, Orders, OrderItems, Comments)의 구조 설계.
- **기술적 포인트:**
  - `Event` 테이블에 `event_type`(축제, 전시회, 박람회, 체험전, 공모전) Enum 적용.
  - 여권 기능을 위한 `Ticket`의 상태값(`issued`, `verified`) 관리 로직 설계.
  - 스탬프 디자인을 위한 `stamp_image_url` 컬럼 추가.

### 3. 프론트엔드 환경 구축 (Next.js)

**상황:** Aceternity UI를 적용하기 위한 Next.js 최신 환경 세팅
**해결:**

- **[frontend/]**: Next.js 15+, TypeScript, Tailwind CSS, ESLint 기반 프로젝트 생성.
- **디자인 컨셉:** 펫프렌즈 스타일의 화이트톤 클린 UI를 메인으로 하되, 축제별 아이콘 그리드와 하단 굿즈몰 섹션 구성.

### 4. 백엔드 환경 구축 및 시행착오 해결 (Ruby on Rails)

**상황:** 로컬 환경의 Ruby 미설치 및 PostgreSQL 설치 중 한글 사용자 계정명("주노") 경로 에러 발생
**해결:**

- **개발 환경 전환:** 설치가 까다로운 PostgreSQL 대신, 로컬 개발 속도를 위해 **SQLite3**로 즉시 전환.
- **시스템 초기화:** 꼬인 라이브러리 의존성을 해결하기 위해 `backend` 폴더를 삭제 후 `rails new backend --api --database=sqlite3` 명령어로 클린 재설치 수행.
- **CORS 설정:** `rack-cors` 젬 활성화를 통해 프론트엔드-백엔드 간 API 통신 기초 마련.

### 5. 핵심 모델 및 API 골격 생성

**상황:** 설계된 스키마를 실제 코드로 구현
**해결:**

- **모델 생성:** `User`, `Event`, `Ticket`, `Product` 등 8개 모델의 Scaffold/Migration 파일 생성 및 데이터베이스 마이그레이션 실행.
- **기술적 포인트:** `latitude`, `longitude` 좌표 데이터 처리를 위한 컬럼 구성 및 관련 참조 관계(References) 설정 완료.

---

**기록 담당관:** Antigravity AI
**상태:** 인프라 구축 및 모델링 완료, 기능 개발 단계 진입 중.
