"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Sparkles,
  Calendar,
  Ticket,
  User,
  Image as ImageIcon,
  Music,
  Layout,
  Type,
  Palette,
  Send,
  ExternalLink,
  ChevronRight,
  Info
} from "lucide-react";
import NextImage from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "@/config";
import PCInvitationView from "@/components/PCInvitationView";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const steps = [
  { icon: "📐", title: "어떤 형태로\n만드시겠어요?", subtitle: "초대장의 기본 구조를 먼저 선택해주세요." },
  { icon: "✍️", title: "가장 멋진\n제목을 지어보세요", subtitle: "초대장의 첫인상을 결정하는 중요한 단계예요." },
  { icon: "📅", title: "언제\n만나면 좋을까요?", subtitle: "정확한 날짜와 시간을 알려주세요." },
  { icon: "📍", title: "어디서\n모일까요?", subtitle: "찾아오기 쉬운 장소 이름을 알려주세요." },
  { icon: "📸", title: "함께 나눈\n추억이 있나요?", subtitle: "사진을 올리면 더 특별한 초대장이 돼요." },
  { icon: "🎨", title: "나만의 색으로\n물들여보세요", subtitle: "분위기에 어울리는 테마를 골라보세요." },
  { icon: "🎫", title: "입장 티켓을\n발행해볼까요?", subtitle: "다양한 디자인의 티켓을 선택해보세요." },
  { icon: "✨", title: "특별한 효과를\n더해볼까요?", subtitle: "초대장을 더 돋보이게 하는 효과예요." },
  { icon: "💌", title: "진심을 담은\n초대 문구", subtitle: "초대하고 싶은 분들께 마음을 전해주세요." },
  { icon: "✨", title: "거의 다 됐어요!\n마지막으로 확인해주세요", subtitle: "수정이 필요하면 이전을 눌러주세요." }
];

