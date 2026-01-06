import React from 'react';

interface DividerBlockProps {
    data: {
        style?: 'solid' | 'dotted' | 'dashed';
    };
}

export default function DividerBlock({ data }: DividerBlockProps) {
    return (
        <div className="py-8 flex items-center justify-center">
            <div
                className={`bg-gray-300 ${data.style === 'dotted' ? 'w-24 h-0 border-t-2 border-dotted border-gray-300 bg-transparent' :
                        data.style === 'dashed' ? 'w-24 h-0 border-t-2 border-dashed border-gray-300 bg-transparent' :
                            'w-12 h-px'
                    }`}
            />
        </div>
    );
}
