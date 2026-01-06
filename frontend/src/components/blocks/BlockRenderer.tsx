import React from 'react';
import { ContentBlock } from '@/types/block';

// Import all block components
import HeroBlock from './HeroBlock';
import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';
import MapBlock from './MapBlock';
import DividerBlock from './DividerBlock';
import SpacerBlock from './SpacerBlock';
import VideoBlock from './VideoBlock';
import GalleryBlock from './GalleryBlock';
import ScheduleBlock from './ScheduleBlock';
import RSVPBlock from './RSVPBlock';

// MAIN RENDERER
export default function BlockRenderer({ block, invitationId }: { block: ContentBlock; invitationId?: string }) {
    switch (block.type) {
        case 'hero':
            return <HeroBlock data={block.data as any} />;
        case 'text':
            return <TextBlock data={block.data as any} />;
        case 'image':
            return <ImageBlock data={block.data as any} />;
        case 'map':
            return <MapBlock data={block.data as any} />;
        case 'divider':
            return <DividerBlock data={block.data as any} />;
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
