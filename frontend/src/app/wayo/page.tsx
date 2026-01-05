"use client";

import { useRouter } from "next/navigation";
import NextImage from "next/image";
import { Sparkles, Heart, Zap, MousePointer2 } from "lucide-react";
import { Black_Han_Sans, Inter } from "next/font/google";
import { motion } from "framer-motion";

const blackHanSans = Black_Han_Sans({
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

export default function WayoHome() {
  const router = useRouter();

  return (
    <div className={`min-h-screen bg-[#FDFBF7] text-[#5D4037] ${inter.className} overflow-x-hidden`}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-white/30 border-b border-[#5D4037]/5">
        <div className={`text-2xl text-[#E74C3C] tracking-tighter ${blackHanSans.className}`}>WAYO</div>
        <div className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-widest opacity-60">
          <a href="#features" className="hover:text-[#E74C3C] transition-colors">Features</a>
          <a href="#samples" className="hover:text-[#E74C3C] transition-colors">Samples</a>
          <a href="#faq" className="hover:text-[#E74C3C] transition-colors">FAQ</a>
        </div>
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-2 rounded-full border border-[#E74C3C]/20 text-sm font-bold hover:bg-[#E74C3C] hover:text-white transition-all active:scale-95"
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-center p-6 md:p-20 pt-32 gap-12 max-w-7xl mx-auto overflow-hidden">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex-1 text-center md:text-left z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-100 text-[#E74C3C] rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <Sparkles size={14} /> New Generation Invitation
          </div>
          <h1 className={`text-6xl md:text-8xl text-[#E74C3C] mb-6 tracking-tighter leading-none ${blackHanSans.className}`}>
            WAYO
          </h1>
          <p className="text-xl md:text-3xl mb-12 leading-tight opacity-90 font-light">
            마음을 담은 정교한 초대장이<br />
            당신의 공간으로 <span className="font-bold border-b-4 border-[#E74C3C]/20 text-[#E74C3C]">지금 바로 와요 💌</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/invitations/create')}
              className="px-10 py-5 bg-[#E74C3C] text-white rounded-2xl text-xl font-bold shadow-2xl shadow-red-200 flex items-center justify-center gap-3 transition-colors"
            >
              <Sparkles size={24} />
              초대장 무료로 만들기
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/invitations/manage')}
              className="px-10 py-5 bg-white text-[#5D4037] border border-[#E74C3C]/10 rounded-2xl text-xl font-bold hover:bg-red-50 transition-colors shadow-sm"
            >
              내 초대장 관리하기
            </motion.button>
          </div>

          <p className="mt-8 text-sm opacity-40 flex items-center justify-center md:justify-start gap-2 italic">
            <MousePointer2 size={14} /> No design skills required. Just pick and send.
          </p>
        </motion.div>

        {/* Right 3D Mockup */}
        <div className="flex-1 relative aspect-square w-full max-w-lg">
          {/* Decorative background circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-red-400/5 rounded-full blur-3xl -z-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-red-500/5 rounded-full blur-2xl -z-10" />

          {/* Floating Floating Envelope */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 2, 0, -2, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative w-full h-full"
          >
            <NextImage
              src="/images/wayo_envelope_3d.jpg"
              alt="WAYO Envelope"
              fill
              className="object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.15)] mix-blend-multiply"
            />
          </motion.div>

          {/* Floating Accents */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute top-0 right-10 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-500">
              <Heart fill="currentColor" size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold opacity-30 uppercase tracking-tighter">New RSVPs</p>
              <p className="font-bold text-lg leading-none">+24 Guests</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 2 }}
            className="absolute bottom-20 left-0 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
              <Zap fill="currentColor" size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold opacity-30 uppercase tracking-tighter">Status</p>
              <p className="font-bold text-lg leading-none">Instant Sending</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats / Proof Section */}
      <section className="bg-white py-20 border-y border-[#5D4037]/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {[
            { label: "Created Invitations", value: "128,402+" },
            { label: "Successful Events", value: "50,000+" },
            { label: "Guest Satisfaction", value: "99.9%" },
            { label: "Global Reach", value: "12 Countries" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-4xl font-bold text-[#E74C3C] mb-2">{stat.value}</p>
              <p className="text-sm font-bold opacity-40 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 text-center border-t border-[#5D4037]/5">
        <div className={`text-3xl text-[#E74C3C] tracking-tighter mb-8 ${blackHanSans.className}`}>WAYO</div>
        <div className="flex justify-center gap-8 mb-12 opacity-50 text-sm font-bold">
          <a href="#" className="hover:text-[#E74C3C]">Terms</a>
          <a href="#" className="hover:text-[#E74C3C]">Privacy</a>
          <a href="#" className="hover:text-[#E74C3C]">Contact</a>
          <a href="#" className="hover:text-[#E74C3C]">Blog</a>
        </div>
        <p className="text-xs opacity-30">© 2026 WAYO Invitation Service. All rights reserved.</p>
      </footer>

      <style jsx global>{`
        html { scroll-behavior: smooth; }
        .inner-border { box-shadow: inset 0 0 0 12px white; }
      `}</style>
    </div>
  );
}