const themes: Record<string, { name: string; bg: string; text: string; accent: string }> = {
  classic: { name: '클래식', bg: 'bg-white', text: 'text-gray-900', accent: 'border-gray-200' },
  vibrant: { name: '비비드', bg: 'bg-red-50', text: 'text-red-900', accent: 'border-red-200' },
  dark: { name: '다크', bg: 'bg-gray-900', text: 'text-white', accent: 'border-gray-800' },
  pastel: { name: '파스텔', bg: 'bg-blue-50', text: 'text-blue-900', accent: 'border-blue-200' },
  business: { name: '비즈니스', bg: 'bg-gray-100', text: 'text-gray-800', accent: 'border-gray-300' },
  nature: { name: '네이처', bg: 'bg-green-100', text: 'text-green-800', accent: 'border-green-300' },
};

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
    font_style: "sans",
    bgm: "none",
    text_effect: "none",
    default_layout: "standard"
  });

  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isNextDisabledValue, setIsNextDisabledValue] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdId, setCreatedId] = useState<number | null>(null);
  const [ticketTypes, setTicketTypes] = useState<any[]>([]);
  const [isPC, setIsPC] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Separate date/time state
  const [eventDateOnly, setEventDateOnly] = useState("");
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");
  const [showEndTime, setShowEndTime] = useState(false);

  // Auto-save state
  const [draftId, setDraftId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const checkPC = () => setIsPC(window.innerWidth >= 1024);
    checkPC();
    window.addEventListener('resize', checkPC);
    return () => window.removeEventListener('resize', checkPC);
  }, []);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/ticket_types`);
        const data = await res.json();
        setTicketTypes(data);
      } catch (e) {
        console.error("Failed to fetch ticket types:", e);
      }
    };
    fetchTickets();
  }, []);

  // Auto-save function
  const autoSave = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return; // Only auto-save for logged-in users

    // Only save if there's meaningful content
    if (!formData.title && !formData.description && !formData.sender_name) return;

    setIsSaving(true);

    try {
      const saveData = {
        ...formData,
        status: 'draft'
      };

      if (draftId) {
        // Update existing draft
        const response = await fetch(`${API_BASE_URL}/invitations/${draftId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ invitation: saveData })
        });

        if (response.ok) {
          setLastSaved(new Date());
        }
      } else {
        // Create new draft
        const response = await fetch(`${API_BASE_URL}/invitations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ invitation: saveData })
        });

        if (response.ok) {
          const data = await response.json();
          setDraftId(data.id);
          setCreatedId(data.id);
          setLastSaved(new Date());
        }
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [formData, draftId]);

  const handleManualSave = async () => {
    if (!formData.title && !formData.description) {
      alert("저장할 내용이 없습니다.");
      return;
    }
    await autoSave();
    alert("임시저장되었습니다.");
  };

  // Debounced auto-save on formData change
  useEffect(() => {
    const timer = setTimeout(() => {
      autoSave();
    }, 2000); // 2초 후 자동 저장

    return () => clearTimeout(timer);
  }, [formData, autoSave]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowPreview(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowPreview(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages(prev => [...prev, ...newImages]);
      const newUrls = newImages.map(img => URL.createObjectURL(img));
      setPreviewUrls(prev => [...prev, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(`invitation[${key}]`, value);
      });
      data.append('invitation[status]', 'published'); // Mark as published
      images.forEach(img => data.append("invitation[images][]", img));

      let res;
      if (draftId) {
        // Update existing draft to final
        res = await fetch(`${API_BASE_URL}/invitations/${draftId}`, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
          },
          body: data
        });
      } else {
        // Create new invitation
        res = await fetch(`${API_BASE_URL}/invitations`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
          },
          body: data
        });
      }

      if (res.ok) {
        const result = await res.json();
        setCreatedId(result.id);
        setShowSuccessModal(true);
      }
    } catch (e) {
      console.error("Creation failed:", e);
    }
  };

  const isNextDisabled = () => {
    switch (currentStep) {
      case 0: return !formData.default_layout;
      case 1: return !formData.title || !formData.sender_name;
      case 2: return !eventDateOnly || !startTime;
      case 3: return !formData.location;
      case 8: return !formData.description;
      default: return false;
    }
  };

  const selectedTheme = themes[formData.theme_color] || themes.classic;

  return (
    <div className={`h-screen bg-[#FDFBF7] flex flex-col lg:flex-row ${inter.className} overflow-hidden`}>
      {/* Left: Editor Area */}
      <div className={`flex flex-col bg-white border-r border-gray-100 z-50 shadow-xl transition-all h-screen ${isPC ? 'w-[450px]' : 'w-full'}`}>
        <div className="shrink-0 bg-white z-50">
          <header className="px-4 py-3 flex items-center h-14 justify-between">
            <button onClick={() => router.back()} className="text-gray-800 p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-3">
              {isSaving ? (
                <span className="text-xs font-bold text-blue-500 animate-pulse">저장 중...</span>
              ) : lastSaved ? (
                <span className="text-xs font-bold text-green-500">
                  {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 저장됨
                </span>
              ) : null}
            </div>
          </header>
          <div className="h-1 bg-gray-100 w-full overflow-hidden">
            <div
              className="h-full bg-[#E74C3C] transition-all duration-300 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-8 pt-10 pb-8">
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

          <div className="space-y-6">
            {currentStep === 0 && (
              <div className="grid grid-cols-1 gap-4">
                {['standard', 'minimal', 'modern'].map(layout => (
                  <button
                    key={layout}
                    onClick={() => setFormData({ ...formData, default_layout: layout })}
                    className={`p-6 rounded-3xl border-2 transition-all text-left flex items-start justify-between group ${formData.default_layout === layout ? 'border-[#E74C3C] bg-red-50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                  >
                    <div>
                      <p className={`font-bold text-lg mb-1 ${formData.default_layout === layout ? 'text-red-900' : 'text-gray-900'}`}>{layout.toUpperCase()}</p>
                      <p className="text-gray-500 text-sm">기본 {layout} 레이아웃으로 시작합니다.</p>
                    </div>
                    {formData.default_layout === layout && <CheckCircle2 className="text-[#E74C3C]" />}
                  </button>
                ))}
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">초대장 제목</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="제목을 입력하세요"
                    className="w-full p-5 bg-gray-50 text-gray-900 border-none rounded-2xl font-bold text-lg focus:ring-2 focus:ring-[#E74C3C] focus:bg-white transition-all outline-none"
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">보내는 사람</label>
                  <input
                    type="text"
                    value={formData.sender_name}
                    onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                    placeholder="성함 또는 닉네임"
                    className="w-full p-5 bg-gray-50 text-gray-900 border-none rounded-2xl font-bold text-lg focus:ring-2 focus:ring-[#E74C3C] focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">행사 날짜</label>
                  <input
                    type="date"
                    value={eventDateOnly}
                    onChange={(e) => {
                      setEventDateOnly(e.target.value);
                      if (e.target.value && startTime) {
                        setFormData({ ...formData, event_date: `${e.target.value}T${startTime}` });
                      }
                    }}
                    className="w-full p-5 bg-gray-50 text-gray-900 border-none rounded-2xl font-bold text-lg focus:ring-2 focus:ring-[#E74C3C] focus:bg-white transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">시작 시간</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                      if (eventDateOnly && e.target.value) {
                        setFormData({ ...formData, event_date: `${eventDateOnly}T${e.target.value}` });
                      }
                    }}
                    className="w-full p-5 bg-gray-50 text-gray-900 border-none rounded-2xl font-bold text-lg focus:ring-2 focus:ring-[#E74C3C] focus:bg-white transition-all outline-none"
                  />
                </div>
                {!showEndTime ? (
                  <button
                    onClick={() => setShowEndTime(true)}
                    className="text-[#E74C3C] text-sm font-bold hover:underline flex items-center gap-1"
                  >
                    + 종료 시간 추가하기
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">종료 시간</label>
                      <button
                        onClick={() => {
                          setShowEndTime(false);
                          setEndTime("");
                          setFormData({ ...formData, event_end_date: "" });
                        }}
                        className="text-gray-400 hover:text-gray-600 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => {
                        setEndTime(e.target.value);
                        if (eventDateOnly && e.target.value) {
                          setFormData({ ...formData, event_end_date: `${eventDateOnly}T${e.target.value}` });
                        }
                      }}
                      className="w-full p-5 bg-gray-50 text-gray-900 border-none rounded-2xl font-bold text-lg focus:ring-2 focus:ring-[#E74C3C] focus:bg-white transition-all outline-none"
                    />
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="예: 서울숲 야외공원"
                  className="w-full p-5 bg-gray-50 text-gray-900 border-none rounded-2xl font-bold text-lg focus:ring-2 focus:ring-[#E74C3C] focus:bg-white transition-all outline-none"
                />
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {previewUrls.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 group">
                      <NextImage src={url} alt="Upload Preview" fill className="object-cover" />
                      <button onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowLeft size={12} className="rotate-45" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-300 cursor-pointer hover:border-[#E74C3C] hover:text-[#E74C3C] transition-all">
                    <ImageIcon size={24} className="mb-2" />
                    <span className="text-[10px] font-bold">추가하기</span>
                    <input type="file" multiple className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(themes).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => setFormData({ ...formData, theme_color: key })}
                    className={`p-4 rounded-2xl border-2 transition-all ${formData.theme_color === key ? 'border-[#E74C3C] bg-white' : 'border-gray-50 bg-gray-50'}`}
                  >
                    <div className={`w-full h-12 rounded-lg mb-2 ${theme.bg} ${theme.accent} border`} />
                    <span className="text-xs font-bold text-gray-900">{theme.name}</span>
                  </button>
                ))}
              </div>
            )}


            {currentStep === 6 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <Ticket size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">프리미엄 기능</h3>
                <p className="text-gray-500 text-base leading-relaxed mb-6">
                  입장 티켓 발행 기능은<br />
                  곧 만나보실 수 있어요!
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <Sparkles size={14} /> Coming Soon
                </div>
              </div>
            )}

            {currentStep === 7 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <Sparkles size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">프리미엄 기능</h3>
                <p className="text-gray-500 text-base leading-relaxed mb-6">
                  특별한 효과 기능은<br />
                  곧 만나보실 수 있어요!
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <Sparkles size={14} /> Coming Soon
                </div>
              </div>
            )}
            {currentStep === 8 && (
              <div className="space-y-4">
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="따뜻한 인사말을 나누어보세요."
                  className="w-full p-6 bg-gray-50 text-gray-900 border-none rounded-2xl h-60 font-medium text-lg focus:ring-2 focus:ring-[#E74C3C] focus:bg-white transition-all outline-none leading-relaxed"
                />
              </div>
            )}

            {currentStep === 9 && (
              <div className="space-y-4 pb-10">
                {!isPC && (
                  <div className="flex gap-2 mb-6">
                    <button onClick={() => setShowPreview(false)} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${!showPreview ? 'bg-[#E74C3C] text-white shadow-lg' : 'bg-gray-100 text-gray-500'}`}>✏️ 수정</button>
                    <button onClick={() => setShowPreview(true)} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${showPreview ? 'bg-[#E74C3C] text-white shadow-lg' : 'bg-gray-100 text-gray-500'}`}>👁️ 미리보기</button>
                  </div>
                )}
                {(!showPreview || isPC) && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">마지막 확인</h3>
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-3">
                      <div className="flex justify-between items-center"><span className="text-gray-500 text-sm">제목:</span><span className="font-bold">{formData.title}</span></div>
                      <div className="flex justify-between items-center"><span className="text-gray-500 text-sm">장소:</span><span className="font-bold">{formData.location}</span></div>
                      <div className="flex justify-between items-center"><span className="text-gray-500 text-sm">일시:</span><span className="font-bold">{formData.event_date ? new Date(formData.event_date).toLocaleString() : '미정'}</span></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

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
              onClick={handleManualSave}
              className="px-4 py-4 bg-white border-2 border-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 hover:border-gray-200 transition-colors"
            >
              임시저장
            </button>
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

      {/* Right: Preview Area */}
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
              onRSVP={async () => { }}
              hasResponded={false}
              myTicket={null}
              styleMode="embedded"
            />
          </div>
        </div>
      ) : isPC && (
        <div className="flex-1 bg-[#1a1a1a] flex flex-col items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-500/10 blur-[150px] rounded-full" />
          <div className="relative w-full max-w-[380px] h-[780px] rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-[12px] border-[#333] z-10 scale-[0.9] xl:scale-100 transition-transform">
            <div className="absolute inset-0 bg-white overflow-y-auto no-scrollbar">
              <div className="relative w-full">
                {previewUrls.length > 0 ? (
                  <img src={previewUrls[0]} alt="Preview" className="w-full h-auto object-contain" />
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
                <h1 className={`text-3xl font-bold mb-4 leading-tight break-keep text-gray-900 ${formData.font_style === 'serif' ? 'font-serif' : ''} ${formData.text_effect === 'gold' ? 'text-yellow-600' : formData.text_effect === 'silver' ? 'text-gray-400' : ''}`}>
                  {formData.title || "초대장 제목"}
                </h1>
                <div className="w-10 h-1 bg-gray-100 mb-6 rounded-full" />
                <p className={`text-lg text-gray-700 font-medium mb-10 whitespace-pre-wrap leading-relaxed ${formData.font_style === 'serif' ? 'font-serif' : ''}`}>
                  {formData.description || "초대 문구가 여기에 표시됩니다.\n아직 작성된 내용이 없습니다."}
                </p>
                <div className="space-y-4 border-t border-gray-100 pt-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500"><Calendar size={18} /></div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-600">Date & Time</p>
                      <p className="font-bold text-base text-gray-900">
                        {formData.event_date ? new Date(formData.event_date).toLocaleString() : "일시 미정"}
                        {formData.event_end_date && <span className="text-gray-400"> ~ {new Date(formData.event_end_date).toLocaleString()}</span>}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] z-10">Wayo Pro Creator Studio</div>
          </div>
        </div>
      )}

      {/* Success Modal */}
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
                <div className="space-y-3">
                  <button onClick={() => router.push(`/invitations/${createdId}`)} className="w-full py-4 bg-[#E74C3C] text-white rounded-2xl font-bold text-lg hover:bg-[#c0392b] transition-colors">초대장 확인</button>
                  <button onClick={() => setShowSuccessModal(false)} className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-colors">닫기</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom, 16px); }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(-5%); } 50% { transform: translateY(5%); } }
        .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
      `}</style>
    </div>
  );
}
