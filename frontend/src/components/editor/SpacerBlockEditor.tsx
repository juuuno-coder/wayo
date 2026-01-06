import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface SpacerBlockEditorProps {
    data: {
        height: number;
    };
    onChange: (data: any) => void;
}

export default function SpacerBlockEditor({ data, onChange }: SpacerBlockEditorProps) {
    const height = data.height || 40;

    const handleHeightChange = (newHeight: number) => {
        onChange({ ...data, height: Math.max(8, Math.min(200, newHeight)) });
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    간격 높이
                </label>
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => handleHeightChange(height - 8)}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <Minus size={16} />
                    </button>

                    <input
                        type="range"
                        min="8"
                        max="200"
                        step="8"
                        value={height}
                        onChange={(e) => handleHeightChange(Number(e.target.value))}
                        className="flex-1"
                    />

                    <button
                        type="button"
                        onClick={() => handleHeightChange(height + 8)}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <Plus size={16} />
                    </button>

                    <span className="text-sm font-medium text-gray-700 w-16 text-right">
                        {height}px
                    </span>
                </div>
            </div>

            {/* Preview */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <p className="text-xs text-gray-500 mb-2">미리보기</p>
                <div className="bg-white border-2 border-dashed border-gray-300 rounded" style={{ height: `${height}px` }} />
            </div>
        </div>
    );
}
