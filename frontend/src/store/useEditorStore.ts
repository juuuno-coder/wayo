import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';
import { BlockType, ContentBlock, BlockData } from '@/types/block';

interface EditorState {
    blocks: ContentBlock[];
    activeBlockId: string | null;
    viewMode: 'mobile' | 'pc' | 'leaflet';

    // Meta (Global Settings that persist outside of blocks)
    meta: {
        title: string;
        description: string;
        eventDate: string;
        location: string;
        theme: string;
        font: string;
        bgm: string;
        effect: string;
    };

    // Actions
    initialize: (invitation?: any) => void;
    addBlock: (type: BlockType, index?: number) => void;
    updateBlock: (id: string, data: Partial<BlockData>) => void;
    removeBlock: (id: string) => void;
    reorderBlocks: (activeId: string, overId: string) => void;
    setActiveBlock: (id: string | null) => void;
    setViewMode: (mode: 'mobile' | 'pc' | 'leaflet') => void;
    updateMeta: (key: string, value: string) => void;
}

const defaultBlocks: ContentBlock[] = [
    { id: 'hero-1', type: 'hero', data: { title: '초대장 제목', subTitle: '초대합니다' } },
    { id: 'text-1', type: 'text', data: { content: '소중한 분들을 초대합니다.' } }
];

export const useEditorStore = create<EditorState>((set) => ({
    blocks: defaultBlocks,
    activeBlockId: null,
    viewMode: 'mobile',

    meta: {
        title: '',
        description: '',
        eventDate: '',
        location: '',
        theme: 'classic',
        font: 'serif',
        bgm: 'none',
        effect: 'none'
    },

    initialize: (invitation) => set((state) => {
        if (!invitation) return state;

        // If invitation has content_blocks, use them. Otherwise, generate default blocks from legacy fields.
        let initBlocks = invitation.content_blocks;

        if (!initBlocks || initBlocks.length === 0) {
            // Migration Logic: Convert legacy fields to blocks
            initBlocks = [
                { id: uuidv4(), type: 'hero', data: { title: invitation.title, image: invitation.cover_image_url } },
                { id: uuidv4(), type: 'text', data: { content: invitation.description } },
                { id: uuidv4(), type: 'map', data: { location: invitation.location } },
                { id: uuidv4(), type: 'rsvp', data: {} }
            ];
        }

        return {
            blocks: initBlocks,
            meta: {
                title: invitation.title,
                description: invitation.description,
                eventDate: invitation.event_date,
                location: invitation.location,
                theme: invitation.theme_color || 'classic',
                font: invitation.font_style || 'serif',
                bgm: invitation.bgm || 'none',
                effect: invitation.text_effect || 'none'
            }
        };
    }),

    addBlock: (type, index) => set((state) => {
        const newBlock: ContentBlock = {
            id: uuidv4(),
            type,
            data: getDefaultDataForType(type)
        };

        const newBlocks = [...state.blocks];
        if (typeof index === 'number') {
            newBlocks.splice(index, 0, newBlock);
        } else {
            newBlocks.push(newBlock);
        }

        return { blocks: newBlocks, activeBlockId: newBlock.id };
    }),

    updateBlock: (id, data) => set((state) => ({
        blocks: state.blocks.map((b) => b.id === id ? { ...b, data: { ...b.data, ...data } } : b)
    })),

    removeBlock: (id) => set((state) => ({
        blocks: state.blocks.filter((b) => b.id !== id),
        activeBlockId: state.activeBlockId === id ? null : state.activeBlockId
    })),

    reorderBlocks: (activeId, overId) => set((state) => {
        const oldIndex = state.blocks.findIndex((b) => b.id === activeId);
        const newIndex = state.blocks.findIndex((b) => b.id === overId);
        return {
            blocks: arrayMove(state.blocks, oldIndex, newIndex)
        };
    }),

    setActiveBlock: (id) => set({ activeBlockId: id }),

    setViewMode: (mode) => set({ viewMode: mode }),

    updateMeta: (key, value) => set((state) => ({
        meta: { ...state.meta, [key]: value }
    }))
}));

function getDefaultDataForType(type: BlockType): BlockData {
    switch (type) {
        case 'hero': return { title: '제목', subTitle: '부제목' };
        case 'text': return { content: '내용을 입력하세요', align: 'center' };
        case 'image': return { url: '', caption: '' };
        case 'map': return { location: '', lat: 0, lng: 0 };
        case 'video': return { url: '' };
        case 'spacer': return { height: 20 };
        case 'divider': return { style: 'solid' };
        default: return {};
    }
}
