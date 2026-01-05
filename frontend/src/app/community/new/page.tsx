"use client";

import { useState } from "react";
import { ChevronLeft, Image as ImageIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("축제 후기");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = ["축제 후기", "전시회 추천", "공모전 정보", "박람회 후기", "질문"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          post: {
            title,
            content,
            category,
            image_url: imageUrl,
          },
        }),
      });

      if (res.ok) {
        router.push("/community");
      } else {
        alert("게시글 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-50 px-4 py-4 flex items-center justify-between border-b border-gray-100">
        <button onClick={() => router.back()} className="p-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-sm font-black uppercase tracking-widest text-gray-900">New Story</h1>
        <button
          onClick={handleSubmit}
          disabled={loading || !title || !content}
          className="bg-gray-900 text-white px-5 py-2 rounded-xl text-xs font-black disabled:opacity-30 uppercase tracking-widest active:scale-95 transition-all"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </header>

      <main className="mt-20 px-6 space-y-8">
        {/* Category Picker */}
        <div className="space-y-3 pt-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Choose Category</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-5 py-2 rounded-2xl text-xs font-black transition-all ${category === cat
                    ? "bg-gray-900 text-white shadow-lg"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
              >
                #{cat.replace(" ", "")}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full text-2xl font-black placeholder:text-gray-200 border-none px-0 focus:ring-0 leading-tight"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="회원님만의 특별한 이야기를 들려주세요 (축제 팁, 전시 후기 등)"
            className="w-full h-64 text-lg font-medium placeholder:text-gray-200 border-none px-0 focus:ring-0 resize-none leading-relaxed"
          ></textarea>
        </div>

        {/* URL Input (Optional) */}
        <div className="space-y-3 pb-20">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Add Visuals (URL)</p>
          <div className="relative group">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="이미지 URL을 입력하세요 (선택)"
              className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-xs font-bold focus:ring-2 focus:ring-green-500 transition-all pl-12"
            />
            <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
            {imageUrl && (
              <button
                onClick={() => setImageUrl("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          {imageUrl && (
            <div className="mt-4 relative aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-gray-200">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
