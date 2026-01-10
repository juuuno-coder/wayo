import { useEditorStore } from '@/store/useEditorStore';
import SpacerBlockEditor from './SpacerBlockEditor';
import VideoBlockEditor from './VideoBlockEditor';
import GalleryBlockEditor from './GalleryBlockEditor';
import ScheduleBlockEditor from './ScheduleBlockEditor';
import RSVPBlockEditor from './RSVPBlockEditor';
import MapBlockEditor from './MapBlockEditor';
import ImageUploadField from './ImageUploadField';

export default function PropertyPanel() {
    const { blocks, activeBlockId, updateBlock } = useEditorStore();
    const activeBlock = blocks.find(b => b.id === activeBlockId);

    if (!activeBlock) return null;

    const handleChange = (key: string, value: any) => {
        updateBlock(activeBlock.id, { [key]: value });
    };

    const handleDataChange = (newData: any) => {
        updateBlock(activeBlock.id, newData);
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded-full uppercase tracking-widest font-black">{activeBlock.type}</span>
                    <span className="text-sm">설정</span>
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-8">

                {/* Hero Properties */}
                {activeBlock.type === 'hero' && (
                    <div className="space-y-6">
                        <ImageUploadField
                            label="배경 이미지"
                            url={activeBlock.data.image || ''}
                            onChange={(url) => handleChange('image', url)}
                        />
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500">제목 (Title)</label>
                            <input
                                type="text"
                                value={activeBlock.data.title || ''}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                placeholder="제목을 입력하세요"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500">부제목 (Subtitle)</label>
                            <input
                                type="text"
                                value={activeBlock.data.subTitle || ''}
                                onChange={(e) => handleChange('subTitle', e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                placeholder="부제목을 입력하세요"
                            />
                        </div>
                    </div>
                )}

                {/* Text Properties */}
                {activeBlock.type === 'text' && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500">내용 (Content)</label>
                            <textarea
                                value={activeBlock.data.content || ''}
                                onChange={(e) => handleChange('content', e.target.value)}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all h-40 resize-none leading-relaxed font-medium"
                                placeholder="초대 문구를 입력하세요"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500">정렬 (Align)</label>
                            <div className="flex bg-gray-100 p-1.5 rounded-xl border border-gray-200">
                                {['left', 'center', 'right'].map((align) => (
                                    <button
                                        key={align}
                                        onClick={() => handleChange('align', align)}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-all ${activeBlock.data.align === align ? 'bg-white shadow-md text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        {align === 'left' ? '왼쪽' : align === 'center' ? '가운데' : '오른쪽'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Map Properties */}
                {activeBlock.type === 'map' && (
                    <MapBlockEditor
                        data={activeBlock.data as any}
                        onChange={handleDataChange}
                    />
                )}

                {/* Image Properties */}
                {activeBlock.type === 'image' && (
                    <div className="space-y-6">
                        <ImageUploadField
                            label="이미지"
                            url={activeBlock.data.url || ''}
                            onChange={(url) => handleChange('url', url)}
                        />
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500">캡션 (Caption)</label>
                            <input
                                type="text"
                                value={activeBlock.data.caption || ''}
                                onChange={(e) => handleChange('caption', e.target.value)}
                                placeholder="이미지 설명 (선택사항)"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                            />
                        </div>
                    </div>
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
