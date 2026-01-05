"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import {
  Calendar,
  MapPin,
  CheckCircle2,
  Share2,
  ArrowRight,
  Megaphone,
  CalendarPlus
} from "lucide-react";
import React from "react";
import PCInvitationView from "@/components/PCInvitationView";

const themes: Record<string, { bg: string, text: string, button: string, accent: string }> = {
  classic: { bg: 'bg-[#2C3E50]', text: 'text-white', button: 'bg-[#E0F7FA] text-[#2C3E50]', accent: 'bg-white/10' },
  romance: { bg: 'bg-pink-50', text: 'text-pink-900', button: 'bg-pink-500 text-white', accent: 'bg-pink-200/50' },
  party: { bg: 'bg-purple-900', text: 'text-purple-100', button: 'bg-yellow-400 text-purple-900', accent: 'bg-purple-800' },
  nature: { bg: 'bg-emerald-50', text: 'text-emerald-900', button: 'bg-emerald-600 text-white', accent: 'bg-emerald-200/50' },
  business: { bg: 'bg-gray-50', text: 'text-gray-900', button: 'bg-black text-white', accent: 'bg-gray-200' },
};

export default function InvitationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  const [invitation, setInvitation] = useState<any>(null);

  // Stages: 'envelope' -> 'notification' -> 'opening' -> 'content'
  const [stage, setStage] = useState<'envelope' | 'notification' | 'opening' | 'content'>('envelope');
  const [loading, setLoading] = useState(true);

  // RSVP Form
  const [guestName, setGuestName] = useState("");
  const [message, setMessage] = useState("");
  const [hasResponded, setHasResponded] = useState(false);

  // User Type (Simple check for now, can be improved)
  const [isCreator, setIsCreator] = useState(false);
  const [myTicket, setMyTicket] = useState<any>(null); // Ticket Info
  const [isPC, setIsPC] = useState(false);

  useEffect(() => {
    const checkPC = () => {
      setIsPC(window.innerWidth >= 1024);
    };
    checkPC();
    window.addEventListener("resize", checkPC);
    return () => window.removeEventListener("resize", checkPC);
  }, []);

  useEffect(() => {
    fetchInvitation();
    checkOwnership();
    fetchGuests(); // To check if I already RSVP'd
  }, [id]);

  const checkOwnership = () => {
    // In a real app, compare current user ID with invitation.user_id
    // For now, we simulate "If I just made it, I'm the creator" via pending_invitations check or simplified logic
    const pending = JSON.parse(localStorage.getItem("pending_invitations") || "[]");
    if (pending.includes(Number(id))) {
      setIsCreator(true);
    }
  };

  const fetchInvitation = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/invitations/${id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.ok) {
        setInvitation(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch invitation", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuests = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/invitations/${id}/guests`);
      if (res.ok) {
        const guests = await res.json();

        let me = null;

        // 1. Strict Match: If Logged In, find guest by User ID
        const myUserId = localStorage.getItem("userId");
        if (myUserId) {
          me = guests.find((g: any) => g.user_id === Number(myUserId));
        }

        // 2. Fallback: If Not Found (Guest Mode), find by LocalStorage Guest ID
        if (!me) {
          const myGuestId = localStorage.getItem(`wayo_guest_${id}`);
          if (myGuestId) {
            me = guests.find((g: any) => g.id === Number(myGuestId));
          }
        }

        if (me) {
          setHasResponded(true);
          setGuestName(me.name);
          if (me.ticket) {
            setMyTicket(me.ticket);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  // BGM Resources (Free copyright-free placeholders)
  const bgmSources = {
    classic: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3', // Piano
    jazz: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3', // Smooth Jazz
    acoustic: 'https://cdn.pixabay.com/audio/2022/09/02/audio_72502a492a.mp3', // Acoustic
    none: ''
  };

  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleOpen = () => {
    // Play Audio if exists
    if (invitation.bgm && invitation.bgm !== 'none' && audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.log("Auto-play prevented", e));
      setIsPlaying(true);
    }

    setStage('notification');
    setTimeout(() => {
      setStage('opening');
      setTimeout(() => setStage('content'), 1500);
    }, 2000);
  };

  const handleRSVP = async () => {
    if (!guestName) {
      alert("이름을 입력해주세요!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3401/invitations/${id}/guests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          guest: {
            name: guestName,
            message: message,
            status: 'attending'
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        setHasResponded(true);
        localStorage.setItem(`wayo_guest_${id}`, String(data.id));
        if (data.ticket) {
          setMyTicket(data.ticket);
        }
      } else {
        alert("처리에 실패했습니다.");
      }
    } catch (error) {
      console.error("RSVP failed", error);
    }
  };

  const addToCalendar = () => {
    alert("가보자고 캘린더에 일정이 등록되었습니다!");
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("초대장 링크가 복사되었습니다! 💌");
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert("링크 복사에 실패했습니다.");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">Loading...</div>;
  if (!invitation) return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">Invitation not found</div>;

  const theme = themes[invitation.theme_color] || themes.classic;
  const fontClass = invitation.font_style === 'serif' ? 'font-serif' : invitation.font_style === 'hand' ? 'font-cursive' : 'font-sans';
  const effectClass = invitation.text_effect === 'gold' ? 'text-yellow-600 drop-shadow-sm' : invitation.text_effect === 'silver' ? 'text-gray-400 drop-shadow-sm' : '';

  // Audio Element
  const AudioComponent = () => (
    invitation.bgm && invitation.bgm !== 'none' ? (
      <audio ref={audioRef} src={bgmSources[invitation.bgm as keyof typeof bgmSources]} loop />
    ) : null
  );

  const handleRSVP_PC = async (name: string, msg: string) => {
    // Sync to local state if needed, but mainly we call the same logic
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/invitations/${id}/guests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          guest: {
            name: name,
            message: msg,
            status: 'attending'
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        setHasResponded(true);
        localStorage.setItem(`wayo_guest_${id}`, String(data.id));
        if (data.ticket) {
          setMyTicket(data.ticket);
        }
      } else {
        alert("처리에 실패했습니다.");
      }
    } catch (error) {
      console.error("RSVP failed", error);
    }
  };

  if (isPC) {
    return (
      <PCInvitationView
        invitation={invitation}
        onRSVP={handleRSVP_PC}
        hasResponded={hasResponded}
        myTicket={myTicket}
      />
    );
  }

  if (stage === 'envelope') {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
        <AudioComponent />

        {/* Envelope */}
        <div className="relative w-80 h-64 animate-in slide-in-from-bottom duration-1000">
          <NextImage
            src="/images/wayo_envelope_3d.jpg"
            alt="Invitation Envelope"
            fill
            className="object-contain mix-blend-multiply drop-shadow-2xl"
          />

          {/* Wax Seal Button */}
          <button
            onClick={handleOpen}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-red-800 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3)] flex items-center justify-center border-4 border-red-900/50 hover:scale-110 active:scale-95 transition-all z-10 group"
          >
            <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center">
              <span className="font-serif text-white/90 text-xs font-bold tracking-widest group-hover:animate-pulse">OPEN</span>
            </div>
          </button>
        </div>

        <p className="mt-12 text-[#8D6E63] text-xs font-serif tracking-[0.3em] uppercase opacity-60 animate-bounce-slow">
          초대장을 확인해주세요
        </p>
      </div>
    );
  }

  if (stage === 'notification') {
    return (
      <div className="min-h-screen bg-black/90 flex items-center justify-center p-6 text-center animate-in fade-in duration-700 relative z-50">
        <AudioComponent />
        <div className="text-white space-y-6 animate-in slide-in-from-bottom-10 duration-1000">
          <p className="text-sm tracking-[0.2em] text-white/50 mb-2">INVITATION</p>
          <h2 className={`text-2xl font-bold leading-relaxed ${fontClass} ${effectClass}`}>
            {invitation.title}
          </h2>
          <div className="w-px h-10 bg-white/20 mx-auto my-4"></div>
          <p className="text-white/80 font-light tracking-wide text-sm">
            소중한 당신을 초대합니다
          </p>
        </div>
      </div>
    )
  }

  // OPENING & CONTENT View
  return (
    <div className={`min-h-screen transition-colors duration-1000 relative ${stage === 'opening' ? 'bg-black' : 'bg-[#FAFAFA]'}`}>
      <AudioComponent />

      {/* Floating Music Toggle */}
      {invitation.bgm && invitation.bgm !== 'none' && stage === 'content' && (
        <button
          onClick={toggleMusic}
          className="fixed top-6 right-6 z-100 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg text-gray-600 hover:text-green-600 transition-all active:scale-90"
        >
          {isPlaying ? (
            <div className="relative">
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping" />
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
            </div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
          )}
        </button>
      )}

      {/* Opening Animation Overlay */}
      {stage === 'opening' && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#FDFBF7] animate-out fade-out duration-1000 delay-500 fill-mode-forwards pointer-events-none">
          <NextImage src="/images/wayo_envelope_3d.jpg" alt="Opening" width={300} height={300} className="animate-ping opacity-20 duration-[2s]" />
        </div>
      )}

      {/* Main Content */}
      <div className={`max-w-md mx-auto min-h-screen shadow-2xl overflow-hidden bg-white animate-in slide-in-from-bottom-20 duration-1000 ${stage === 'content' ? 'opacity-100' : 'opacity-0'}`}>

        {/* Poster / Cover Area */}
        <div className="relative h-[600px] bg-gray-50 flex items-center justify-center overflow-hidden">
          {/* Mock Poster if no image */}
          {invitation.cover_image_url ? (
            <NextImage src={invitation.cover_image_url} alt="Cover" fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 bg-[#F5F5F0] p-10 flex flex-col items-center justify-center text-center border-12 border-white inner-border">
              <p className="font-serif text-[#8D6E63] text-sm tracking-[0.5em] mb-6">INVITATION</p>
              <h1 className={`text-4xl text-[#3E2723] leading-tight mb-8 font-bold ${effectClass} ${fontClass}`}>{invitation.title}</h1>
              <div className="w-px h-16 bg-[#D7CCC8] mb-8"></div>
              <p className={`text-lg text-[#5D4037] ${fontClass}`}>
                {new Date(invitation.event_date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}
              </p>
              <p className={`text-[#8D6E63] text-sm mt-3 ${fontClass}`}>{invitation.location}</p>
            </div>
          )}

          {/* Scroll Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-1 opacity-60">
            <span className="text-[10px] uppercase tracking-widest text-[#5D4037]">Scroll</span>
            <ArrowRight className="rotate-90 text-[#5D4037]" size={16} />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 pb-32 bg-white relative -mt-6 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10">
          <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-10"></div>

          <div className={`prose prose-stone mx-auto text-center leading-loose text-gray-600 mb-14 whitespace-pre-wrap ${fontClass}`}>
            {invitation.description}
          </div>

          <div className="space-y-8">
            {/* Info Section */}
            <div className="border-y border-gray-100 py-10 space-y-8">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-1">
                  <Calendar size={20} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</p>
                  <p className="font-bold text-gray-900 text-xl">
                    {new Date(invitation.event_date).toLocaleString('ko-KR')}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-1">
                  <MapPin size={20} />
                </div>
                <div className="text-center w-full">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location</p>
                  <p className="font-bold text-gray-900 text-xl break-keep px-4">
                    {invitation.location}
                  </p>
                  {/* Map Link Button (Optional) */}
                  <button className="mt-2 text-xs text-blue-500 underline underline-offset-4">지도 보기</button>
                </div>
              </div>
            </div>

            {/* ... Buttons ... */}

            {/* Share Button (All Users) */}
            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
              >
                <Share2 size={20} /> 링크 공유하기
              </button>
            </div>

            {/* Action Buttons based on Role */}
            {isCreator ? (
              <button
                onClick={() => router.push('/')}
                className="w-full py-4 bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-200"
              >
                <Megaphone size={20} /> 내 행사 가보자고에 홍보하기
              </button>
            ) : (
              <button
                onClick={addToCalendar}
                className="w-full py-4 bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
              >
                <CalendarPlus size={20} /> 가보자고 캘린더에 일정 등록
              </button>
            )}

            {/* RSVP Section */}
            <div className="bg-[#FAFAFA] rounded-2xl p-6">
              {!hasResponded ? (
                <div className="space-y-4">
                  <h3 className="text-center font-bold text-gray-900 mb-2">참석 여부를 알려주세요</h3>
                  <input
                    type="text"
                    placeholder="성함"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-gray-900 outline-none transition-colors text-center font-serif"
                  />
                  <textarea
                    placeholder="전하고 싶은 말씀 (선택)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-gray-900 outline-none transition-colors h-24 resize-none text-center font-serif text-sm"
                  />
                  <button
                    onClick={handleRSVP}
                    className="w-full py-4 bg-black text-white font-bold rounded-xl active:scale-95 transition-all"
                  >
                    참석 확인
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-2">* 일정 변경 시 다시 메시지를 남길 수 있습니다.</p>
                </div>
              ) : (
                <div className="text-center py-6 animate-in zoom-in">
                  <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
                  <p className="font-bold text-gray-900 text-lg">참석이 확인되었습니다!</p>
                  <p className="text-gray-500 mt-2 text-sm mb-6">소중한 발걸음 기다리겠습니다.</p>

                  {/* Ticket / QR Code Section */}
                  {myTicket && (
                    <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-xl max-w-xs mx-auto transform hover:scale-105 transition-transform">
                      <div className="text-xl font-black text-gray-900 mb-2 border-b-2 border-dashed border-gray-200 pb-2">
                        GABOJAGO TICKET
                      </div>
                      <div className="bg-gray-100 p-2 rounded-lg mb-4">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${myTicket.qr_code}`}
                          alt="QR Code"
                          className="w-full aspect-square"
                        />
                      </div>
                      <p className="text-xs font-mono text-gray-400 break-all">{myTicket.qr_code}</p>
                      <p className="text-sm font-bold text-blue-600 mt-2">입장 시 이 코드를 보여주세요!</p>
                    </div>
                  )}

                  {!myTicket && (
                    <button className="text-xs text-gray-400 underline mt-4 hover:text-gray-600">
                      내 일정 확인 및 가입하기 (Kakao)
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
