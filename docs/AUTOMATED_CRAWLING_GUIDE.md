# 🔄 정기 크롤링 자동화 가이드

## 📋 개요

Sidekiq과 Redis를 사용하여 이벤트 크롤링을 자동화합니다.

- **매일 새벽 3시** 자동 크롤링
- **백그라운드 작업** 처리로 서버 부하 최소화
- **Web UI**를 통한 작업 모니터링

---

## 🛠️ 설치 방법

### 1단계: Gem 설치

```bash
cd backend
bundle install
```

### 2단계: Redis 설치 및 실행

#### Windows (Chocolatey 사용)

```powershell
# Chocolatey 설치 (관리자 권한 PowerShell)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Redis 설치
choco install redis-64 -y

# Redis 서비스 시작
redis-server
```

#### Windows (WSL 사용)

```bash
# WSL에서 실행
sudo apt-get update
sudo apt-get install redis-server
sudo service redis-server start
```

#### macOS

```bash
brew install redis
brew services start redis
```

### 3단계: Redis 연결 확인

```bash
redis-cli ping
# 응답: PONG
```

---

## 🚀 실행 방법

### 개발 환경

#### 1. Rails 서버 실행

```bash
cd backend
bin/rails server -p 3401
```

#### 2. Sidekiq 실행 (별도 터미널)

```bash
cd backend
bundle exec sidekiq -C config/sidekiq.yml
```

#### 3. Sidekiq Web UI 접속

```
http://localhost:3401/sidekiq
```

---

## ⏰ 크론 스케줄 설정

### 현재 스케줄 (`config/sidekiq.yml`)

| 작업명               | 스케줄      | 설명                       |
| -------------------- | ----------- | -------------------------- |
| event_crawler        | `0 3 * * *` | 매일 새벽 3시 실행         |
| weekly_event_crawler | `0 9 * * 1` | 매주 월요일 9시 (비활성화) |

### 크론 표현식 예시

```
분 시 일 월 요일
*  *  *  *  *

0  3  *  *  *   # 매일 03:00
0  */6 *  *  *   # 6시간마다
0  9  *  *  1   # 매주 월요일 09:00
0  0  1  *  *   # 매월 1일 00:00
```

### 스케줄 수정 방법

1. `config/sidekiq.yml` 파일 수정
2. Sidekiq 재시작

```bash
# Ctrl+C로 중지 후 재실행
bundle exec sidekiq -C config/sidekiq.yml
```

---

## 🎯 수동 실행 방법

### Rails Console에서 즉시 실행

```ruby
# Rails console 실행
bundle exec rails console

# 즉시 실행
EventCrawlerWorker.perform_async

# 또는 직접 실행 (동기)
EventDataService.call
```

### Sidekiq Web UI에서 실행

1. `http://localhost:3401/sidekiq` 접속
2. **Cron** 탭 클릭
3. `event_crawler` 옆 **Enqueue now** 버튼 클릭

---

## 📊 모니터링

### Sidekiq Web UI 기능

- **Dashboard**: 작업 통계, 큐 상태
- **Busy**: 현재 실행 중인 작업
- **Queues**: 대기 중인 작업
- **Retries**: 재시도 중인 작업
- **Scheduled**: 예약된 작업
- **Dead**: 실패한 작업
- **Cron**: 정기 작업 관리

### 로그 확인

```bash
# Rails 로그
tail -f log/development.log

# Sidekiq 로그
tail -f log/sidekiq.log
```

---

## 🔧 환경 변수 설정

### `.env` 파일 (선택사항)

```bash
# Redis 연결
REDIS_URL=redis://localhost:6379/1

# Tour API 키 (발급 후 설정)
TOUR_API_KEY=your_api_key_here
```

### Rails Credentials (권장)

```bash
# credentials 편집
EDITOR="code --wait" bin/rails credentials:edit

# 추가할 내용
tour_api:
  key: your_api_key_here
```

---

## 🐳 Docker 환경 (선택사항)

### docker-compose.yml 예시

```yaml
version: "3.8"

services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  sidekiq:
    build: .
    command: bundle exec sidekiq -C config/sidekiq.yml
    depends_on:
      - redis
    environment:
      - REDIS_URL=redis://redis:6379/1
    volumes:
      - .:/app

volumes:
  redis_data:
```

---

## ⚠️ 주의사항

1. **Redis 필수**: Sidekiq은 Redis가 반드시 실행 중이어야 합니다
2. **메모리 관리**: 크롤링 작업은 메모리를 많이 사용할 수 있으므로 모니터링 필요
3. **API 제한**: Tour API는 일일 호출 제한이 있으므로 과도한 크롤링 주의
4. **타임존**: 서버 시간대 확인 (한국 시간: `Asia/Seoul`)

---

## 🔍 문제 해결

### Redis 연결 실패

```bash
# Redis 실행 확인
redis-cli ping

# Redis 재시작
sudo service redis-server restart  # Linux/WSL
brew services restart redis         # macOS
```

### Sidekiq 작업 실패

1. Sidekiq Web UI → **Dead** 탭에서 실패 원인 확인
2. 로그 파일 확인: `log/sidekiq.log`
3. 필요시 **Retry** 버튼으로 재시도

### 크론 작업이 실행되지 않음

```ruby
# Rails console에서 확인
Sidekiq::Cron::Job.all

# 크론 작업 재로드
schedule = YAML.load_file('config/sidekiq.yml')
Sidekiq::Cron::Job.load_from_hash!(schedule[:schedule])
```

---

## 📚 다음 단계

1. ✅ Redis 설치 및 실행
2. ✅ Sidekiq 실행
3. ✅ Web UI에서 작업 확인
4. 🔜 Tour API 키 발급 및 설정
5. 🔜 프로덕션 환경 배포 설정

---

_이 가이드는 가보자고 프로젝트를 위해 작성되었습니다._
