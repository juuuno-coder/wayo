import React, { useState } from 'react';
import { Video, AlertCircle } from 'lucide-react';

interface VideoBlockEditorProps {
    data: {
        url: string;
        platform?: 'youtube' | 'vimeo';
        videoId?: string;
        aspectRatio?: '16:9' | '4:3' | '1:1';
    };
    onChange: (data: any) => void;
}

function parseVideoUrl(url: string): { platform: 'youtube' | 'vimeo'; videoId: string } | null {
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
        return { platform: 'youtube', videoId: youtubeMatch[1] };
    }

    const vimeoRegex = /vimeo\.com\/(?:.*\/)?(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
        return { platform: 'vimeo', videoId: vimeoMatch[1] };
    }

    return null;
}

export default function VideoBlockEditor({ data, onChange }: VideoBlockEditorProps) {
    const [urlInput, setUrlInput] = useState(data.url || '');
    const [error, setError] = useState('');

    const handleUrlChange = (url: string) => {
        setUrlInput(url);
        setError('');

        if (!url.trim()) {
            onChange({ ...data, url: '', platform: undefined, videoId: undefined });
            return;
        }

        const parsed = parseVideoUrl(url);
        if (parsed) {
            onChange({
                ...data,
                url,
                platform: parsed.platform,
                videoId: parsed.videoId
            });
        } else {
            setError('유효하지 않은 YouTube 또는 Vimeo URL입니다.');
        }
    };

    const aspectRatio = data.aspectRatio || '16:9';

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    비디오 URL
                </label>
                <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {error && (
                    <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}
                <p className="mt-1 text-xs text-gray-500">
                    YouTube 또는 Vimeo 링크를 입력하세요
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    화면 비율
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {['16:9', '4:3', '1:1'].map((ratio) => (
                        <button
                            key={ratio}
                            type="button"
                            onClick={() => onChange({ ...data, aspectRatio: ratio as any })}
                            className={`px-4 py-2 rounded-lg border-2 transition-colors ${aspectRatio === ratio
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            {ratio}
                        </button>
                    ))}
                </div>
            </div>

            {/* Preview */}
            {data.videoId && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <p className="text-xs text-gray-500 mb-2">미리보기</p>
                    <div className="bg-gray-200 rounded flex items-center justify-center" style={{ paddingBottom: aspectRatio === '16:9' ? '56.25%' : aspectRatio === '4:3' ? '75%' : '100%', position: 'relative' }}>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Video size={32} className="text-gray-400" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                        {data.platform === 'youtube' ? 'YouTube' : 'Vimeo'} • {data.videoId}
                    </p>
                </div>
            )}
        </div>
    );
}
