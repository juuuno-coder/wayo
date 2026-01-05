Log: Wayo_PC_Version_And_Deployment_Preparation (와요_PC버전_구축_및_배포_지원)
Original Date: 2026-01-05 09:28:00
Key Goal: Wayo 브랜드의 PC 버전 고도화(랜딩 페이지, 초대장 뷰, 생성 UI) 및 환경변수 외부화와 실배포(Vercel, Fly.io) 완수

📝 상세 작업 일지 (Chronological)

### 1단계: 프론트엔드 URL 외부화 및 배포 준비
상황: 프론트엔드 코드 전반에 `http://localhost:3401` 등 하드코딩된 API 주소가 산재하여 실배포 환경 대응이 불가한 상태.
해결:
- `frontend/src/` 하위의 모든 fetch 호출을 `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}` 패턴으로 변경.
- 대상 파일: `orders/page.tsx`, `community/[id]/page.tsx`, `admin/page.tsx`, `cart/page.tsx`, `items/[id]/page.tsx` 등 다수.
- `frontend/.env.example` 및 `backend/.env.example` 파일 생성으로 환경변수 가이드 제공.
기술적 포인트: Next.js의 클라이언트 사이드 환경변수(`NEXT_PUBLIC_`)를 활용하여 배포 환경 유연성 확보.

### 2단계: Wayo PC 전용 UI/UX 구현 및 도메인 라우팅
상황: 모바일 중심의 서비스를 PC 사용자에게 프리미엄 경험으로 제공하기 위한 고도화 필요.
해결:
- **도메인 라우팅**: `/middleware.ts`를 구현하여 `wayo.co.kr` 접속 시 `/wayo` 랜딩 페이지로, `gabojago.wayo.co.kr` 접속 시 메인 앱으로 연결.
- **PC 랜딩 페이지**: `frontend/src/app/wayo/page.tsx`를 고성능 애니메이션과 프리미엄 디자인으로 전면 개편.
- **시네마틱 초대장 뷰**: `PCInvitationView.tsx`를 생성하여 3D 봉투 개봉 애니메이션 및 전체 화면 RSVP UI 구현.
- **생성 UI 최적화**: `invitations/create/page.tsx`를 좌측 입력폼, 우측 실시간 프리미엄 미리보기의 분할 화면으로 개편.
기술적 포인트: `framer-motion`을 활용한 고난도 애니메이션 구현 및 Next.js Middleware 기반 호스트 라우팅.

### 3단계: 백엔드(Ruby on Rails) Fly.io 실배포 지원
상황: 사용자의 요청으로 백엔드를 Fly.io 환경에 배포하고, 크롤링 기능 유지를 위한 서버 구성을 완료해야 함.
해결:
- **설정 파일 구성**: `backend/fly.toml`을 생성하여 SQLite 데이터를 위한 볼륨(`rails_storage`) 및 도쿄(`nrt`) 지역 설정.
- **환경 보안 설정**: `RAILS_MASTER_KEY` 및 CORS 허용을 위한 `FRONTEND_URL`을 Fly.io Secrets로 등록.
- **배포 트러블슈팅**: `flyctl` 설치 가이드 제공 및 `hkg`(홍콩) 지역 미지원 이슈를 `nrt`(도쿄)로 변경하여 해결.
- **DB 마이그레이션**: 배포 후 데이터 정합성을 위한 `fly rails db:migrate` 명령어 안내.
기술적 포인트: Fly.io의 Volume과 Secrets 기능을 활용한 Rails 8 프로젝트의 프로덕션 배포.

---
실행 결과: 프론트엔드(Vercel)와 백엔드(Fly.io)의 배포 기반이 모두 마련되었으며, Wayo 브랜드의 PC 전용 고품질 UI가 실서비스 환경에서 동작 가능한 상태로 구축됨.
