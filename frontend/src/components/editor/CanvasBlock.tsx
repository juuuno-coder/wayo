import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditorStore, ContentBlock } from '@/store/useEditorStore';
import { GripVertical, Trash2 } from 'lucide-react';

// Block Renderers
const HeroRenderer = ({ data }: { data: any }) => (
    <div className="relative h-60 bg-gray-200 flex items-center justify-center overflow-hidden group">
        {data.image ? (
            <img src={data.image} alt="Hero" className="w-full h-full object-cover" />
        ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100" />
        )}
        <div className="relative z-10 text-center p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{data.title || "Title"}</h1>
            <p className="text-gray-600">{data.subTitle || "Subtitle"}</p>
        </div>
    </div>
);

const TextRenderer = ({ data }: { data: any }) => (
    <div className={`p-8 text-${data.align || 'center'} prose prose-sm max-w-none`}>
        <p className="whitespace-pre-wrap text-gray-700">{data.content || "Click to edit text..."}</p>
    </div>
);

const MapRenderer = ({ data }: { data: any }) => (
    <div className="p-4">
        <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center text-gray-400 border border-gray-200">
            <div className="text-center">
                <span className="text-2xl block mb-2">📍</span>
                <p className="text-sm font-bold">{data.location || "Location Name"}</p>
                <p className="text-xs">Map Placeholder</p>
            </div>
        </div>
    </div>
);

const RSVPRenderer = ({ data }: { data: any }) => (
    <div className="p-8 bg-gray-50 border-t border-b border-gray-100 text-center">
        <button className="bg-black text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg transform hover:scale-105 transition-transform">
            RSVP Now
        </button>
    </div>
);

export default function CanvasBlock({ block, isActive }: { block: ContentBlock; isActive: boolean }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });
    const { setActiveBlock, removeBlock } = useEditorStore();

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const renderContent = () => {
        switch (block.type) {
            case 'hero': return <HeroRenderer data={block.data} />;
            case 'text': return <TextRenderer data={block.data} />;
            case 'map': return <MapRenderer data={block.data} />;
            case 'rsvp': return <RSVPRenderer data={block.data} />;
            default: return <div className="p-4 border border-dashed border-gray-300 text-gray-400 text-center text-xs">Unknown Block: {block.type}</div>;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative group touch-none ${isActive ? 'ring-2 ring-blue-500 z-10' : 'hover:ring-1 hover:ring-blue-300'}`}
            onPointerDown={(e) => {
                // Prevent drag if clicking input? No, listener handles grip.
                setActiveBlock(block.id);
            }}
        >
            {/* Content */}
            <div className="bg-white">
                {renderContent()}
            </div>

            {/* Hover Controls */}
            <div className={`absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100' : ''}`}>
                <div
                    {...attributes}
                    {...listeners}
                    className="p-1.5 bg-white shadow-md rounded-md cursor-grab active:cursor-grabbing hover:bg-gray-50 text-gray-500"
                >
                    <GripVertical size={14} />
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                    className="p-1.5 bg-white shadow-md rounded-md hover:bg-red-50 text-red-500"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            {/* Active Indicator */}
            {isActive && (
                <div className="absolute inset-0 pointer-events-none border-2 border-blue-500/20" />
            )}
        </div>
    );
}
