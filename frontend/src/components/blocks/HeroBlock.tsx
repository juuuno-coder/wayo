import React from 'react';
import NextImage from "next/image";
import { useTheme } from '@/contexts/ThemeContext';

interface HeroBlockProps {
    data: {
        title: string;
        subTitle?: string;
        image?: string;
    };
}

export default function HeroBlock({ data }: HeroBlockProps) {
    const { themeColor, fontStyle, textEffect } = useTheme();

    const fontClass = fontStyle === 'serif' ? 'font-serif' :
        fontStyle === 'hand' ? 'font-cursive' : 'font-sans';

    const titleEffectClass = textEffect === 'shadow' ? 'drop-shadow-lg' :
        textEffect === 'outline' ? 'stroke-current stroke-2' : // Tailind doesn't support text-stroke natively well without plugin, fallback
            textEffect === 'neon' ? 'drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : '';

    return (
        <div className="relative h-[500px] flex items-center justify-center overflow-hidden bg-gray-50">
            {data.image ? (
                <>
                    <NextImage src={data.image} alt="Hero" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/20" /> {/* Overlay for readability */}
                </>
            ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-white" />
            )}

            <div className="relative z-10 text-center p-8 max-w-lg">
                {data.subTitle && (
                    <p
                        className={`text-sm tracking-[0.3em] uppercase mb-4 animate-in slide-in-from-bottom-2 fade-in duration-700 ${fontClass}`}
                        style={{ color: data.image ? 'white' : themeColor, textShadow: data.image ? '0 1px 2px rgba(0,0,0,0.5)' : 'none' }}
                    >
                        {data.subTitle}
                    </p>
                )}
                <h1
                    className={`text-4xl leading-tight font-bold mb-6 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-100 ${fontClass} ${titleEffectClass}`}
                    style={{ color: data.image ? 'white' : themeColor }}
                >
                    {data.title}
                </h1>
                <div
                    className="w-px h-16 mx-auto opacity-50 mb-6"
                    style={{ backgroundColor: data.image ? 'white' : themeColor }}
                ></div>
            </div>
        </div>
    );
}
