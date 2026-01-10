import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { uploadInvitationImage } from '@/utils/upload';

interface ImageUploadFieldProps {
    label: string;
    url: string;
    onChange: (url: string) => void;
}

export default function ImageUploadField({ label, url, onChange }: ImageUploadFieldProps) {
    const params = useParams();
    const invitationId = params?.id as string;
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !invitationId) return;

        setIsUploading(true);
        try {
            const uploadedUrl = await uploadInvitationImage(invitationId, file);
            onChange(uploadedUrl);
        } catch (error) {
            console.error("Upload failed", error);
            alert("이미지 업로드에 실패했습니다.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500">{label}</label>

            {url ? (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            <Upload size={16} />
                        </button>
                        <button
                            onClick={() => onChange('')}
                            className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-blue-50 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-blue-500 transition-all"
                >
                    {isUploading ? (
                        <Loader2 size={24} className="animate-spin" />
                    ) : (
                        <>
                            <ImageIcon size={24} />
                            <span className="text-xs font-bold">이미지 업로드</span>
                        </>
                    )}
                </button>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />
        </div>
    );
}
