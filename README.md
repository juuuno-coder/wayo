# 🐾 Gabojago - 반려동물 쇼핑 플랫폼

> 우리 아이를 위한 최고의 상품을 만나보세요!

## 📱 프로젝트 소개

Gabojago는 반려동물 용품 쇼핑을 위한 **모바일 퍼스트 웹/앱 플랫폼**입니다.
PC에서는 펫프렌즈 스타일의 중앙 정렬 레이아웃으로, 모바일에서는 네이티브 앱과 같은 경험을 제공합니다.

### 주요 기능

- 🛍️ **상품 탐색**: 사료, 간식, 장난감, 케어용품 카테고리별 상품
- 🔍 **실시간 검색**: 키워드 기반 상품 검색
- ❤️ **찜하기**: 마음에 드는 상품 저장 및 관리
- 👤 **회원 관리**: JWT 기반 안전한 인증 시스템
- 📱 **반응형 디자인**: PC/모바일 최적화 UI

## 🛠️ 기술 스택

### Frontend

- **Framework**: Next.js 16.1 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **Icons**: Lucide React
- **Port**: 3400

### Backend

- **Framework**: Ruby on Rails 8.1
- **Authentication**: Devise + JWT
- **Database**: SQLite (개발), PostgreSQL (프로덕션 권장)
- **API**: RESTful JSON API
- **Port**: 3401

## 🚀 시작하기

### 사전 요구사항

- Node.js 20+
- Ruby 3.3+
- Rails 8.1+

### 설치 및 실행

#### 1. Backend 실행

```bash
cd backend

# 의존성 설치
bundle install

# 데이터베이스 설정
bin/rails db:create db:migrate db:seed

# 서버 실행 (Port 3401)
.\bin\dev.ps1  # Windows
# 또는
bin/rails server -p 3401  # Mac/Linux
```

#### 2. Frontend 실행

```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행 (Port 3400)
npm run dev
```

#### 3. 브라우저 접속

```
http://localhost:3400
```

## 📂 프로젝트 구조

```
gabojago/
├── backend/              # Rails API 서버
│   ├── app/
│   │   ├── controllers/  # API 컨트롤러
│   │   └── models/       # 데이터 모델
│   ├── config/
│   │   ├── routes.rb     # API 라우팅
│   │   └── initializers/ # Devise, CORS 설정
│   └── db/
│       ├── migrate/      # 마이그레이션
│       └── seeds.rb      # 샘플 데이터
│
├── frontend/             # Next.js 앱
│   ├── src/
│   │   ├── app/          # 페이지 및 레이아웃
│   │   └── components/   # 재사용 컴포넌트
│   └── public/           # 정적 파일
│
└── docs/                 # 문서
    ├── ROADMAP.md
    ├── FEATURE_DEVELOPMENT.md
    └── DEVELOPMENT_STATUS.md
```

## 🎨 주요 페이지

| 경로          | 설명                |
| ------------- | ------------------- |
| `/`           | 메인 홈 (상품 피드) |
| `/login`      | 로그인              |
| `/signup`     | 회원가입            |
| `/items/[id]` | 상품 상세           |
| `/search`     | 검색                |
| `/likes`      | 찜한 상품           |
| `/profile`    | 마이페이지          |

## 🔌 API 엔드포인트

### 인증

- `POST /users` - 회원가입
- `POST /users/sign_in` - 로그인
- `DELETE /users/sign_out` - 로그아웃

### 상품

- `GET /items` - 상품 목록
- `GET /items/:id` - 상품 상세
- `GET /items/search?q=keyword` - 상품 검색

### 좋아요

- `POST /items/:id/like` - 좋아요 토글
- `GET /likes` - 내 찜 목록

## 🎯 다음 단계

### 앱 스토어 출시

1. Capacitor 설치 및 설정
2. Android/iOS 프로젝트 생성
3. 앱 아이콘 & 스플래시 스크린 제작
4. 스토어 등록 및 심사

자세한 내용은 `docs/DEVELOPMENT_STATUS.md` 참고

### 추가 기능 개발

- 결제 시스템 (토스페이먼츠)
- 주문/배송 관리
- 리뷰 시스템
- 푸시 알림

## 🐛 문제 해결

### Backend 서버가 시작되지 않을 때

```bash
# 한글 경로 문제 해결
cd backend
.\bin\dev.ps1  # UTF-8 인코딩 자동 설정
```

### CORS 에러가 발생할 때

`backend/config/initializers/cors.rb`에서 Frontend URL 확인

### DB 초기화가 필요할 때

```bash
cd backend
bin/rails db:reset db:seed
```

## 📝 라이선스

이 프로젝트는 개인 프로젝트입니다.

## 👨‍💻 개발자

Gabojago Team

---

**Made with ❤️ for 반려동물과 함께하는 모든 분들**
