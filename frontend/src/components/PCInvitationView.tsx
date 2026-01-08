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

interface PCInvitationViewProps {
    invitation: any;
    onRSVP: (name: string, message: string) => Promise<void>;
    hasResponded: boolean;
    myTicket: any;
}

export default function PCInvitationView({ invitation, onRSVP, hasResponded, myTicket }: PCInvitationViewProps) {
    const [stage, setStage] = useState<'intro' | 'envelope' | 'opening' | 'content'>('intro');
    const [isMuted, setIsMuted] = useState(false);
    const [guestName, setGuestName] = useState("");
    const [rsvpMessage, setRsvpMessage] = useState("");
    const [showRsvpModal, setShowRsvpModal] = useState(false);
    const [activeSection, setActiveSection] = useState<'message' | 'schedule' | 'map'>('message');
    const [layoutMode, setLayoutMode] = useState<'single' | 'spread' | 'leaflet'>(invitation.default_layout || 'spread');
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const fontClass = invitation.font_style === 'serif' ? 'font-serif' : 'font-sans';
    const hostName = invitation.user?.nickname || "가보자고 친구";

    const handleStart = () => {
        setStage('envelope');
        // Start background music subtly if possible
        if (invitation.bgm && invitation.bgm !== 'none' && audioRef.current) {
            audioRef.current.play().catch(e => console.log("Audio play blocked", e));
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
        <div className={`fixed inset-0 overflow-hidden bg-[#1a1a1a] flex items-center justify-center ${fontClass}`}>
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
                        className="z-[100] fixed inset-0 bg-black flex flex-col items-center justify-center text-center p-6"
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
                        {/* Layout Selector UI */}
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl z-50">
                            {(['single', 'spread', 'leaflet'] as const).map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setLayoutMode(mode)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${layoutMode === mode ? 'bg-white text-black shadow-xl' : 'text-white/40 hover:text-white/70'}`}
                                >
                                    {mode === 'single' ? 'Single' : mode === 'spread' ? 'Double' : '4p Leaflet'}
                                </button>
                            ))}
                        </div>

                        {/* Layout: SINGLE (Poster Only Style) */}
                        {layoutMode === 'single' && (
                            <div className="w-full max-w-[600px] h-[850px] bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col">
                                <div className="h-2/3 relative">
                                    <NextImage
                                        src={invitation.image_urls?.[0] || invitation.cover_image_url || "/images/wayo_envelope_3d.png"}
                                        alt="Cover"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-12 left-12 right-12 text-white">
                                        <p className="text-[10px] font-black tracking-[0.5em] opacity-80 mb-2">OFFICIAL INVITATION</p>
                                        <h3 className="text-4xl font-black leading-tight break-keep">{invitation.title}</h3>
                                    </div>
                                </div>
                                <div className="flex-1 p-12 overflow-y-auto custom-scrollbar flex flex-col gap-8">
                                    <p className="text-2xl font-light text-gray-500 leading-relaxed whitespace-pre-wrap">
                                        {invitation.description}
                                    </p>
                                    <div className="flex gap-4 border-t border-gray-50 pt-8 mt-auto">
                                        <button
                                            onClick={() => setShowRsvpModal(true)}
                                            className="flex-1 py-5 bg-[#E74C3C] text-white rounded-2xl text-xl font-black shadow-2xl hover:scale-[1.02] transition-all"
                                        >
                                            참석 가능합니다!
                                        </button>
                                        <button className="p-5 bg-gray-50 text-gray-400 rounded-2xl hover:text-gray-900 transition-colors">
                                            <Share2 size={24} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Layout: SPREAD (Current 2p Book Style) */}
                        {layoutMode === 'spread' && (
                            <div className="w-full max-w-[1200px] h-[750px] flex items-stretch bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden relative">
                                {/* Left Page: Poster */}
                                <div className="flex-1 relative overflow-hidden border-r border-gray-100">
                                    <NextImage
                                        src={invitation.image_urls?.[0] || invitation.cover_image_url || "/images/wayo_envelope_3d.png"}
                                        alt="Cover"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/5" />
                                    <div className="absolute bottom-12 left-12 right-12 z-10 text-white drop-shadow-lg">
                                        <p className="text-[10px] font-black tracking-[0.5em] opacity-80 mb-2">OFFICIAL INVITATION</p>
                                        <h3 className="text-3xl font-black">{invitation.title}</h3>
                                    </div>
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
                                    <div className="p-12 border-t border-gray-50 flex gap-4">
                                        {!hasResponded ? (
                                            <button onClick={() => setShowRsvpModal(true)} className="flex-1 py-6 bg-[#E74C3C] text-white rounded-2xl text-2xl font-black shadow-2xl hover:scale-[1.02] transition-all">참석 가능합니다!</button>
                                        ) : (
                                            <div className="flex-1 flex gap-4">
                                                <div className="flex-1 py-6 bg-green-500 text-white rounded-2xl text-2xl font-black flex items-center justify-center gap-3"><CheckCircle2 size={32} /> 참석 예약 완료</div>
                                                {/* Global Signup Trigger */}
                                                <button onClick={() => (window as any).triggerSignupModal?.()} className="flex-1 py-6 bg-black text-white rounded-2xl text-xl font-black">보관함에 저장</button>
                                            </div>
                                        )}
                                        <button className="p-6 bg-gray-50 text-gray-400 rounded-2xl hover:text-gray-900 transition-colors"><Share2 size={32} /></button>
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
                                    <h2 className="text-5xl font-black text-[#2c3e50] mb-4">RSVP</h2>
                                    <p className="text-gray-400 text-lg">참석 여부를 알려주세요. 소중한 당신을 기다립니다.</p>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#E74C3C] mb-3 ml-2">My Name</label>
                                        <input
                                            type="text"
                                            value={guestName}
                                            onChange={(e) => setGuestName(e.target.value)}
                                            placeholder="성함을 입력해주세요"
                                            className="w-full bg-gray-50 border-none rounded-2xl p-6 text-2xl focus:ring-4 focus:ring-red-100 placeholder:text-gray-300 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#E74C3C] mb-3 ml-2">Message (Optional)</label>
                                        <textarea
                                            value={rsvpMessage}
                                            onChange={(e) => setRsvpMessage(e.target.value)}
                                            placeholder="메시지를 남겨보세요"
                                            className="w-full bg-gray-50 border-none rounded-2xl p-6 h-40 text-2xl focus:ring-4 focus:ring-red-100 placeholder:text-gray-300 outline-none resize-none transition-all"
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
                                        }}
                                        className="w-full py-7 bg-[#E74C3C] text-white rounded-3xl text-3xl font-black hover:bg-red-600 transition-colors active:scale-[0.98] shadow-2xl shadow-red-200"
                                    >
                                        Confirm Attendance
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Audio Toggle */}
            {invitation.bgm && invitation.bgm !== 'none' && (
                <div className="fixed bottom-10 right-10 z-[120]">
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all"
                    >
                        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>
                </div>
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
