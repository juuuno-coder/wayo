import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface TextBlockProps {
    data: {
        content: string;
        align?: 'left' | 'center' | 'right';
    };
}

export default function TextBlock({ data }: TextBlockProps) {
    const { fontStyle } = useTheme();

    const fontClass = fontStyle === 'serif' ? 'font-serif' :
        fontStyle === 'hand' ? 'font-cursive' : 'font-sans';

    return (
        <div className={`p-8 text-${data.align || 'center'} prose prose-stone mx-auto max-w-none`}>
            <p className={`whitespace-pre-wrap text-gray-700 leading-loose text-lg ${fontClass}`}>
                {data.content}
            </p>
        </div>
    );
}
