# 가보자고 빠른 시작 스크립트 (Windows PowerShell)

Write-Host "🎉 가보자고 프로젝트 시작" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# 1. Redis 확인
Write-Host "1️⃣ Redis 연결 확인 중..." -ForegroundColor Cyan
$redisRunning = $false
try {
    $result = redis-cli ping 2>$null
    if ($result -eq "PONG") {
        Write-Host "✅ Redis 실행 중" -ForegroundColor Green
        $redisRunning = $true
    }
}
catch {
    Write-Host "❌ Redis가 실행되지 않았습니다" -ForegroundColor Red
    Write-Host "   Redis를 먼저 실행해주세요: redis-server" -ForegroundColor Yellow
}

Write-Host ""

# 2. Backend 설정
Write-Host "2️⃣ Backend 설정 확인 중..." -ForegroundColor Cyan
cd backend

# Gem 설치 확인
if (!(Test-Path "Gemfile.lock")) {
    Write-Host "📦 Gem 설치 중..." -ForegroundColor Yellow
    bundle install
}
else {
    Write-Host "✅ Gem 설치 완료" -ForegroundColor Green
}

# 데이터베이스 확인
if (!(Test-Path "db/development.sqlite3")) {
    Write-Host "🗄️ 데이터베이스 생성 중..." -ForegroundColor Yellow
    bin/rails db:create db:migrate db:seed
}
else {
    Write-Host "✅ 데이터베이스 준비 완료" -ForegroundColor Green
}

Write-Host ""

# 3. Frontend 설정
Write-Host "3️⃣ Frontend 설정 확인 중..." -ForegroundColor Cyan
cd ../frontend

if (!(Test-Path "node_modules")) {
    Write-Host "📦 npm 패키지 설치 중..." -ForegroundColor Yellow
    npm install
}
else {
    Write-Host "✅ npm 패키지 설치 완료" -ForegroundColor Green
}

cd ..

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "🚀 설정 완료!" -ForegroundColor Green
Write-Host ""
Write-Host "다음 명령어로 서버를 실행하세요:" -ForegroundColor Cyan
Write-Host ""
Write-Host "# 터미널 1: Backend" -ForegroundColor Yellow
Write-Host "cd backend && bin/rails server -p 3401" -ForegroundColor White
Write-Host ""

if ($redisRunning) {
    Write-Host "# 터미널 2: Sidekiq (백그라운드 작업)" -ForegroundColor Yellow
    Write-Host "cd backend && bundle exec sidekiq -C config/sidekiq.yml" -ForegroundColor White
    Write-Host ""
}

Write-Host "# 터미널 3: Frontend" -ForegroundColor Yellow
Write-Host "cd frontend && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "접속 주소:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:3400" -ForegroundColor White
Write-Host "  Backend:  http://localhost:3401" -ForegroundColor White
if ($redisRunning) {
    Write-Host "  Sidekiq:  http://localhost:3401/sidekiq" -ForegroundColor White
}
Write-Host ""
