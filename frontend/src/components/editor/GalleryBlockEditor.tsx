import React, { useState } from 'react';
import { Upload, X, Grid3x3, Columns } from 'lucide-react';

interface GalleryBlockEditorProps {
    data: {
        images: Array<{
            id: string;
            url: string;
            caption?: string;
        }>;
        layout?: 'grid' | 'carousel';
        columns?: number;
    };
    onChange: (data: any) => void;
}

export default function GalleryBlockEditor({ data, onChange }: GalleryBlockEditorProps) {
    const images = data.images || [];
    const layout = data.layout || 'grid';
    const columns = data.columns || 3;

    const handleAddImage = () => {
        const url = prompt('이미지 URL을 입력하세요:');
        if (url) {
            const newImage = {
                id: `img-${Date.now()}`,
                url,
                caption: ''
            };
            onChange({ ...data, images: [...images, newImage] });
        }
    };

    const handleRemoveImage = (id: string) => {
        onChange({ ...data, images: images.filter(img => img.id !== id) });
    };

    const handleUpdateCaption = (id: string, caption: string) => {
        onChange({
            ...data,
            images: images.map(img => img.id === id ? { ...img, caption } : img)
        });
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    레이아웃
                </label>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => onChange({ ...data, layout: 'grid' })}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${layout === 'grid'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <Grid3x3 size={16} />
                        그리드
                    </button>
                    <button
                        type="button"
                        onClick={() => onChange({ ...data, layout: 'carousel' })}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${layout === 'carousel'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <Columns size={16} />
                        캐러셀
                    </button>
                </div>
            </div>

            {layout === 'grid' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        열 개수
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {[2, 3, 4].map((col) => (
                            <button
                                key={col}
                                type="button"
                                onClick={() => onChange({ ...data, columns: col })}
                                className={`px-4 py-2 rounded-lg border-2 transition-colors ${columns === col
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                {col}열
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    이미지 ({images.length})
                </label>

                <div className="space-y-2">
                    {images.map((image) => (
                        <div key={image.id} className="flex items-start gap-2 p-2 border border-gray-200 rounded-lg">
                            <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                <img src={image.url} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={image.caption || ''}
                                    onChange={(e) => handleUpdateCaption(image.id, e.target.value)}
                                    placeholder="캡션 (선택사항)"
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(image.id)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={handleAddImage}
                    className="mt-2 w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
                >
                    <Upload size={16} />
                    이미지 추가
                </button>
            </div>
        </div>
    );
}
