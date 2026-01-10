import React from 'react';
import NextImage from "next/image";
import { Image as ImageIcon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ImageBlockProps {
    data: {
        url: string;
        caption?: string;
    };
}

export default function ImageBlock({ data }: ImageBlockProps) {
    const { fontStyle } = useTheme();

    const fontClass = fontStyle === 'serif' ? 'font-serif' :
        fontStyle === 'hand' ? 'font-cursive' : 'font-sans';

    return (
        <div className="my-8">
            {data.url ? (
                <div className="relative aspect-4/3 overflow-hidden rounded-xl shadow-sm mx-4">
                    <NextImage src={data.url} alt={data.caption || 'Image'} fill unoptimized className="object-cover" />
                </div>
            ) : (
                <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400 mx-4 rounded-xl">
                    <ImageIcon size={32} />
                </div>
            )}
            {data.caption && (
                <p className={`text-center text-gray-500 text-sm mt-3 ${fontClass}`}>
                    {data.caption}
                </p>
            )}
        </div>
    );
}
