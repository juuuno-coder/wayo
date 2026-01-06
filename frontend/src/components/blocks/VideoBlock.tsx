import React from 'react';

interface VideoBlockProps {
    block: {
        id: string;
        type: 'video';
        data: {
            url: string;
            platform?: 'youtube' | 'vimeo';
            videoId?: string;
            aspectRatio?: '16:9' | '4:3' | '1:1';
        };
    };
}

function parseVideoUrl(url: string): { platform: 'youtube' | 'vimeo'; videoId: string } | null {
    // YouTube patterns
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
        return { platform: 'youtube', videoId: youtubeMatch[1] };
    }

    // Vimeo patterns
    const vimeoRegex = /vimeo\.com\/(?:.*\/)?(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
        return { platform: 'vimeo', videoId: vimeoMatch[1] };
    }

    return null;
}

export default function VideoBlock({ block }: VideoBlockProps) {
    const { url, platform, videoId, aspectRatio = '16:9' } = block.data;

    // Parse video URL if platform/videoId not provided
    const videoInfo = platform && videoId
        ? { platform, videoId }
        : parseVideoUrl(url);

    if (!videoInfo) {
        return (
            <div className="p-8 text-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">유효하지 않은 비디오 URL입니다.</p>
            </div>
        );
    }

    // Calculate padding for aspect ratio
    const aspectRatioPadding = {
        '16:9': '56.25%',
        '4:3': '75%',
        '1:1': '100%'
    }[aspectRatio];

    // Generate embed URL
    const embedUrl = videoInfo.platform === 'youtube'
        ? `https://www.youtube.com/embed/${videoInfo.videoId}`
        : `https://player.vimeo.com/video/${videoInfo.videoId}`;

    return (
        <div className="w-full px-4 py-6">
            <div className="max-w-4xl mx-auto">
                <div
                    className="relative w-full overflow-hidden rounded-lg shadow-lg"
                    style={{ paddingBottom: aspectRatioPadding }}
                >
                    <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={embedUrl}
                        title="Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    );
}
