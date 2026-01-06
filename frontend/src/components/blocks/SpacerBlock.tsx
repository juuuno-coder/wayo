import React from 'react';

interface SpacerBlockProps {
    block: {
        id: string;
        type: 'spacer';
        data: {
            height: number;
        };
    };
}

export default function SpacerBlock({ block }: SpacerBlockProps) {
    const height = block.data.height || 40;

    return (
        <div
            style={{ height: `${height}px` }}
            className="w-full"
            aria-hidden="true"
        />
    );
}
