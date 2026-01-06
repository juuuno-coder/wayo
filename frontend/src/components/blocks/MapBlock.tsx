import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

interface MapBlockProps {
    data: {
        location: string;
        lat?: number;
        lng?: number;
    };
}

declare global {
    interface Window {
        kakao: any;
    }
}

export default function MapBlock({ data }: MapBlockProps) {
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapError, setMapError] = useState(false);

    // Default coordinate (Seoul City Hall) if not provided
    const lat = data.lat || 37.5665;
    const lng = data.lng || 126.9780;

    useEffect(() => {
        // Check if Kakao Map script is already loaded
        if (window.kakao && window.kakao.maps) {
            setMapLoaded(true);
            return;
        }

        const script = document.createElement('script');
        const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

        if (!apiKey) {
            console.warn("Kakao Map API Key is missing");
            setMapError(true);
            return;
        }

        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
        script.async = true;

        script.onload = () => {
            window.kakao.maps.load(() => {
                setMapLoaded(true);
            });
        };

        script.onerror = () => {
            setMapError(true);
        };

        document.head.appendChild(script);
    }, []);

    useEffect(() => {
        if (mapLoaded && !mapError && document.getElementById(`map-${lat}-${lng}`)) {
            const container = document.getElementById(`map-${lat}-${lng}`);
            const options = {
                center: new window.kakao.maps.LatLng(lat, lng),
                level: 3
            };

            const map = new window.kakao.maps.Map(container, options);

            // Add marker
            const markerPosition = new window.kakao.maps.LatLng(lat, lng);
            const marker = new window.kakao.maps.Marker({
                position: markerPosition
            });
            marker.setMap(map);

            // Disable scroll zoom
            map.setZoomable(false);
        }
    }, [mapLoaded, mapError, lat, lng]);

    const openKakaoMap = () => {
        window.open(`https://map.kakao.com/link/to/${data.location},${lat},${lng}`, '_blank');
    };

    const openNaverMap = () => {
        window.open(`https://map.naver.com/v5/search/${encodeURIComponent(data.location)}`, '_blank');
    };

    return (
        <div className="p-4 my-4">
            <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                {/* Map Container */}
                <div className="h-64 bg-gray-200 relative">
                    {mapError ? (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
                            <div className="text-center">
                                <MapPin size={32} className="mx-auto mb-2 opacity-50" />
                                <span className="text-sm">지도를 불러올 수 없습니다</span>
                                {process.env.NODE_ENV === 'development' && (
                                    <p className="text-xs text-red-400 mt-2">API KEY 확인 필요</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div id={`map-${lat}-${lng}`} className="w-full h-full" />
                    )}
                </div>

                {/* Info Section */}
                <div className="p-6 text-center">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MapPin size={20} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{data.location || "장소 정보 없음"}</h3>
                    <p className="text-gray-500 text-sm mb-4">정확한 위치를 확인하세요</p>
                    <div className="flex gap-2 justify-center">
                        <button
                            onClick={openKakaoMap}
                            className="px-4 py-2 bg-yellow-400 text-black font-bold text-xs rounded-lg hover:bg-yellow-500 transition-colors"
                        >
                            카카오맵
                        </button>
                        <button
                            onClick={openNaverMap}
                            className="px-4 py-2 bg-green-500 text-white font-bold text-xs rounded-lg hover:bg-green-600 transition-colors"
                        >
                            네이버지도
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
