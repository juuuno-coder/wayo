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
    Volume2,
    VolumeX,
    X
} from "lucide-react";

interface PCInvitationViewProps {
    invitation: any;
    onRSVP: (name: string, message: string) => Promise<void>;
    hasResponded: boolean;
    myTicket: any;
}

export default function PCInvitationView({ invitation, onRSVP, hasResponded, myTicket }: PCInvitationViewProps) {
    const [stage, setStage] = useState<'envelope' | 'opening' | 'content'>('envelope');
    const [isMuted, setIsMuted] = useState(false);
    const [guestName, setGuestName] = useState("");
    const [rsvpMessage, setRsvpMessage] = useState("");
    const [showRsvpModal, setShowRsvpModal] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const fontClass = invitation.font_style === 'serif' ? 'font-serif' : 'font-sans';

    const handleOpen = () => {
        setStage('opening');
        if (invitation.bgm && invitation.bgm !== 'none' && audioRef.current) {
            audioRef.current.play().catch(e => console.log("Audio play blocked", e));
        }
        setTimeout(() => {
            setStage('content');
        }, 2000);
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
                {stage === 'envelope' && (
                    <motion.div
                        key="envelope"
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="z-10 relative group cursor-pointer"
                        onClick={handleOpen}
                    >
                        <div className="relative w-[500px] h-[350px]">
                            <NextImage
                                src="/images/wayo_envelope_3d.png"
                                alt="Envelope"
                                fill
                                className="object-contain drop-shadow-[0_50px_100px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
                            />

                            {/* Wax Seal / Button */}
                            <motion.div
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#C0392B] rounded-full border-4 border-[#922B21] shadow-2xl flex items-center justify-center z-20"
                            >
                                <div className="text-white text-[10px] font-black tracking-widest uppercase">Open</div>
                            </motion.div>

                            {/* Decorative Text */}
                            <div className="absolute bottom-10 left-0 right-0 text-center">
                                <p className="text-white/40 text-[10px] uppercase tracking-[0.5em] animate-pulse">Click to Reveal</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {stage === 'opening' && (
                    <motion.div
                        key="opening"
                        className="z-50 text-white text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.5, rotateY: 90 }}
                            animate={{ scale: 1, rotateY: 0 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="text-4xl md:text-6xl font-black tracking-tighter"
                        >
                            {invitation.title}
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="mt-6 text-xl text-white/60 font-light"
                        >
                            당신을 초대합니다
                        </motion.p>
                    </motion.div>
                )}

                {stage === 'content' && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="z-10 w-full h-full overflow-y-auto no-scrollbar"
                    >
                        <div className="max-w-6xl mx-auto min-h-screen py-20 px-8 flex flex-col items-center">

                            {/* Invitation Poster Card */}
                            <motion.div
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="relative w-full aspect-[4/5] md:aspect-[16/9] bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row"
                            >
                                {/* Image Side */}
                                <div className="flex-1 relative h-1/2 md:h-full min-h-[300px]">
                                    <NextImage
                                        src={invitation.image_urls?.[0] || invitation.cover_image_url || "/images/wayo_envelope_3d.png"}
                                        alt="Cover"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/10" />
                                </div>

                                {/* Content Side */}
                                <div className="flex-1 bg-white p-12 md:p-20 flex flex-col justify-center text-[#2c3e50]">
                                    <div className="mb-12">
                                        <p className="text-[#E74C3C] font-black text-xs uppercase tracking-[0.4em] mb-4">You are Invited</p>
                                        <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] mb-8 tracking-tight break-keep">
                                            {invitation.title}
                                        </h1>
                                        <div className="w-16 h-1 bg-[#E74C3C] mb-8" />
                                        <p className="text-xl md:text-2xl font-light opacity-80 leading-relaxed italic whitespace-pre-wrap">
                                            {invitation.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-12">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-[#E74C3C]">
                                                <Calendar size={28} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-black text-gray-400">Date & Time</p>
                                                <p className="font-bold text-xl">{new Date(invitation.event_date).toLocaleString('ko-KR')}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                                                <MapPin size={28} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-black text-gray-400">Location</p>
                                                <p className="font-bold text-xl break-keep">{invitation.location}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* RSVP Call to Action */}
                                    <div className="mt-16 flex gap-4">
                                        {!hasResponded ? (
                                            <button
                                                onClick={() => setShowRsvpModal(true)}
                                                className="flex-1 py-6 bg-[#E74C3C] text-white rounded-2xl text-2xl font-bold shadow-2xl shadow-red-200 hover:scale-[1.02] active:scale-95 transition-all"
                                            >
                                                참석 확인하기
                                            </button>
                                        ) : (
                                            <div className="flex-1 py-6 bg-green-500 text-white rounded-2xl text-2xl font-bold flex items-center justify-center gap-3">
                                                <CheckCircle2 size={28} /> 참석이 확인되었습니다
                                            </div>
                                        )}
                                        <button className="p-6 bg-gray-50 text-gray-400 rounded-2xl hover:text-gray-900 transition-colors">
                                            <Share2 size={28} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Gallery Section - More Images */}
                            {invitation.image_urls && invitation.image_urls.length > 1 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    className="mt-20 w-full max-w-6xl grid grid-cols-2 md:grid-cols-3 gap-6"
                                >
                                    {invitation.image_urls.slice(1).map((url: string, idx: number) => (
                                        <div key={idx} className="aspect-square relative rounded-[2rem] overflow-hidden shadow-2xl group">
                                            <NextImage src={url} alt={`Gallery ${idx}`} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {/* Ticket Section (If exists) */}
                            {hasResponded && myTicket && (
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-20 w-full max-w-2xl bg-white border-2 border-dashed border-gray-200 rounded-[3rem] p-12 flex flex-col md:flex-row items-center gap-12 shadow-2xl"
                                >
                                    <div className="bg-gray-50 p-6 rounded-3xl shrink-0">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${myTicket.qr_code}`}
                                            alt="QR Code"
                                            className="w-40 h-40"
                                        />
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-3xl font-black mb-2 text-[#2c3e50]">GABOJAGO TICKET</h3>
                                        <p className="text-gray-400 mb-6 font-mono text-sm break-all">{myTicket.qr_code}</p>
                                        <div className="py-2 px-6 bg-blue-600 text-white inline-block rounded-full font-bold text-sm">
                                            ENTRY TICKET CONFIRMED
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Scroll Footer */}
                            <div className="mt-40 text-white/20 text-[10px] font-black uppercase tracking-[1em] flex flex-col items-center gap-4 py-20">
                                Wayo Premium Experience
                                <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                                    <ArrowDown size={20} />
                                </motion.div>
                            </div>
                        </div>
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
