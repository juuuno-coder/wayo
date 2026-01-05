# 💌 와요 (WAYO) - 프리미엄 디지털 초대장 서비스

> "마음을 담은 정교한 초대장이 당신의 공간으로 지금 바로 와요"

[![Rails](https://img.shields.io/badge/Rails-8.1-red)](https://rubyonrails.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
[![Motion](https://img.shields.io/badge/Animation-Framer_Motion-blue)](https://www.framer.com/motion/)

---

## 📱 프로젝트 소개

**Wayo**는 소중한 순간을 위한 프리미엄 디지털 초대장 제작 플랫폼입니다. 모바일에서의 직관적인 제작 경험과 PC에서의 몰입감 넘치는 애니메이션 효과를 통해 초대하는 사람과 받는 사람 모두에게 특별한 경험을 제공합니다.

기존 '가보자고(Gabojago)' 프로젝트의 이벤트 탐색 기능을 기반으로, **초대장 서비스에 집중하여 새롭게 리브랜딩**되었습니다.

---

## ✨ 주요 기능

### 🖥️ 프리미엄 PC 경험
- **3D 봉투 오프닝**: 실감나는 3D 왁스 실링 봉투 열기 애니메이션 (`Framer Motion` 활용)
- **몰입형 RSVP**: 100% 풀브라우징 레이아웃으로 구현된 세련된 참석 확인 화면
- **실시간 미리보기**: 초대장을 제작하면서 PC와 동일한 품질의 결과물을 즉시 확인

### 🎨 맞춤형 초대장 제작
- **8단계 가이드**: 제목부터 테마, BGM, 티켓 발송까지 하나씩 채워가는 직관적인 제작 프로세스
- **감성 테마**: 클래식, 로맨틱, 파티, 비즈니스 등 상황에 맞는 다양한 디자인 프리셋
- **멀티미디어**: 배경음악(BGM), 폰트 스타일, 텍스트 효과(금박/은박) 커스텀 가능

### 🎟️ 티켓 및 입장 관리
- **QR 티켓**: 참석 확정 시 전용 QR 코드가 포함된 디지털 티켓 자동 발급
- **호스트 관리**: 내 초대장을 통해 신청한 게스트 목록 및 참석 인원 실시간 확인

### 🌐 지능형 서브도메인 라우팅
- `wayo.co.kr`: 와요 서비스 메인 랜딩 및 초대장 홈
- `gabojago.wayo.co.kr`: 기존 가보자고 플랫폼의 통합 홈으로 연결

---

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 16.1 (App Router)
- **Styling**: TailwindCSS 4
- **Animation**: Framer Motion
- **Language**: TypeScript

### Backend
- **Framework**: Ruby on Rails 8.1
- **Database**: SQLite3
- **Authentication**: Devise + JWT
- **Background Jobs**: Sidekiq + Redis

---

## 🚀 빠른 시작

### 필수 요구사항
- Ruby 3.3+
- Node.js 20+
- Redis (백그라운드 작업 및 Sidekiq용)

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/juuuno-coder/wayo.git
cd wayo

# 2. Backend 설정
cd backend
bundle install
bin/rails db:prepare db:seed
# Rails 서버 실행 (Port 3401)
bin/rails server -p 3401

# 3. Frontend 설정 (별도 터미널)
cd ../frontend
npm install
# 개발 서버 실행 (Port 3400)
npm run dev
```

### 도메인 기반 로컬 테스트
- **Wayo Landing**: `http://localhost:3400/?__host=wayo.co.kr`
- **Gabojago Home**: `http://localhost:3400/?__host=gabojago.wayo.co.kr`

---

## 📂 프로젝트 구조

```
wayo/
├── frontend/               # Next.js 클라이언트 앱
│   ├── src/
│   │   ├── app/           # App Router (wayo, invitations 등)
│   │   ├── components/    # PCInvitationView 등 재사용 UI
│   │   └── middleware.ts  # 서브도메인 라우팅 로직
├── backend/                # Rails API 서버
│   ├── app/
│   │   ├── controllers/   # 초대장 및 게스트 관리 API
│   │   ├── models/        # Invitation, Guest, Ticket 모델
│   │   └── services/      # 데이터 처리 서비스
└── docs/                   # 프로젝트 문서 (DNS 가이드 등)
```

---

## 📖 관련 문서
- [호스팅KR DNS 설정 가이드](docs/DNS_SETUP_GUIDE.md)
- [PC 버전 개발 워크쓰루](docs/WALKTHROUGH_PC_VERSION.md)
- [개발 현황 및 로드맵](docs/DEVELOPMENT_STATUS.md)

---

**Made with ❤️ by Wayo Team**
