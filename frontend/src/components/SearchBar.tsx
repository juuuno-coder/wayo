"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchBar({ placeholder = "축제, 전시회, 공모전 검색" }: { placeholder?: string }) {
  const router = useRouter();

  return (
    <div 
      onClick={() => router.push('/search')}
      className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:border-green-300 transition-colors"
    >
      <Search size={20} className="text-gray-400" />
      <span className="text-gray-400 text-sm flex-1">{placeholder}</span>
      <button className="bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-green-600 transition-colors">
        검색
      </button>
    </div>
  );
}
