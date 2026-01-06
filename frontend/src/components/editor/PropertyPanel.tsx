import { useEditorStore } from '@/store/useEditorStore';
import SpacerBlockEditor from './SpacerBlockEditor';
import VideoBlockEditor from './VideoBlockEditor';
import GalleryBlockEditor from './GalleryBlockEditor';
import ScheduleBlockEditor from './ScheduleBlockEditor';
import RSVPBlockEditor from './RSVPBlockEditor';

export default function PropertyPanel() {
    const { blocks, activeBlockId, updateBlock } = useEditorStore();
    const activeBlock = blocks.find(b => b.id === activeBlockId);

    if (!activeBlock) return null;

    const handleChange = (key: string, value: any) => {
        updateBlock(activeBlock.id, { [key]: value });
    };

    const handleDataChange = (newData: any) => {
        blocks.forEach(block => {
            if (block.id === activeBlock.id) {
                Object.keys(newData).forEach(key => {
                    updateBlock(activeBlock.id, { [key]: newData[key] });
                });
            }
        });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-5 border-b border-gray-100">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded uppercase tracking-wider">{activeBlock.type}</span>
                    <span>Properties</span>
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">

                {/* Hero Properties */}
                {activeBlock.type === 'hero' && (
                    <>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500">Title</label>
                            <input
                                type="text"
                                value={activeBlock.data.title || ''}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500">Subtitle</label>
                            <input
                                type="text"
                                value={activeBlock.data.subTitle || ''}
                                onChange={(e) => handleChange('subTitle', e.target.value)}
                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </>
                )}

                {/* Text Properties */}
                {activeBlock.type === 'text' && (
                    <>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500">Content</label>
                            <textarea
                                value={activeBlock.data.content || ''}
                                onChange={(e) => handleChange('content', e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32 resize-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500">Align</label>
                            <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
                                {['left', 'center', 'right'].map((align) => (
                                    <button
                                        key={align}
                                        onClick={() => handleChange('align', align)}
                                        className={`flex-1 py-1 text-xs font-bold rounded capitalize ${activeBlock.data.align === align ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                                    >
                                        {align}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Map Properties */}
                {activeBlock.type === 'map' && (
                    <>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500">Location Name</label>
                            <input
                                type="text"
                                value={activeBlock.data.location || ''}
                                onChange={(e) => handleChange('location', e.target.value)}
                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <p className="text-xs text-gray-400 bg-blue-50 text-blue-600 p-3 rounded-lg">
                            To update the exact coordinates, please use the main form or a map picker (Coming Soon).
                        </p>
                    </>
                )}

                {/* Image Properties */}
                {activeBlock.type === 'image' && (
                    <>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500">Image URL</label>
                            <input
                                type="text"
                                value={activeBlock.data.url || ''}
                                onChange={(e) => handleChange('url', e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500">Caption</label>
                            <input
                                type="text"
                                value={activeBlock.data.caption || ''}
                                onChange={(e) => handleChange('caption', e.target.value)}
                                placeholder="Image caption (optional)"
                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </>
                )}

                {/* Spacer Properties */}
                {activeBlock.type === 'spacer' && (
                    <SpacerBlockEditor
                        data={activeBlock.data as { height: number }}
                        onChange={handleDataChange}
                    />
                )}

                {/* Video Properties */}
                {activeBlock.type === 'video' && (
                    <VideoBlockEditor
                        data={activeBlock.data as any}
                        onChange={handleDataChange}
                    />
                )}

                {/* Gallery Properties */}
                {activeBlock.type === 'gallery' && (
                    <GalleryBlockEditor
                        data={activeBlock.data as any}
                        onChange={handleDataChange}
                    />
                )}

                {/* Schedule Properties */}
                {activeBlock.type === 'schedule' && (
                    <ScheduleBlockEditor
                        data={activeBlock.data as any}
                        onChange={handleDataChange}
                    />
                )}

                {/* RSVP Properties */}
                {activeBlock.type === 'rsvp' && (
                    <RSVPBlockEditor
                        data={activeBlock.data}
                        onChange={handleDataChange}
                    />
                )}

                {/* Divider - No properties */}
                {activeBlock.type === 'divider' && (
                    <div className="text-center py-10">
                        <p className="text-gray-400 text-sm">Divider has no configurable properties.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
