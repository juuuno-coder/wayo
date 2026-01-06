export type BlockType = 'hero' | 'text' | 'image' | 'video' | 'map' | 'schedule' | 'gallery' | 'rsvp' | 'divider' | 'spacer';

export interface BlockData {
    [key: string]: any;
}

export interface ContentBlock {
    id: string;
    type: BlockType;
    data: BlockData;
}
