---
description: 프론트엔드와 백엔드 변경사항을 배포하는 방법
---

# Wayo 배포 워크플로우

// turbo-all

## 1. 프론트엔드 변경 시 (자동 배포)
```bash
cd /Users/admin/Desktop/gabojago
git add .
git commit -m "변경 내용"
git push
```
→ Vercel이 자동으로 빌드 및 배포

## 2. 백엔드 변경 시 (수동 배포 필요!)
```bash
cd /Users/admin/Desktop/gabojago/backend
fly deploy
```

## 3. 둘 다 변경 시 (일반적인 경우)
```bash
cd /Users/admin/Desktop/gabojago
git add .
git commit -m "변경 내용"
git push
cd backend
fly deploy
```

## 중요 참고사항
- **프론트엔드**: `git push` → Vercel 자동 배포
- **백엔드**: `git push` 후 반드시 `fly deploy` 실행 필요!
- 백엔드 배포 URL: https://wayo.fly.dev/
- 프론트엔드 배포: Vercel 대시보드에서 확인
