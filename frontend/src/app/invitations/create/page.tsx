"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Sparkles
} from "lucide-react";
import NextImage from "next/image";
import DaumPostcodeEmbed from 'react-daum-postcode';
import { motion, AnimatePresence } from "framer-motion";
import PCInvitationView from "@/components/PCInvitationView";

const themes: Record<string, { name: string, bg: string, text: string, accent: string }> = {
  classic: { name: '클래식', bg: 'bg-[#2C3E50]', text: 'text-white', accent: 'border-gold-500' },
  romance: { name: '로맨틱', bg: 'bg-pink-100', text: 'text-pink-900', accent: 'border-pink-300' },
  party: { name: '파티', bg: 'bg-purple-600', text: 'text-white', accent: 'border-purple-300' },
  business: { name: '비즈니스', bg: 'bg-gray-100', text: 'text-gray-800', accent: 'border-gray-300' },
  nature: { name: '네이처', bg: 'bg-green-100', text: 'text-green-800', accent: 'border-green-300' },
};

const steps = [
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
    event_date: "",
    location: "",
    theme_color: "classic",
    cover_image_url: "",
    font_style: 'serif',
    bgm: 'none',
    text_effect: 'none',
    ticket_type_id: null as number | null
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [ticketTypes, setTicketTypes] = useState<any[]>([]);
  const [isPC, setIsPC] = useState(false);

  useEffect(() => {
    const checkPC = () => setIsPC(window.innerWidth >= 1024);
    checkPC();
    window.addEventListener('resize', checkPC);
    return () => window.removeEventListener('resize', checkPC);
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/ticket_types`)
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/invitations`, {
        method: "POST",
        headers: {
          "Authorization": localStorage.getItem("authToken") || ""
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        const token = localStorage.getItem("authToken");
        if (!token) {
          const pending = JSON.parse(localStorage.getItem("pending_invitations") || "[]");
          if (!pending.includes(data.id)) {
            pending.push(data.id);
            localStorage.setItem("pending_invitations", JSON.stringify(pending));
          }
          alert("초대장이 임시 저장되었습니다.\n로그인하면 영구 보관할 수 있습니다.");
        } else {
          alert("초대장이 생성되었습니다!");
        }

        router.push(`/invitations/${data.id}`);
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
      case 0: return !formData.title;
      case 1: return !formData.event_date;
      case 2: return !formData.location;
      case 7: return !formData.description;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Header & Progress */}
      <div className={`sticky top-0 bg-white z-50 transition-all ${isPC ? 'w-[450px] border-r border-gray-100' : 'w-full'}`}>
        <header className="px-4 py-3 flex items-center h-14">
          <button onClick={() => router.back()} className="text-gray-800 p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
        </header>
        <div className="h-1 bg-gray-100 w-full">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className={`flex-1 flex flex-col px-6 pt-8 pb-32 w-full overflow-y-auto ${isPC ? 'max-w-[450px] border-r border-gray-100 bg-gray-50/30' : 'max-w-md mx-auto'}`}>
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

        {/* Step 1: Title */}
        {currentStep === 0 && (
          <div className="animate-in slide-in-from-right fade-in duration-500 delay-100">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="예) 15분도시 부산 워크숍"
              className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-2xl text-gray-900 placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
              autoFocus
            />
          </div>
        )}

        {/* Step 2: Date & Time */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in slide-in-from-right fade-in duration-500 delay-100">
            <div className="p-5 bg-gray-50 rounded-2xl border border-transparent focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <label className="block text-sm font-bold text-gray-500 mb-2">날짜</label>
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
            <div className="p-5 bg-gray-50 rounded-2xl border border-transparent focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <label className="block text-sm font-bold text-gray-500 mb-2">시간</label>
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
          </div>
        )}

        {/* Step 3: Location */}
        {currentStep === 2 && (
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
                  className="w-full pl-14 pr-4 py-5 bg-gray-50 border-none rounded-2xl font-bold text-xl text-gray-900 placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                  autoFocus
                />
              </div>

              {/* Address Display & Search Button */}
              {roadAddress ? (
                <div className="p-4 bg-blue-50 rounded-2xl flex items-center justify-between group cursor-pointer" onClick={() => setIsAddressOpen(true)}>
                  <div className="flex items-center gap-2 text-blue-600">
                    <span className="text-xs font-bold bg-blue-200 px-2 py-1 rounded-md">도로명</span>
                    <span className="font-medium text-sm">{roadAddress}</span>
                  </div>
                  <span className="text-blue-400 text-xs">수정</span>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddressOpen(true)}
                  className="text-gray-500 text-sm font-medium underline underline-offset-4 hover:text-blue-500 transition-colors ml-4"
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

        {/* Step 4: Image Upload */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right fade-in duration-500 delay-100">
            <div className="grid grid-cols-2 gap-4">
              <div
                className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all active:scale-95"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-2">
                  <Sparkles className="text-blue-500" size={20} />
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

        {/* Step 5: Theme */}
        {currentStep === 4 && (
          <div className="animate-in slide-in-from-right fade-in duration-500 delay-100 pb-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(themes).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setFormData({ ...formData, theme_color: key })}
                  className={`p-4 rounded-3xl border-2 transition-all duration-300 text-left relative overflow-hidden group ${formData.theme_color === key ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100" : "border-gray-100 bg-white hover:border-gray-200"
                    }`}
                >
                  <div className={`w-12 h-12 rounded-2xl mb-4 ${value.bg} flex items-center justify-center shadow-inner`}>
                    <Sparkles className={`${value.text.replace('text-', 'text-opacity-70 text-')}`} size={20} />
                  </div>
                  <p className="font-bold text-gray-900 text-lg mb-1">{value.name}</p>
                  {formData.theme_color === key && (
                    <div className="absolute top-4 right-4 text-blue-500 animate-in zoom-in">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Ticket Selection (NEW) */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in slide-in-from-right fade-in duration-500 delay-100">
            <p className="text-gray-500 mb-4 font-medium">초대장을 받는 분들에게 나누어 줄 티켓을 선택해주세요.<br />(선택하지 않아도 됩니다)</p>

            <button
              onClick={() => setFormData({ ...formData, ticket_type_id: null })}
              className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${!formData.ticket_type_id
                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                : "border-gray-100 bg-white hover:border-gray-200"
                }`}
            >
              <span className="font-bold text-gray-700">선택 안함</span>
              {!formData.ticket_type_id && <Sparkles className="text-blue-500" size={20} />}
            </button>

            {ticketTypes.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => setFormData({ ...formData, ticket_type_id: ticket.id })}
                className={`w-full p-5 rounded-2xl border-2 transition-all text-left group ${formData.ticket_type_id === ticket.id
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                  : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-lg text-gray-900">{ticket.name}</span>
                  <span className="font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-xs">
                    {ticket.price === 0 ? "FREE" : `₩${ticket.price.toLocaleString()}`}
                  </span>
                </div>
                <div className="text-xs text-gray-500 flex gap-2">
                  <span>재고: {ticket.quantity}개</span>
                  <span>•</span>
                  <span>{ticket.event?.title || "이벤트"}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 6: Detail Decoration (Font, Effect, BGM) */}
        {currentStep === 6 && (
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
                      ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500"
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

        {/* Step 7: Description */}
        {currentStep === 7 && (
          <div className="animate-in slide-in-from-right fade-in duration-500 delay-100">
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="따뜻한 인사말을 건네보세요."
              className="w-full p-6 bg-gray-50 border-none rounded-3xl h-80 resize-none font-medium text-xl text-gray-900 placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none leading-relaxed"
              autoFocus
            />
          </div>
        )}

        {/* Step 8: Final Preview */}
        {currentStep === 8 && (
          <div className="flex flex-col items-center animate-in slide-in-from-right fade-in duration-500 delay-100 pb-10">
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

      {/* Fixed Bottom Action Bar */}
      <div className={`fixed bottom-0 left-0 p-4 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-50 safe-area-bottom transition-all ${isPC ? 'w-[450px]' : 'w-full mx-auto max-w-md right-0'}`}>
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
            className="flex-1 py-4 bg-blue-500 text-white text-lg rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none transition-all active:scale-95"
          >
            {currentStep < steps.length - 1 ? "다음" : "초대장 완성하기"}
          </button>
        </div>
      </div>

      {/* PC Side Preview */}
      {isPC && (
        <div className="fixed top-0 right-0 bottom-0 left-[450px] bg-[#1a1a1a] flex items-center justify-center p-20 z-0">
          <div className="relative w-full h-full max-w-4xl max-h-[800px] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-8 border-[#333]">
            {/* Mocking the PCInvitationView for live preview */}
            <div className="absolute inset-0 bg-white overflow-y-auto no-scrollbar">
              <div className="relative h-[400px]">
                {previewUrls.length > 0 ? (
                  <NextImage src={previewUrls[0]} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-300">
                    이미지를 추가해 주세요
                  </div>
                )}
              </div>
              <div className="p-12">
                <h1 className={`text-4xl font-bold mb-6 ${formData.font_style === 'serif' ? 'font-serif' : ''} ${formData.text_effect === 'gold' ? 'text-yellow-600' : formData.text_effect === 'silver' ? 'text-gray-400' : ''
                  }`}>
                  {formData.title || "초대장 제목"}
                </h1>
                <p className={`text-xl opacity-70 mb-12 whitespace-pre-wrap ${formData.font_style === 'serif' ? 'font-serif' : ''}`}>
                  {formData.description || "초대 문구가 여기에 표시됩니다."}
                </p>
                <div className="grid grid-cols-2 gap-8 border-t pt-10">
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Date</p>
                    <p className="font-bold">{formData.event_date ? new Date(formData.event_date).toLocaleString() : "일시 미정"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Location</p>
                    <p className="font-bold">{formData.location || "장소 미정"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Label */}
          <div className="absolute top-10 right-10 flex items-center gap-3 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20 text-white/60 text-sm font-bold">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
            LIVE PREVIEW
          </div>
        </div>
      )}

      {/* Global CSS for animations if needed inline, though tailwind plugins handle most */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom, 16px);
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(5%); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
