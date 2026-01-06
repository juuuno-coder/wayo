import React from 'react';
import { ContentBlock } from '@/types/block';
import { MapPin, Calendar, Image as ImageIcon } from 'lucide-react';
import NextImage from "next/image";

// Import new block components
import SpacerBlock from './SpacerBlock';
import VideoBlock from './VideoBlock';
import GalleryBlock from './GalleryBlock';
import ScheduleBlock from './ScheduleBlock';
import RSVPBlock from './RSVPBlock';

// 1. Hero Block (View Only)
const HeroBlock = ({ data }: { data: any }) => (
    <div className="relative h-[500px] flex items-center justify-center overflow-hidden bg-gray-50">
        {data.image ? (
            <NextImage src={data.image} alt="Hero" fill className="object-cover" />
        ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-white" />
        )}
        <div className="relative z-10 text-center p-8 max-w-lg">
            {data.subTitle && (
                <p className="text-[#8D6E63] text-sm font-serif tracking-[0.3em] uppercase mb-4 animate-in slide-in-from-bottom-2 fade-in duration-700">
                    {data.subTitle}
                </p>
            )}
            <h1 className="text-4xl text-[#3E2723] leading-tight font-serif font-bold mb-6 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-100">
                {data.title}
            </h1>
            <div className="w-px h-16 bg-[#D7CCC8] mx-auto opacity-50 mb-6"></div>
        </div>
    </div>
);

// 2. Text Block (View Only)
const TextBlock = ({ data }: { data: any }) => (
    <div className={`p-8 text-${data.align || 'center'} prose prose-stone mx-auto max-w-none`}>
        <p className="whitespace-pre-wrap text-gray-700 leading-loose text-lg font-light">
            {data.content}
        </p>
    </div>
);

// 3. Image Block (View Only)
const ImageBlock = ({ data }: { data: any }) => (
    <div className="my-8">
        {data.url ? (
            <div className="relative aspect-4/3 overflow-hidden rounded-xl shadow-sm mx-4">
                <NextImage src={data.url} alt={data.caption || 'Image'} fill className="object-cover" />
            </div>
        ) : (
            <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400 mx-4 rounded-xl">
                <ImageIcon size={32} />
            </div>
        )}
        {data.caption && <p className="text-center text-gray-500 text-sm mt-3">{data.caption}</p>}
    </div>
);

// 4. Map Block (View Only) - Placeholder for now
const MapBlock = ({ data }: { data: any }) => (
    <div className="p-4 my-4">
        <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                <span>지도 영역 (API 연동 예정)</span>
            </div>
            <div className="p-6 text-center">
                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin size={20} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{data.location || "장소 정보 없음"}</h3>
                <p className="text-gray-500 text-sm mb-4">정확한 위치를 확인하세요</p>
                <div className="flex gap-2 justify-center">
                    <button className="px-4 py-2 bg-yellow-400 text-black font-bold text-xs rounded-lg">카카오맵</button>
                    <button className="px-4 py-2 bg-green-500 text-white font-bold text-xs rounded-lg">네이버지도</button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-600 font-bold text-xs rounded-lg">티맵</button>
                </div>
            </div>
        </div>
    </div>
);

// 5. Divider Block
const DividerBlock = ({ data }: { data: any }) => (
    <div className="py-8 flex items-center justify-center">
        <div className={`w-12 h-px bg-gray-300 ${data.style === 'dotted' ? 'border-t border-dotted border-gray-400 bg-transparent h-0 w-24' : ''}`} />
    </div>
);

// MAIN RENDERER
export default function BlockRenderer({ block, invitationId }: { block: ContentBlock; invitationId?: string }) {
    switch (block.type) {
        case 'hero':
            return <HeroBlock data={block.data} />;
        case 'text':
            return <TextBlock data={block.data} />;
        case 'image':
            return <ImageBlock data={block.data} />;
        case 'map':
            return <MapBlock data={block.data} />;
        case 'divider':
            return <DividerBlock data={block.data} />;
        case 'spacer':
            return <SpacerBlock block={block as any} />;
        case 'video':
            return <VideoBlock block={block as any} />;
        case 'gallery':
            return <GalleryBlock block={block as any} />;
        case 'schedule':
            return <ScheduleBlock block={block as any} />;
        case 'rsvp':
            return <RSVPBlock block={block as any} invitationId={invitationId} />;
        default:
            return null;
    }
}
