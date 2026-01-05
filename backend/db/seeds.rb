# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# Clear existing data
Item.destroy_all

puts "Creating Items..."

Item.create!([
  {
    title: "[브랜드] 우리 아이 눈물 싹 잡는 소간 파우더 100g",
    description: "청정 호주산 소간으로 만든 기호성 최고의 파우더입니다. 눈물 자국 완화에 도움을 줍니다.",
    price: 15900,
    category: "사료/간식",
    image_url: "https://images.unsplash.com/photo-1589924691195-41432c84c161?q=80&w=500&auto=format&fit=crop"
  },
  {
    title: "터지지 않는 삑삑이 공 (3개입)",
    description: "아무리 물어도 터지지 않는 특수 소재 삑삑이! 스트레스 해소에 딱이에요.",
    price: 9900,
    category: "장난감",
    image_url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=500&auto=format&fit=crop"
  },
  {
    title: "말랑 푹신 마약 방석 (L size)",
    description: "한 번 누르면 못 일어나는 마성의 방석. 꿀잠 보장합니다.",
    price: 39800,
    category: "케어",
    image_url: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?q=80&w=500&auto=format&fit=crop"
  },
  {
    title: "야간 산책용 LED 목걸이",
    description: "밤에도 안전하게! 3가지 모드로 반짝이는 LED 목걸이입니다. 사이즈 조절 가능.",
    price: 12500,
    category: "산책용품",
    image_url: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=500&auto=format&fit=crop"
  },
  {
    title: "프리미엄 연어 큐브 트릿 300g",
    description: "오메가3가 풍부한 연어로 만든 영양 간식. 피부 모질 개선에 좋아요.",
    price: 21000,
    category: "사료/간식",
    image_url: "https://images.unsplash.com/photo-1535930749574-1399327ce78f?q=80&w=500&auto=format&fit=crop"
  },
  {
    title: "자동 급식기 (카메라 포함)",
    description: "앱으로 언제 어디서나 밥을 챙겨주세요. 아이가 잘 먹는지 카메라로 확인 가능!",
    price: 129000,
    category: "케어",
    image_url: "https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?q=80&w=500&auto=format&fit=crop"
  }
])

puts "Items Created!"
