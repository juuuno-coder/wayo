import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';

interface MapBlockEditorProps {
    data: {
        location?: string;
        address?: string; // 상세 주소
        lat?: number;
        lng?: number;
    };
    onChange: (data: any) => void;
}

export default function MapBlockEditor({ data, onChange }: MapBlockEditorProps) {
    const [isSearching, setIsSearching] = useState(false);

    const handleSearchAddress = () => {
        // Load Daum Postcode script dynamically
        const script = document.createElement('script');
        script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.onload = () => {
            // Safety check
            if (!window.daum || !window.daum.Postcode) {
                alert("주소 검색 서비스를 불러오는데 실패했습니다.");
                return;
            }

            new window.daum.Postcode({
                oncomplete: function (data: any) {
                    const fullAddress = data.address;
                    const locationName = data.buildingName || fullAddress;

                    // Geocoding (Address -> Coordinates) using Kakao Maps API
                    // Note: This requires Kakao Maps Script to be loaded on the page
                    if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
                        const geocoder = new window.kakao.maps.services.Geocoder();
                        geocoder.addressSearch(fullAddress, function (result: any, status: any) {
                            if (status === window.kakao.maps.services.Status.OK) {
                                const coords = result[0];
                                onChange({
                                    ...data,
                                    location: locationName,
                                    address: fullAddress,
                                    lat: parseFloat(coords.y),
                                    lng: parseFloat(coords.x)
                                });
                            } else {
                                // If geocoding fails, just save address
                                onChange({
                                    ...data,
                                    location: locationName,
                                    address: fullAddress
                                });
                                alert("좌표 변환에 실패했습니다. API 키 설정을 확인해주세요.");
                            }
                        });
                    } else {
                        // Fallback if Kakao Map API is not ready
                        onChange({
                            ...data,
                            location: locationName,
                            address: fullAddress
                        });
                        alert("카카오 지도 API가 로드되지 않았습니다. 주소만 저장됩니다.");
                    }
                }
            }).open();
        };
        document.head.appendChild(script);
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    장소 이름
                </label>
                <input
                    type="text"
                    value={data.location || ''}
                    onChange={(e) => onChange({ ...data, location: e.target.value })}
                    placeholder="예: 서울시청, 결혼식장 이름"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    주소 검색
                </label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={data.address || ''}
                        readOnly
                        placeholder="주소 검색 버튼을 눌러주세요"
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500"
                    />
                    <button
                        type="button"
                        onClick={handleSearchAddress}
                        className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                    >
                        <Search size={18} />
                    </button>
                </div>

                {data.lat && data.lng ? (
                    <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <MapPin size={12} />
                        <span>좌표 설정됨 ({data.lat.toFixed(4)}, {data.lng.toFixed(4)})</span>
                    </div>
                ) : (
                    <p className="text-xs text-orange-500 mt-1">
                        * 주소를 검색하면 지도가 자동으로 설정됩니다.
                    </p>
                )}
            </div>

            {/* Preview Map (Static or Simple placeholder if API Key missing) */}
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-100 h-40 relative flex items-center justify-center">
                {data.lat && data.lng ? (
                    // In a real editor, we might load a mini map here.
                    // For now, static representation
                    <div className="text-center">
                        <MapPin className="mx-auto text-blue-500 mb-1" size={24} />
                        <span className="text-xs text-gray-500 font-medium">{data.location}</span>
                    </div>
                ) : (
                    <span className="text-gray-400 text-xs">지도 미리보기</span>
                )}
            </div>
        </div>
    );
}
