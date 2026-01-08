"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NextImage from "next/image";
import {
    Calendar,
    MapPin,
    CheckCircle2,
    Share2,
    ArrowDown,
    ArrowRight,
    Volume2,
    VolumeX,
    X,
    ArrowLeft
} from "lucide-react";

invitation: any;
onRSVP: (name: string, message: string, status?: string) => Promise<void>;
hasResponded: boolean;
myTicket: any;
styleMode ?: 'fullscreen' | 'embedded';
}

export default function PCInvitationView({ invitation, onRSVP, hasResponded, myTicket, styleMode = 'fullscreen' }: PCInvitationViewProps) {
    const [stage, setStage] = useState<'intro' | 'envelope' | 'opening' | 'content'>('intro');
    const [isMuted, setIsMuted] = useState(true);
    const [showAudioTooltip, setShowAudioTooltip] = useState(false);
    const [guestName, setGuestName] = useState("");
    const [rsvpMessage, setRsvpMessage] = useState("");
    const [showRsvpModal, setShowRsvpModal] = useState(false);
    const [showGuidanceModal, setShowGuidanceModal] = useState(false);
    const [activeSection, setActiveSection] = useState<'message' | 'schedule' | 'map'>('message');
    const [layoutMode, setLayoutMode] = useState<'single' | 'spread' | 'leaflet'>(invitation.default_layout || 'spread');
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const fontClass = invitation.font_style === 'serif' ? 'font-serif' : 'font-sans';
    const hostName = invitation.sender_name || invitation.user?.nickname || "가보자고 친구";

    const handleStart = () => {
        setStage('envelope');
        // Start background music subtly if possible
        if (invitation.bgm && invitation.bgm !== 'none' && audioRef.current) {
            audioRef.current.play().catch(e => console.log("Audio play blocked", e));
            // Show tooltip for 5 seconds after start to inform about music
            setShowAudioTooltip(true);
            setTimeout(() => setShowAudioTooltip(false), 5000);
        }
    };

    const handleOpen = () => {
        setStage('opening');
        setTimeout(() => {
            setStage('content');
        }, 2200);
    };

    const bgmSources: Record<string, string> = {
        classic: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3',
        jazz: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3',
        acoustic: 'https://cdn.pixabay.com/audio/2022/09/02/audio_72502a492a.mp3',
    };

    return (
        <div className={`${styleMode === 'fullscreen' ? 'fixed inset-0' : 'relative w-full h-full rounded-3xl overflow-hidden'} bg-[#1a1a1a] flex items-center justify-center ${fontClass}`}>
            {/* Background Ambience */}
            <div className="absolute inset-0 z-0">
                <NextImage
                    src={invitation.cover_image_url || "/images/wayo_envelope_3d.png"}
                    alt="Ambience"
                    fill
                    className="object-cover opacity-10 blur-xl scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
            </div>

            <AnimatePresence mode="wait">
                {stage === 'intro' && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className={`${styleMode === 'fullscreen' ? 'fixed inset-0' : 'absolute inset-0'} z-[100] bg-black flex flex-col items-center justify-center text-center p-6`}
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="space-y-8"
                        >
                            <p className="text-white/40 text-sm tracking-[0.5em] uppercase font-light">New Message</p>
                            <h2 className="text-white text-4xl md:text-5xl font-black leading-tight break-keep">
                                {hostName}님으로부터<br />소중한 초대장이 도착했습니다
                            </h2>
                            <div className="w-12 h-px bg-white/20 mx-auto" />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleStart}
                                className="px-12 py-5 bg-white text-black rounded-full font-black text-xl hover:bg-white/90 transition-all shadow-2xl"
                            >
                                확인하기
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}

                {stage === 'envelope' && (
                    <motion.div
                        key="envelope"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2, y: 50 }}
                        className="z-10 relative group cursor-pointer"
                        onClick={handleOpen}
                    >
                        <div className="relative w-[500px] h-[350px]">
                            {/* Envelope Back */}
                            <NextImage
                                src="/images/wayo_envelope_3d.png"
                                alt="Envelope"
                                fill
                                className="object-contain drop-shadow-[0_50px_100px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
                            />

                            {/* Wax Seal */}
                            <motion.div
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#C0392B] rounded-full border-4 border-[#922B21] shadow-2xl flex items-center justify-center z-20"
                            >
                                <div className="text-white text-[10px] font-black tracking-widest uppercase">Open</div>
                            </motion.div>

                            <div className="absolute bottom-10 left-0 right-0 text-center">
                                <p className="text-white/40 text-[10px] uppercase tracking-[0.5em] animate-pulse">봉투를 눌러 열어보세요</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {stage === 'opening' && (
                    <motion.div
                        key="opening"
                        className="z-50 flex flex-col items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Physical Envelope Opening Simulation */}
                        <div className="relative w-[500px] h-[350px]">
                            <motion.div
                                initial={{ y: 0 }}
                                animate={{ y: -200, opacity: 0 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className="absolute inset-0 z-20"
                            >
                                <NextImage src="/images/wayo_envelope_3d.png" alt="Opening" fill className="object-contain mix-blend-multiply" />
                            </motion.div>

                            <motion.div
                                initial={{ y: 50, opacity: 0, scale: 0.5 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                                className="bg-white p-12 rounded-3xl shadow-2xl text-center w-full"
                            >
                                <p className="text-gray-400 text-xs tracking-widest mb-4">INVITATION</p>
                                <h2 className="text-4xl font-black text-gray-900 leading-tight">
                                    {invitation.title}
                                </h2>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {stage === 'content' && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="z-10 w-full h-full flex flex-col items-center justify-center p-12"
                    >
                        {/* Layout Selector UI - REMOVED per user request */}

                        {/* Layout: SINGLE (Poster Only Style) */}
                        {layoutMode === 'single' && (
                            <div className="w-full max-w-[600px] bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col max-h-[90vh]">
                                <div className="relative w-full overflow-hidden bg-gray-100">
                                    <img
                                        src={invitation.image_urls?.[0] || invitation.cover_image_url || "/images/wayo_envelope_3d.jpg"}
                                        alt="Cover"
                                        className="w-full h-auto object-contain max-h-[60vh] mx-auto"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                                    <div className="absolute bottom-6 left-8 right-8 text-white pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
                                        <p className="text-[10px] font-black tracking-[0.5em] opacity-80 mb-2">OFFICIAL INVITATION</p>
                                        <h3 className="text-4xl font-black leading-tight break-keep shadow-black drop-shadow-lg">{invitation.title}</h3>
                                    </div>
                                </div>
                                <div className="flex-1 p-12 overflow-y-auto custom-scrollbar flex flex-col gap-8">
                                    <p className="text-2xl font-light text-gray-500 leading-relaxed whitespace-pre-wrap">
                                        {invitation.description}
                                    </p>
                                    <div className="mt-auto pt-8">
                                        <p className="text-center text-[10px] text-gray-300 uppercase tracking-widest font-light">
                                            Official Invitation
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Layout: SPREAD (Current 2p Book Style) */}
                        {layoutMode === 'spread' && (
                            <div className="w-full max-w-[1200px] h-[750px] flex items-stretch bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden relative">
                                {/* Left Page: Poster (Clean Image Only) */}
                                <div className="flex-1 relative overflow-hidden border-r border-gray-100 bg-gray-50 flex items-center justify-center">
                                    <img
                                        src={invitation.image_urls?.[0] || invitation.cover_image_url || "/images/wayo_envelope_3d.jpg"}
                                        alt="Cover"
                                        className="w-full h-full object-contain p-4"
                                    />
                                    {/* Text Overlay Removed per user request to avoid overlapping with image text/subtitles */}
                                </div>

                                {/* Right Page: Content */}
                                <div className="flex-1 bg-white flex flex-col relative">
                                    <div className="px-12 pt-8 flex gap-6 border-b border-gray-50 bg-white/80 backdrop-blur-md sticky top-0 z-20">
                                        {(['message', 'schedule', 'map'] as const).map((id) => (
                                            <button
                                                key={id}
                                                onClick={() => setActiveSection(id)}
                                                className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeSection === id ? 'text-[#E74C3C]' : 'text-gray-300 hover:text-gray-600'}`}
                                            >
                                                {id === 'message' ? 'Invitation' : id === 'schedule' ? 'Schedule' : 'Directions'}
                                                {activeSection === id && (
                                                    <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-[#E74C3C] rounded-full" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                                        <AnimatePresence mode="wait">
                                            {activeSection === 'message' && (
                                                <motion.div key="msg" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                                                    <div className="space-y-6">
                                                        <h2 className="text-5xl font-bold leading-tight text-gray-900 break-keep">{invitation.title}</h2>
                                                        <div className="w-12 h-1 bg-[#E74C3C]" />
                                                        <p className="text-2xl font-light text-gray-500 leading-relaxed whitespace-pre-wrap">{invitation.description}</p>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-6">
                                                        <div className="p-8 bg-gray-50 rounded-[2rem] flex items-center gap-6">
                                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#E74C3C] shadow-sm"><Calendar size={32} /></div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">When</p>
                                                                <p className="text-2xl font-bold text-gray-900">{new Date(invitation.event_date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</p>
                                                                <p className="text-gray-500 font-medium">
                                                                    {new Date(invitation.event_date).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                                                    {invitation.event_end_date && (
                                                                        <>
                                                                            <span className="text-gray-300 mx-2">~</span>
                                                                            {new Date(invitation.event_end_date).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                                                        </>
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="p-8 bg-gray-50 rounded-[2rem] flex items-center gap-6">
                                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm"><MapPin size={32} /></div>
                                                            <div className="flex-1">
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Where</p>
                                                                <p className="text-2xl font-bold text-gray-900 break-keep">{invitation.location}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                            {activeSection === 'schedule' && (
                                                <motion.div key="sch" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                                    <h3 className="text-3xl font-bold text-gray-900">Time Table</h3>
                                                    <div className="space-y-6 relative border-l-2 border-gray-100 pl-8 ml-4">
                                                        {[{ time: '14:00', title: '웰컴 리셉션' }, { time: '15:00', title: '메인 이벤트' }, { time: '18:00', title: '클로징' }].map((item, idx) => (
                                                            <div key={idx} className="relative">
                                                                <div className="absolute -left-[45px] top-2 w-6 h-6 bg-white border-2 border-[#E74C3C] rounded-full z-10" />
                                                                <p className="text-[#E74C3C] font-black text-sm mb-1">{item.time}</p>
                                                                <p className="text-xl font-bold text-gray-800">{item.title}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <div className="p-12 border-t border-gray-50 flex flex-col gap-6">
                                        {!hasResponded ? (
                                            <div className="flex flex-col gap-3">
                                                <p className="text-center text-gray-400 text-sm">
                                                    하단의 버튼을 눌러 참석 여부를 알려주세요.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="w-full py-6 bg-green-500 text-white rounded-2xl text-2xl font-black flex items-center justify-center gap-3">
                                                <CheckCircle2 size={32} /> 참석 소식 전달 완료
                                            </div>
                                        )}

                                        {/* Social Sharing Buttons */}
                                        <div className="mt-4 pt-8 border-t border-gray-100">
                                            <p className="text-gray-400 text-[10px] font-black mb-6 uppercase tracking-[0.3em] text-center">Share this memory</p>
                                            <div className="flex items-center justify-center gap-6">
                                                <button
                                                    onClick={() => alert("카카오톡으로 공유합니다.")}
                                                    className="w-14 h-14 bg-[#FEE500] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                                                    title="KakaoTalk"
                                                >
                                                    <div className="w-6 h-6 bg-[#3A1D1D] rounded-lg transform -rotate-12" />
                                                </button>
                                                <button
                                                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)}
                                                    className="w-14 h-14 bg-[#1877F2] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                                                    title="Facebook"
                                                >
                                                    <NextImage src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="FB" width={24} height={24} className="rounded-sm" />
                                                </button>
                                                <button
                                                    onClick={() => alert("Threads로 공유합니다.")}
                                                    className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                                                    title="Threads"
                                                >
                                                    <div className="text-xl font-black transform rotate-12">@</div>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(window.location.href);
                                                        alert("링크가 복사되었습니다.");
                                                    }}
                                                    className="w-14 h-14 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                                                    title="Copy Link"
                                                >
                                                    <Share2 size={24} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Layout: LEAFLET (Interactive Brochure Book Style) */}
                        {layoutMode === 'leaflet' && (
                            <div className="text-center text-white/50 py-20">
                                <p className="text-2xl font-bold mb-2">📰 Leaflet Layout</p>
                                <p className="text-sm">Coming Soon - Premium Feature</p>
                            </div>
                        )}

                        <button
                            onClick={() => setStage('intro')}
                            className="mt-12 text-white/20 hover:text-white/40 font-black text-[10px] uppercase tracking-[1em] transition-colors"
                        >
                            Back to Intro
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* RSVP Modal */}
            <AnimatePresence>
                {showRsvpModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative"
                        >
                            <button
                                onClick={() => setShowRsvpModal(false)}
                                className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors"
                            >
                                <X size={32} />
                            </button>

                            <div className="p-12 md:p-20">
                                <div className="text-center mb-12">
                                    <h2 className="text-5xl font-black text-[#2c3e50] mb-4">참석 확인</h2>
                                    <p className="text-gray-500 text-lg">소중한 당신을 기다립니다. 참석 여부를 알려주세요!</p>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#E74C3C] mb-3 ml-2">My Name</label>
                                        <input
                                            type="text"
                                            value={guestName}
                                            onChange={(e) => setGuestName(e.target.value)}
                                            placeholder="성함을 입력해주세요"
                                            className="w-full bg-gray-50 border-none rounded-2xl p-6 text-2xl text-gray-900 focus:ring-4 focus:ring-red-100 placeholder:text-gray-400 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#E74C3C] mb-3 ml-2">Message (Optional)</label>
                                        <textarea
                                            value={rsvpMessage}
                                            onChange={(e) => setRsvpMessage(e.target.value)}
                                            placeholder="메시지를 남겨보세요"
                                            className="w-full bg-gray-50 border-none rounded-2xl p-6 h-40 text-2xl text-gray-900 focus:ring-4 focus:ring-red-100 placeholder:text-gray-400 outline-none resize-none transition-all"
                                        />
                                    </div>
                                    <button
                                        onClick={async () => {
                                            if (!guestName) {
                                                alert("성함을 입력해주세요!");
                                                return;
                                            }
                                            await onRSVP(guestName, rsvpMessage);
                                            setShowRsvpModal(false);
                                            setShowGuidanceModal(true);
                                        }}
                                        className="w-full py-7 bg-[#E74C3C] text-white rounded-3xl text-3xl font-black hover:bg-red-600 transition-colors active:scale-[0.98] shadow-2xl shadow-red-200"
                                    >
                                        참석 확인하기
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Post-RSVP Guidance Modal */}
            <AnimatePresence>
                {showGuidanceModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl"
                        >
                            <div className="p-10 text-center">
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-3">소식이 전달되었습니다!</h3>
                                <p className="text-gray-500 font-medium leading-relaxed mb-8">
                                    참석 확인 메시지가 전달되었습니다.<br />
                                    <strong>와요 회원가입</strong>을 하면 받은 초대장들을 한눈에 관리할 수 있어요!
                                </p>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => {
                                            setShowGuidanceModal(false);
                                            if ((window as any).triggerSignupModal) (window as any).triggerSignupModal();
                                        }}
                                        className="w-full py-4 bg-[#E74C3C] text-white rounded-2xl font-bold text-lg hover:bg-[#c0392b] transition-colors shadow-lg shadow-red-100"
                                    >
                                        내 초대장에 저장하기
                                    </button>
                                    <button
                                        onClick={() => setShowGuidanceModal(false)}
                                        className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-colors"
                                    >
                                        나중에 하기
                                    </button>
                                </div>
                                <p className="mt-6 text-[10px] text-gray-300 uppercase tracking-widest font-black">Wayo Invitation Service</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Audio Toggle */}
            {invitation.bgm && invitation.bgm !== 'none' && (
                <div className={`${styleMode === 'fullscreen' ? 'fixed' : 'absolute'} bottom-10 right-10 z-[120] flex items-center gap-4`}>
                    <AnimatePresence>
                        {showAudioTooltip && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-xl text-black text-xs font-bold"
                            >
                                음악을 켤 수 있어요! 🎵
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={() => {
                            setIsMuted(!isMuted);
                            setShowAudioTooltip(false);
                        }}
                        className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all relative overflow-hidden group"
                    >
                        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                        {isMuted && (
                            <div className="absolute inset-0 bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                    </button>
                </div>
            )}

            {/* Floating Bottom Dock (Action Bar) */}
            {stage === 'content' && !hasResponded && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`${styleMode === 'fullscreen' ? 'fixed' : 'absolute'} bottom-10 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-4`}
                >
                    <button
                        onClick={() => setShowRsvpModal(true)}
                        className="px-10 py-5 bg-[#E74C3C] hover:bg-[#c0392b] text-white rounded-full text-xl font-black shadow-2xl shadow-red-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 backdrop-blur-md"
                    >
                        <CheckCircle2 size={24} />
                        참석할게요!
                    </button>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert("링크가 복사되었습니다.");
                        }}
                        className="p-5 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/10 shadow-xl transition-all hover:scale-105 active:scale-95"
                    >
                        <Share2 size={24} />
                    </button>
                </motion.div>
            )}

            {hasResponded && stage === 'content' && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`${styleMode === 'fullscreen' ? 'fixed' : 'absolute'} bottom-10 left-1/2 -translate-x-1/2 z-[90]`}
                >
                    <div className="px-8 py-4 bg-green-500/90 text-white rounded-full font-bold shadow-2xl backdrop-blur-md flex items-center gap-2">
                        <CheckCircle2 size={20} />
                        참석 소식이 전달되었습니다
                    </div>
                </motion.div>
            )}

            {/* Hidden Audio */}
            {invitation.bgm && invitation.bgm !== 'none' && (
                <audio
                    ref={audioRef}
                    src={bgmSources[invitation.bgm] || bgmSources.classic}
                    loop
                    muted={isMuted}
                />
            )}
        </div>
    );
}
