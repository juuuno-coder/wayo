import React from 'react';
import { CheckSquare } from 'lucide-react';

interface RSVPBlockEditorProps {
    data: {
        buttonText?: string;
        deadline?: string;
        fields?: {
            name: boolean;
            message: boolean;
            phone: boolean;
        };
    };
    onChange: (data: any) => void;
}

export default function RSVPBlockEditor({ data, onChange }: RSVPBlockEditorProps) {
    const buttonText = data.buttonText || '참석 여부 알려주기';
    const fields = data.fields || { name: true, message: true, phone: false };

    const handleFieldToggle = (field: keyof typeof fields) => {
        onChange({
            ...data,
            fields: {
                ...fields,
                [field]: !fields[field]
            }
        });
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    버튼 텍스트
                </label>
                <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => onChange({ ...data, buttonText: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="참석 여부 알려주기"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    응답 마감일 (선택사항)
                </label>
                <input
                    type="date"
                    value={data.deadline || ''}
                    onChange={(e) => onChange({ ...data, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    표시할 필드
                </label>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={fields.name}
                            onChange={() => handleFieldToggle('name')}
                            className="w-4 h-4 text-blue-600 rounded"
                        />
                        <CheckSquare size={16} className={fields.name ? 'text-blue-600' : 'text-gray-400'} />
                        <span className="text-sm">이름 (필수)</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={fields.phone}
                            onChange={() => handleFieldToggle('phone')}
                            className="w-4 h-4 text-blue-600 rounded"
                        />
                        <CheckSquare size={16} className={fields.phone ? 'text-blue-600' : 'text-gray-400'} />
                        <span className="text-sm">연락처</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={fields.message}
                            onChange={() => handleFieldToggle('message')}
                            className="w-4 h-4 text-blue-600 rounded"
                        />
                        <CheckSquare size={16} className={fields.message ? 'text-blue-600' : 'text-gray-400'} />
                        <span className="text-sm">축하 메시지</span>
                    </label>
                </div>
            </div>

            {/* Preview */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <p className="text-xs text-gray-500 mb-2">미리보기</p>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">참석 여부를 알려주세요</h3>
                    <div className="space-y-2">
                        {fields.name && (
                            <div className="h-8 bg-gray-100 rounded"></div>
                        )}
                        {fields.phone && (
                            <div className="h-8 bg-gray-100 rounded"></div>
                        )}
                        {fields.message && (
                            <div className="h-16 bg-gray-100 rounded"></div>
                        )}
                        <div className="h-10 bg-blue-500 rounded text-white flex items-center justify-center text-sm font-bold">
                            {buttonText}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
