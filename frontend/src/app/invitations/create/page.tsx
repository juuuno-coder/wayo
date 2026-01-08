"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Sparkles,
  Calendar,
  Ticket,
  User
} from "lucide-react";
import NextImage from "next/image";
import DaumPostcodeEmbed from 'react-daum-postcode';
import { motion, AnimatePresence } from "framer-motion";
import PCInvitationView from "@/components/PCInvitationView";
import { Black_Han_Sans, Inter } from "next/font/google";
import { API_BASE_URL } from "@/config";

const blackHanSans = Black_Han_Sans({
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

const themes: Record<string, { name: string, bg: string, text: string, accent: string }> = {
  classic: { name: '클래식', bg: 'bg-[#2C3E50]', text: 'text-white', accent: 'border-gold-500' },
  romance: { name: '로맨틱', bg: 'bg-pink-100', text: 'text-pink-900', accent: 'border-pink-300' },
  party: { name: '파티', bg: 'bg-purple-600', text: 'text-white', accent: 'border-purple-300' },
  business: { name: '비즈니스', bg: 'bg-gray-100', text: 'text-gray-800', accent: 'border-gray-300' },
  nature: { name: '네이처', bg: 'bg-green-100', text: 'text-green-800', accent: 'border-green-300' },
};

const steps = [
  { icon: "📐", title: "어떤 형태로\n만드시겠어요?", subtitle: "초대장의 기본 구조를 먼저 선택해주세요." },
  { icon: "🎉", title: "어떤 행사를\n계획 중이신가요?", subtitle: "초대장의 멋진 제목을 지어주세요." },
  { icon: "📅", title: "언제\n만나면 좋을까요?", subtitle: "정확한 일시를 알려주세요." },
  { icon: "📍", title: "어디서\n열리는 행사인가요?", subtitle: "알기 쉬운 장소나 주소를 입력해주세요." },
  { icon: "📸", title: "행사를 대표할\n사진이 있나요?", subtitle: "포스터나 약도 등 여러 장 올릴 수 있어요." },
  { icon: "🎨", title: "어떤 분위기로\n초대장을 꾸밀까요?", subtitle: "마음에 드는 테마를 골라보세요." },
  { icon: "🎟️", title: "티켓을\n첨부하시겠어요?", subtitle: "참석자에게 발급할 티켓을 선택하세요." },
  { icon: "🎼", title: "어떤 감성을\n담아볼까요?", subtitle: "글씨체와 음악을 선택해보세요." },
  { icon: "💌", title: "소중한 분들에게\n전할 말이 있나요?", subtitle: "따뜻한 초대 문구를 적어주세요." },
  { icon: "✨", title: "거의 다 됐어요!\n마지막으로 확인해주세요", subtitle: "수정이 필요하면 이전을 눌러주세요." }
];

export default function CreateInvitationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    sender_name: "",
    event_date: "",
    event_end_date: "",
    location: "",
    theme_color: "classic",
    cover_image_url: "",
    font_style: 'serif',
    bgm: 'none',
    text_effect: 'none',
    ticket_type_id: null as number | null,
    default_layout: 'spread'
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [ticketTypes, setTicketTypes] = useState<any[]>([]);
  const [isPC, setIsPC] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdId, setCreatedId] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false); // For mobile toggle
  const [expandedSection, setExpandedSection] = useState<string | null>(null); // For collapsible sections

  useEffect(() => {
    const checkPC = () => setIsPC(window.innerWidth >= 1024);
    checkPC();
    window.addEventListener('resize', checkPC);
    return () => window.removeEventListener('resize', checkPC);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/ticket_types`)
      .then(res => res.json())
      .then(data => setTicketTypes(data))
      .catch(err => console.error("Failed to load tickets", err));
  }, []);

  // Location States
  const [placeName, setPlaceName] = useState("");
  const [roadAddress, setRoadAddress] = useState("");
  const [isAddressOpen, setIsAddressOpen] = useState(false);

  // Sync location states to formData
  useEffect(() => {
    const fullLocation = roadAddress ? `${placeName} (${roadAddress})` : placeName;
    setFormData(prev => ({ ...prev, location: fullLocation }));
  }, [placeName, roadAddress]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newFiles = [...imageFiles, ...files];
      setImageFiles(newFiles);

      const newUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    const newFiles = [...imageFiles];
    const newUrls = [...previewUrls];
    newFiles.splice(index, 1);
    newUrls.splice(index, 1);
    setImageFiles(newFiles);
    setPreviewUrls(newUrls);
  }

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();

      // Append invitation attributes
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(`invitation[${key}]`, value.toString());
        }
      });

      // Append image files
      imageFiles.forEach((file) => {
        formDataToSend.append("invitation[images][]", file);
      });

      const response = await fetch(`${API_BASE_URL}/invitations`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken") || ""}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        setCreatedId(data.id);
        setShowSuccessModal(true);
      } else {
        alert("초대장 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error creating invitation:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  const selectedTheme = themes[formData.theme_color] || themes.classic;

  const isNextDisabled = () => {
    switch (currentStep) {
      case 0: return !formData.default_layout; // Layout (New Step 0)
      case 1: return !formData.title;          // Title
      case 2: return !formData.event_date;     // Date
      case 3: return !formData.location;       // Location
      case 8: return !formData.description;    // Description (was 7/8, now 8)
      default: return false;
    }
  };

  return (
    <div className={`h-screen bg-[#FDFBF7] flex flex-col lg:flex-row ${inter.className} overflow-hidden`}>
      {/* Left: Editor Area */}
      <div className={`flex flex-col bg-white border-r border-gray-100 z-50 shadow-xl transition-all h-screen ${isPC ? 'w-[450px]' : 'w-full'}`}>
        {/* Header & Progress inside Editor */}
        <div className="shrink-0 bg-white z-50">
          <header className="px-4 py-3 flex items-center h-14 justify-between">
            <button onClick={() => router.back()} className="text-gray-800 p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div className="text-xs font-black text-[#E74C3C] tracking-widest uppercase">Editor v1.1</div>
          </header>
          <div className="h-1 bg-gray-100 w-full overflow-hidden">
            <div
              className="h-full bg-[#E74C3C] transition-all duration-300 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-8 pt-10 pb-8">
          {/* Step Header */}
          <div className="mb-10 animate-in slide-in-from-right fade-in duration-500">
            <div className="text-6xl mb-6 animate-bounce-slow transform hover:scale-110 transition-transform origin-left cursor-default">
              {steps[currentStep].icon}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3 whitespace-pre-wrap leading-tight">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-500 text-lg font-medium">
              {steps[currentStep].subtitle}
            </p>
          </div>

          {/* Step 0: Layout Selection (NEW POSITION) */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-in slide-in-from-right fade-in duration-500 delay-100 pb-10">
              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: 'spread', label: '스탠다드 (Standard)', desc: '모바일은 스크롤, PC는 2쪽 보기로 최적화된 기본 레이아웃', icon: '📱+💻', isPremium: false },
                  { id: 'leaflet', label: '프리미엄 리플렛 (Leaflet)', desc: '앞뒤로 넘겨보는 인터랙티브 브로슈어 (Coming Soon)', icon: '✨', isPremium: true },
                ].map((layout) => (
                  <button
                    key={layout.id}
                    onClick={() => setFormData({ ...formData, default_layout: layout.id })}
                    className={`p-6 rounded-3xl border-2 transition-all text-left flex items-start gap-4 ${formData.default_layout === layout.id
                      ? "bg-gray-900 border-gray-900 text-white shadow-xl ring-2 ring-gray-200"
                      : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                      }`}
                  >
                    <div className="text-3xl">{layout.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`text-lg font-bold ${formData.default_layout === layout.id ? 'text-white' : 'text-gray-900'}`}>{layout.label}</p>
                        {layout.isPremium && <span className="text-[10px] bg-[#E74C3C] text-white px-2 py-0.5 rounded-full font-bold">PREMIUM</span>}
                      </div>
                      <p className={`text-sm ${formData.default_layout === layout.id ? 'text-gray-400' : 'text-gray-500'}`}>{layout.desc}</p>
                    </div>
                    {formData.default_layout === layout.id && (
                      <div className="ml-auto mt-1 text-green-400">
                        <CheckCircle2 size={24} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Title (Was 0) */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right fade-in duration-500 delay-100">
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Sparkles size={24} />
                </div>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="초대장 제목 (예: 15분도시 부산 워크숍)"
                  className="w-full pl-14 pr-4 py-5 bg-white border-none rounded-2xl font-bold text-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#E74C3C] focus:bg-white transition-all outline-none shadow-sm"
                  autoFocus
                />
              </div>

              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={24} />
                </div>
                <input
                  type="text"
                  value={formData.sender_name}
                  onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                  placeholder="초대하시는 분의 이름/단체명"
                  className="w-full pl-14 pr-4 py-5 bg-white border-none rounded-2xl font-bold text-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#E74C3C] focus:bg-white transition-all outline-none shadow-sm"
                />
              </div>
              <p className="text-xs text-gray-400 px-2 leading-relaxed">
                * 입력하신 이름은 초대장 인트로 화면에 표시됩니다.<br />
                (예: <span className="text-[#E74C3C] font-bold">{formData.sender_name || "홍길동"}</span>님으로부터 소중한 초대장이 도착했습니다)
              </p>
            </div>
          )}

          {/* Step 2: Date & Time (Was 1) */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right fade-in duration-500 delay-100">
              {/* Start Date */}
              <div className="p-5 bg-white rounded-2xl border border-transparent focus-within:border-[#E74C3C] focus-within:bg-white focus-within:ring-2 focus-within:ring-red-100 transition-all shadow-sm">
                <label className="block text-sm font-bold text-gray-500 mb-2">시작 날짜</label>
                <input
                  type="date"
                  value={formData.event_date.split('T')[0] || ''}
                  onChange={(e) => {
                    const time = formData.event_date.split('T')[1] || '00:00';
                    setFormData({ ...formData, event_date: `${e.target.value}T${time}` });
                  }}
                  className="w-full bg-transparent font-bold text-xl text-gray-900 outline-none"
                />
              </div>
              {/* Start Time */}
              <div className="p-5 bg-white rounded-2xl border border-transparent focus-within:border-[#E74C3C] focus-within:bg-white focus-within:ring-2 focus-within:ring-red-100 transition-all shadow-sm">
                <label className="block text-sm font-bold text-gray-500 mb-2">시작 시간</label>
                <input
                  type="time"
                  value={formData.event_date.split('T')[1] || ''}
                  onChange={(e) => {
                    const date = formData.event_date.split('T')[0] || new Date().toISOString().split('T')[0];
                    setFormData({ ...formData, event_date: `${date}T${e.target.value}` });
                  }}
                  className="w-full bg-transparent font-bold text-xl text-gray-900 outline-none"
                />
              </div>

              {/* Toggle for End Time */}
              {!showEndTime ? (
                <button
                  type="button"
                  onClick={() => setShowEndTime(true)}
                  className="w-full p-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold text-sm hover:border-[#E74C3C] hover:text-[#E74C3C] hover:bg-red-50/50 transition-all flex items-center justify-center gap-2"
                >
                  <span className="text-lg">⏰</span> 종료 시간도 입력할게요
                </button>
              ) : (
                <>
                  {/* Divider */}
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">종료 시간</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>

                  {/* End Date */}
                  <div className="p-5 bg-white rounded-2xl border border-transparent focus-within:border-[#E74C3C] focus-within:bg-white focus-within:ring-2 focus-within:ring-red-100 transition-all shadow-sm">
                    <label className="block text-sm font-bold text-gray-500 mb-2">종료 날짜</label>
                    <input
                      type="date"
                      value={formData.event_end_date.split('T')[0] || ''}
                      onChange={(e) => {
                        const time = formData.event_end_date.split('T')[1] || '00:00';
                        setFormData({ ...formData, event_end_date: `${e.target.value}T${time}` });
                      }}
                      className="w-full bg-transparent font-bold text-xl text-gray-900 outline-none"
                    />
                  </div>
                  {/* End Time */}
                  <div className="p-5 bg-white rounded-2xl border border-transparent focus-within:border-[#E74C3C] focus-within:bg-white focus-within:ring-2 focus-within:ring-red-100 transition-all shadow-sm">
                    <label className="block text-sm font-bold text-gray-500 mb-2">종료 시간</label>
                    <input
                      type="time"
                      value={formData.event_end_date.split('T')[1] || ''}
                      onChange={(e) => {
                        const date = formData.event_end_date.split('T')[0] || formData.event_date.split('T')[0] || new Date().toISOString().split('T')[0];
                        setFormData({ ...formData, event_end_date: `${date}T${e.target.value}` });
                      }}
                      className="w-full bg-transparent font-bold text-xl text-gray-900 outline-none"
                    />
                  </div>

                  {/* Cancel End Time */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowEndTime(false);
                      setFormData({ ...formData, event_end_date: '' });
                    }}
                    className="w-full p-3 text-gray-400 font-bold text-xs hover:text-red-500 transition-colors"
                  >
                    종료 시간 삭제
                  </button>
                </>
              )}
            </div>
          )}

          {/* Step 3: Location (Was 2) */}
          {currentStep === 3 && (
            <div className="animate-in slide-in-from-right fade-in duration-500 delay-100">
              <div className="relative space-y-4">
                {/* Place Name Input */}
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                    <MapPin size={24} />
                  </div>
                  <input
                    type="text"
                    value={placeName}
                    onChange={(e) => setPlaceName(e.target.value)}
                    placeholder="예) 강남역 10번 출구, 우리집"
                    className="w-full pl-14 pr-4 py-5 bg-white border-none rounded-2xl font-bold text-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#E74C3C] focus:bg-white transition-all outline-none shadow-sm"
                    autoFocus
                  />
                </div>

                {/* Address Display & Search Button */}
                {roadAddress ? (
                  <div className="p-4 bg-red-50 rounded-2xl flex items-center justify-between group cursor-pointer" onClick={() => setIsAddressOpen(true)}>
                    <div className="flex items-center gap-2 text-[#E74C3C]">
                      <span className="text-xs font-bold bg-red-100 px-2 py-1 rounded-md">도로명</span>
                      <span className="font-medium text-sm">{roadAddress}</span>
                    </div>
                    <span className="text-red-400 text-xs">수정</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddressOpen(true)}
                    className="text-gray-500 text-sm font-medium underline underline-offset-4 hover:text-[#E74C3C] transition-colors ml-4"
                  >
                    정확한 주소도 입력할게요
                  </button>
                )}
              </div>

              {/* Daum Postcode Modal */}
              {isAddressOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                  <div className="bg-white w-full max-w-md h-[80vh] sm:h-[600px] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl relative animate-in slide-in-from-bottom duration-300">
                    <div className="p-4 flex items-center justify-between border-b border-gray-100">
                      <h3 className="font-bold text-lg">주소 검색</h3>
                      <button onClick={() => setIsAddressOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </div>
                    <div className="flex-1 relative">
                      <DaumPostcodeEmbed
                        onComplete={(data: any) => {
                          setRoadAddress(data.roadAddress || data.address);
                          setIsAddressOpen(false);
                        }}
                        style={{ width: '100%', height: '100%' }}
                        className="absolute inset-0"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Image Upload (Was 3) */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right fade-in duration-500 delay-100">
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="aspect-square bg-white border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-[#E74C3C] hover:bg-red-50 transition-all active:scale-95"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-2">
                    <Sparkles className="text-[#E74C3C]" size={20} />
                  </div>
                  <p className="font-bold text-gray-600 text-sm">사진 추가</p>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>

                {previewUrls.map((url, index) => (
                  <div key={index} className="aspect-square relative rounded-3xl overflow-hidden border border-gray-100 shadow-sm animate-in zoom-in duration-300">
                    <NextImage src={url} alt={`Preview ${index}`} fill className="object-cover" />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition-colors backdrop-blur-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] font-bold text-center py-1 backdrop-blur-sm">대표 사진</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Theme (Was 4) */}
          {currentStep === 5 && (
            <div className="animate-in slide-in-from-right fade-in duration-500 delay-100 pb-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(themes).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => setFormData({ ...formData, theme_color: key })}
                    className={`p-4 rounded-3xl border-2 transition-all duration-300 text-left relative overflow-hidden group ${formData.theme_color === key ? "border-[#E74C3C] bg-red-50 ring-2 ring-red-100" : "border-gray-100 bg-white hover:border-gray-200"
                      }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl mb-4 ${value.bg} flex items-center justify-center shadow-inner`}>
                      <Sparkles className={`${value.text.replace('text-', 'text-opacity-70 text-')}`} size={20} />
                    </div>
                    <p className="font-bold text-gray-900 text-lg mb-1">{value.name}</p>
                    {formData.theme_color === key && (
                      <div className="absolute top-4 right-4 text-[#E74C3C] animate-in zoom-in">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Ticket Selection (Coming Soon) */}
          {currentStep === 6 && (
            <div className="flex flex-col items-center justify-center py-10 animate-in slide-in-from-right fade-in duration-500 delay-100">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-8 text-[#E74C3C] animate-bounce-slow">
                <Ticket size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">티켓 첨부 기능</h3>
              <p className="text-gray-500 text-center mb-10 leading-relaxed font-medium">
                초대장에 실물 티켓을 첨부할 수 있는 기능은<br />
                현재 <span className="text-[#E74C3C] font-black">프리미엄 기능</span>으로 준비 중입니다 🚀
              </p>
              <div className="w-full p-6 bg-gray-50 rounded-3xl border border-gray-100 italic text-sm text-gray-400 text-center">
                곧 더 멋진 기능으로 찾아뵙겠습니다!
              </div>
            </div>
          )}

          {/* Step 7: Detail Decoration (Was 6) */}
          {currentStep === 7 && (
            <div className="space-y-8 animate-in slide-in-from-right fade-in duration-500 delay-100 pb-10">

              {/* Font Selection */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-500 ml-1">글씨체</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'serif', label: '명조체', font: 'font-serif' },
                    { id: 'sans', label: '고딕체', font: 'font-sans' },
                    { id: 'hand', label: '손글씨', font: 'font-hand' } // Assuming css class exists or fallback
                  ].map(font => (
                    <button
                      key={font.id}
                      onClick={() => setFormData({ ...formData, font_style: font.id })}
                      className={`p-4 rounded-2xl border transition-all ${formData.font_style === font.id
                        ? "bg-gray-900 text-white border-gray-900 shadow-lg"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      <span className={`text-lg ${font.id === 'serif' ? 'font-serif' : font.id === 'sans' ? 'font-sans' : ''}`}>
                        {font.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Effect Selection */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-500 ml-1">텍스트 효과</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'none', label: '기본', icon: 'aa' },
                    { id: 'gold', label: '금박', icon: '✨' },
                    { id: 'silver', label: '은박', icon: '⚪️' }
                  ].map(effect => (
                    <button
                      key={effect.id}
                      onClick={() => setFormData({ ...formData, text_effect: effect.id })}
                      className={`p-4 rounded-2xl border transition-all relative overflow-hidden ${formData.text_effect === effect.id
                        ? "bg-red-50 border-[#E74C3C] text-[#E74C3C] ring-1 ring-[#E74C3C]"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      <span className={`block mb-1 text-xl ${effect.id === 'gold' ? 'text-yellow-500' : effect.id === 'silver' ? 'text-gray-400' : ''
                        }`}>{effect.icon}</span>
                      <span className="text-sm font-bold">{effect.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* BGM Selection */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-500 ml-1">배경음악 (BGM)</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'none', label: '없음', icon: '🔇' },
                    { id: 'classic', label: '클래식 (Piano)', icon: '🎹' },
                    { id: 'jazz', label: '재즈 (Jazz)', icon: '🎷' },
                    { id: 'acoustic', label: '어쿠스틱', icon: '🎸' }
                  ].map(bgm => (
                    <button
                      key={bgm.id}
                      onClick={() => setFormData({ ...formData, bgm: bgm.id })}
                      className={`p-4 rounded-2xl border transition-all flex items-center gap-3 ${formData.bgm === bgm.id
                        ? "bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      <span className="text-xl">{bgm.icon}</span>
                      <span className="font-bold text-sm">{bgm.label}</span>
                      {formData.bgm === bgm.id && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* OLD STEP 7 REMOVED HERE (Layout was here) */}

          {/* Step 8: Description (Was 8 -> Now 8? No, previously 7 was Layout, 8 was Desc. Since we inserted 0, 8 becomes 8. Wait.
            Orig: 0,1,2,3,4,5,6,7(Layout),8(Desc),9(Preview)
            New:  0(Layout), 1,2,3,4,5,6,7, 8(Desc), 9(Preview)
            Wait. If we insert at 0, everything shifts by +1.
            Old 0 -> New 1.
            Old 7 (Layout) -> New 8.
            Old 8 (Desc) -> New 9.
            Old 9 (Prev) -> New 10.
            But we removed Old 7.
            So:
            New 0: Layout
            New 1: Title (Old 0)
            ...
            New 7: Decoration (Old 6)
            New 8: Description (Old 8) - Because Old 7 is gone.
            New 9: Preview (Old 9)
            Indices align:
            0 (Layout)
            1 (Title)
            2 (Date)
            3 (Loc)
            4 (Img)
            5 (Theme)
            6 (Ticket)
            7 (Decor)
            8 (Desc)
            9 (Preview)
        */}

          {/* Step 8: Description */}
          {currentStep === 8 && (
            <div className="animate-in slide-in-from-right fade-in duration-500 delay-100">
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="따뜻한 인사말을 건네보세요."
                className="w-full p-6 bg-white border-none rounded-3xl h-80 resize-none font-medium text-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#E74C3C] focus:bg-white transition-all outline-none leading-relaxed shadow-sm"
                autoFocus
              />
            </div>
          )}

          {/* Step 9: Final Review with Live Preview */}
          {currentStep === 9 && (
            <div className="animate-in slide-in-from-right fade-in duration-500 delay-100 pb-10">
              {/* Mobile: Toggle between Edit and Preview */}
              {!isPC && (
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setShowPreview(false)}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${!showPreview
                        ? 'bg-[#E74C3C] text-white shadow-lg'
                        : 'bg-gray-100 text-gray-500'
                      }`}
                  >
                    ✏️ 수정하기
                  </button>
                  <button
                    onClick={() => setShowPreview(true)}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${showPreview
                        ? 'bg-[#E74C3C] text-white shadow-lg'
                        : 'bg-gray-100 text-gray-500'
                      }`}
                  >
                    👁️ 미리보기
                  </button>
                </div>
              )}

              {/* Edit Form (Mobile: conditional, PC: always visible) */}
              {(!showPreview || isPC) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">📝 최종 확인 및 수정</h3>

                  {/* Basic Info Section */}
                  <div className="bg-white rounded-2xl p-5 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-900">기본 정보</h4>
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="text-xs text-[#E74C3C] font-bold hover:underline"
                      >
                        수정
                      </button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">제목:</span>
                        <span className="ml-2 font-medium text-gray-900">{formData.title || '미입력'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">보내는 사람:</span>
                        <span className="ml-2 font-medium text-gray-900">{formData.sender_name || '미입력'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Date & Time Section */}
                  <div className="bg-white rounded-2xl p-5 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-900">일시</h4>
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="text-xs text-[#E74C3C] font-bold hover:underline"
                      >
                        수정
                      </button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">시작:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {formData.event_date ? new Date(formData.event_date).toLocaleString('ko-KR') : '미입력'}
                        </span>
                      </div>
                      {formData.event_end_date && (
                        <div>
                          <span className="text-gray-500">종료:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {new Date(formData.event_end_date).toLocaleString('ko-KR')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location Section */}
                  <div className="bg-white rounded-2xl p-5 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-900">장소</h4>
                      <button
                        onClick={() => setCurrentStep(3)}
                        className="text-xs text-[#E74C3C] font-bold hover:underline"
                      >
                        수정
                      </button>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{formData.location || '미입력'}</p>
                  </div>

                  {/* Images Section */}
                  <div className="bg-white rounded-2xl p-5 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-900">이미지 ({previewUrls.length}장)</h4>
                      <button
                        onClick={() => setCurrentStep(4)}
                        className="text-xs text-[#E74C3C] font-bold hover:underline"
                      >
                        수정
                      </button>
                    </div>
                    {previewUrls.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {previewUrls.slice(0, 3).map((url, idx) => (
                          <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-gray-100">
                            <NextImage src={url} alt={`Preview ${idx}`} width={100} height={100} className="object-cover w-full h-full" />
                          </div>
                        ))}
                        {previewUrls.length > 3 && (
                          <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">
                            +{previewUrls.length - 3}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">이미지 없음</p>
                    )}
                  </div>

                  {/* Theme & Style Section */}
                  <div className="bg-white rounded-2xl p-5 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-900">테마 & 스타일</h4>
                      <button
                        onClick={() => setCurrentStep(5)}
                        className="text-xs text-[#E74C3C] font-bold hover:underline"
                      >
                        수정
                      </button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">테마:</span>
                        <span className="ml-2 font-medium text-gray-900">{themes[formData.theme_color]?.name || '클래식'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">글씨체:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {formData.font_style === 'serif' ? '명조체' : formData.font_style === 'sans' ? '고딕체' : '손글씨'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">배경음악:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {formData.bgm === 'none' ? '없음' : formData.bgm === 'classic' ? '클래식' : formData.bgm === 'jazz' ? '재즈' : '어쿠스틱'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="bg-white rounded-2xl p-5 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-900">초대 문구</h4>
                      <button
                        onClick={() => setCurrentStep(8)}
                        className="text-xs text-[#E74C3C] font-bold hover:underline"
                      >
                        수정
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {formData.description || '미입력'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* OLD Step 9 Preview Card - REMOVED */}
          {currentStep === 999 && ( // Never rendered
            <div className={`w-full max-w-xs aspect-3/4 bg-white rounded-[2rem] shadow-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden transform hover:scale-[1.02] transition-transform duration-500 ${selectedTheme.bg} ring-1 ring-black/5`}>

              {/* Background Pattern/Image */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 -mt-8 opacity-100 z-0">
                <NextImage src="/images/wayo_envelope_3d.jpg" alt="Envelope" fill className="object-contain mix-blend-multiply" />
              </div>

              {/* User Uploaded Image or Default Sparkles */}
              {previewUrls.length > 0 && (
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                  <NextImage src={previewUrls[0]} alt="Cover Background" fill className="object-cover" />
                </div>
              )}

              <div className="relative z-10 mt-24 w-full">
                {/* Title with Effects */}
                <h1 className={`text-xl font-black mb-3 leading-tight break-keep ${selectedTheme.text} ${formData.font_style === 'serif' ? 'font-serif' : ''} ${formData.text_effect === 'gold' ? '!text-yellow-600 drop-shadow-sm' : formData.text_effect === 'silver' ? '!text-gray-400 drop-shadow-sm' : ''}`}>
                  {formData.title || "제목을 입력해주세요"}
                </h1>

                <div className={`w-8 h-1 bg-current opacity-20 mx-auto mb-4 rounded-full ${selectedTheme.text}`}></div>

                <p className={`font-medium text-xs mb-6 opacity-80 whitespace-pre-wrap ${selectedTheme.text} ${formData.font_style === 'serif' ? 'font-serif' : ''}`}>
                  {formData.description || "초대 문구가\n여기에 표시됩니다."}
                </p>

                <div className={`text-[10px] bg-white/10 backdrop-blur-md rounded-xl p-3 inline-block ${selectedTheme.text}`}>
                  <p className="font-bold opacity-90 mb-1">{formData.event_date ? new Date(formData.event_date).toLocaleDateString() : "0000.00.00"}</p>
                  <p className="opacity-70">{formData.location || "장소 미정"}</p>
                </div>
              </div>
            </div>

              {/* BGM Indicator in Preview */}
          {formData.bgm !== 'none' && (
            <div className="mt-6 flex items-center gap-2 text-gray-500 bg-gray-100 px-4 py-2 rounded-full text-xs font-bold animate-pulse">
              <span>🎵 {formData.bgm === 'classic' ? '클래식' : formData.bgm === 'jazz' ? '재즈' : '어쿠스틱'} 음악이 함께 전송됩니다</span>
            </div>
          )}
        </div>
          )}

      </div>

      {/* Fixed Bottom Action Bar (Inside Sidebar on PC, Global on Mobile) */}
      <div className="shrink-0 p-4 bg-white border-t border-gray-100 z-50 safe-area-bottom">
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              className="px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-colors active:scale-95"
            >
              이전
            </button>
          )}
          <button
            onClick={currentStep < steps.length - 1 ? handleNext : handleSubmit}
            disabled={isNextDisabled()}
            className="flex-1 py-4 bg-[#E74C3C] text-white text-lg rounded-2xl font-bold shadow-lg shadow-red-200 hover:bg-[#c0392b] disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none transition-all active:scale-95"
          >
            {currentStep < steps.length - 1 ? "다음" : "초대장 완성하기"}
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-300 mt-2 font-mono">v1.1 Editor</p>
      </div>
    </div>


      {/* Right: PC Side Preview (Visible Hub) */}
      {isPC && currentStep === 9 ? (
        <div className="flex-1 bg-[#1a1a1a] flex flex-col items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-500/10 blur-[150px] rounded-full" />
          <div className="w-full h-full relative z-10">
            <PCInvitationView
              invitation={{
                id: 0,
                title: formData.title || "초대장 제목",
                description: formData.description || "초대 문구를 입력해주세요",
                sender_name: formData.sender_name || "가보자고 친구",
                event_date: formData.event_date || new Date().toISOString(),
                event_end_date: formData.event_end_date,
                location: formData.location || "장소 미정",
                theme_color: formData.theme_color,
                cover_image_url: previewUrls[0] || "/images/wayo_envelope_3d.jpg",
                image_urls: previewUrls,
                font_style: formData.font_style,
                bgm: formData.bgm,
                text_effect: formData.text_effect,
                default_layout: formData.default_layout,
                view_count: 0,
                user: { nickname: formData.sender_name || "가보자고 친구" }
              }}
              onRSVP={async () => {}}
              hasResponded={false}
              myTicket={null}
              styleMode="embedded"
            />
          </div>
        </div>
      ) : isPC && (
      <div className="flex-1 bg-[#1a1a1a] flex flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-500/10 blur-[150px] rounded-full" />

        {/* Phone Frame for Live Preview */}
        <div className="relative w-full max-w-[380px] h-[780px] rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-[12px] border-[#333] z-10 scale-[0.9] xl:scale-100 transition-transform">
          {/* Dynamic Content inside Mock Phone */}
          <div className="absolute inset-0 bg-white overflow-y-auto no-scrollbar">
            <div className="relative w-full">
              {previewUrls.length > 0 ? (
                <img
                  src={previewUrls[0]}
                  alt="Preview"
                  className="w-full h-auto object-contain"
                />
              ) : (
                <div className="h-[400px] bg-gray-50 flex flex-col items-center justify-center text-gray-300">
                  <Sparkles size={48} className="mb-4 opacity-20" />
                  <p className="text-sm font-bold opacity-30">이미지를 추가해 주세요</p>
                </div>
              )}
            </div>
            <div className="p-8 pb-20">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-[#E74C3C] rounded-lg text-[10px] font-black uppercase mb-4 tracking-tighter">
                <Sparkles size={10} /> Live Preview
              </div>
              <h1 className={`text-3xl font-bold mb-4 leading-tight break-keep ${formData.font_style === 'serif' ? 'font-serif' : ''} ${formData.text_effect === 'gold' ? 'text-yellow-600' : formData.text_effect === 'silver' ? 'text-gray-400' : ''
                }`}>
                {formData.title || "초대장 제목"}
              </h1>
              <div className="w-10 h-1 bg-gray-100 mb-6 rounded-full" />
              <p className={`text-lg opacity-70 mb-10 whitespace-pre-wrap leading-relaxed ${formData.font_style === 'serif' ? 'font-serif' : ''}`}>
                {formData.description || "초대 문구가 여기에 표시됩니다.\n아직 작성된 내용이 없습니다."}
              </p>
              <div className="space-y-4 border-t border-gray-50 pt-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400">Date & Time</p>
                    <p className="font-bold text-sm">
                      {formData.event_date ? new Date(formData.event_date).toLocaleString() : "일시 미정"}
                      {formData.event_end_date && (
                        <span className="text-gray-400"> ~ {new Date(formData.event_end_date).toLocaleString()}</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400">Location</p>
                    <p className="font-bold text-sm">{formData.location || "장소 미정"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-white/30 text-[10px] font-black uppercase tracking-[0.2em] z-10">Wayo Pro Creator Studio</div>
      </div>
    )
  }

  {/* Success Modal */ }
  <AnimatePresence>
    {showSuccessModal && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl"
        >
          <div className="p-10 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#E74C3C]">
              <Sparkles size={40} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">초대장 완성!</h3>
            <p className="text-gray-500 font-medium leading-relaxed mb-8">
              멋진 초대장이 만들어졌습니다.<br />
              {localStorage.getItem("authToken")
                ? "고급 편집기 기능을 준비 중입니다.\n지금은 기본 초대장을 확인할 수 있어요!"
                : "로그인하시면 초대장을\n영구적으로 관리할 수 있습니다."
              }
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push(`/invitations/${createdId}`)}
                className="w-full py-4 bg-[#E74C3C] text-white rounded-2xl font-bold text-lg hover:bg-[#c0392b] transition-colors shadow-lg shadow-red-100"
              >
                초대장 확인하기
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>

  {/* Global Style */ }
  <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom, 16px); }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(-5%); } 50% { transform: translateY(5%); } }
        .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
      `}</style>
    </div >
  );
}
