# Create initial FAQ entries
faqs_data = [
  {
    question: "초대장은 어떻게 만드나요?",
    answer: "로그인 후 '새 초대장 만들기' 버튼을 클릭하면 간단한 양식을 통해 초대장을 만들 수 있습니다. 테마 선택, 날짜/시간 설정, 장소 입력 등을 진행하시면 됩니다.",
    position: 1
  },
  {
    question: "초대장을 수정할 수 있나요?",
    answer: "네, 가능합니다. '내 초대장 관리' 페이지에서 수정하고 싶은 초대장을 선택한 후 편집 버튼을 클릭하시면 됩니다.",
    position: 2
  },
  {
    question: "초대장을 어떻게 공유하나요?",
    answer: "초대장 상세 페이지에서 '공유하기' 버튼을 클릭하면 링크가 생성됩니다. 이 링크를 카카오톡, 문자, 이메일 등으로 전송하시면 됩니다.",
    position: 3
  },
  {
    question: "참석 여부는 어떻게 확인하나요?",
    answer: "초대장 관리 페이지에서 각 초대장의 '참석자 목록' 버튼을 클릭하면 참석 확정, 불참, 미응답 인원을 확인할 수 있습니다.",
    position: 4
  },
  {
    question: "무료로 사용할 수 있나요?",
    answer: "네, WAYO의 기본 기능은 모두 무료로 제공됩니다. 초대장 생성, 공유, 참석 관리 등 핵심 기능을 제한 없이 사용하실 수 있습니다.",
    position: 5
  },
  {
    question: "모바일에서도 사용할 수 있나요?",
    answer: "네, WAYO는 모바일과 데스크톱 모두에서 최적화되어 있습니다. 어떤 기기에서든 편리하게 초대장을 만들고 관리할 수 있습니다.",
    position: 6
  }
]

faqs_data.each do |faq_data|
  Faq.find_or_create_by(question: faq_data[:question]) do |faq|
    faq.answer = faq_data[:answer]
    faq.position = faq_data[:position]
  end
end

puts "✅ Created #{Faq.count} FAQs"
