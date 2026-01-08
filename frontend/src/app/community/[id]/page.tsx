"use client";

import { useEffect, useState, use } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  ChevronLeft,
  Send,
  CornerDownRight,
  MoreHorizontal,
  Plus
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface UserInfo {
  id: number;
  email: string;
}

interface Comment {
  id: number;
  content: string;
  user: UserInfo;
  created_at: string;
  parent_id?: number;
  replies: Comment[];
}

interface PostDetail {
  id: number;
  title: string;
  content: string;
  category: string;
  image_url?: string;
  created_at: string;
  user: UserInfo;
  comments: Comment[];
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/posts/${id}`);
      if (res.ok) {
        setPost(await res.json());
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/posts/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comment: {
            content: newComment,
            parent_id: replyTo,
          },
        }),
      });

      if (res.ok) {
        setNewComment("");
        setReplyTo(null);
        fetchPost();
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
  </div>;

  if (!post) return <div>Post not found</div>;

  return (
    <div className="bg-white min-h-screen pb-32">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl z-50 px-4 py-4 flex items-center gap-4 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <span className="font-black text-sm uppercase tracking-widest text-gray-400">Post View</span>
      </header>

      <div className="mt-20 px-6">
        {/* Author info */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gray-900 border-4 border-gray-50 flex items-center justify-center text-white font-black">
            {post.user.email[0].toUpperCase()}
          </div>
          <div>
            <p className="font-black text-gray-900">{post.user.email.split('@')[0]}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {new Date(post.created_at).toLocaleString()} · {post.category}
            </p>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-black text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>
        <p className="text-gray-700 font-medium leading-relaxed mb-6 whitespace-pre-wrap">
          {post.content}
        </p>

        {post.image_url && (
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden mb-8 shadow-2xl shadow-gray-200">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-6 py-6 border-y border-gray-50 mb-8">
          <div className="flex items-center gap-2 text-gray-400">
            <Heart size={22} className="stroke-[2.5]" />
            <span className="text-sm font-black">0</span>
          </div>
          <div className="flex items-center gap-2 text-green-500">
            <MessageCircle size={22} className="stroke-[2.5]" />
            <span className="text-sm font-black">{post.comments.length}</span>
          </div>
          <button className="ml-auto text-gray-300">
            <Share2 size={22} />
          </button>
        </div>

        {/* Comments Section */}
        <div className="space-y-8">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            Comments <span className="text-green-500 text-sm font-black">{post.comments.length}</span>
          </h2>

          <div className="space-y-6">
            {post.comments.filter(c => !c.parent_id).map(comment => (
              <CommentCard
                key={comment.id}
                comment={comment}
                onReply={(id) => {
                  setReplyTo(id);
                  document.getElementById('comment-input')?.focus();
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Comment Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-safe z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        {replyTo && (
          <div className="flex items-center justify-between px-2 mb-2 bg-gray-50 py-1.5 rounded-xl">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <CornerDownRight size={12} />
              Replying to someone...
            </div>
            <button onClick={() => setReplyTo(null)} className="text-[10px] font-black text-gray-900 underline">CANCEL</button>
          </div>
        )}
        <form onSubmit={handleSubmitComment} className="flex gap-3">
          <input
            id="comment-input"
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={replyTo ? "답글을 남겨보세요..." : "댓글을 남겨보세요..."}
            className="flex-1 bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-green-500 transition-all"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center disabled:opacity-30 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gray-200"
          >
            <Send size={20} className="stroke-[2.5]" />
          </button>
        </form>
      </div>
    </div>
  );
}

function CommentCard({ comment, onReply, isReply = false }: { comment: Comment, onReply: (id: number) => void, isReply?: boolean }) {
  return (
    <div className={`space-y-4 ${isReply ? 'ml-8' : ''}`}>
      <div className="flex gap-3">
        {!isReply && (
          <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0 flex items-center justify-center text-gray-400 font-bold text-sm">
            {comment.user.email[0].toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="font-black text-gray-900 text-xs">
              {comment.user.email.split('@')[0]}
              {isReply && <span className="ml-2 px-1.5 py-0.5 bg-gray-50 text-[8px] text-gray-400 rounded-md">REPLY</span>}
            </p>
            <span className="text-[10px] font-bold text-gray-300">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium leading-relaxed">
            {comment.content}
          </p>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => onReply(comment.id)}
              className="text-[10px] font-black text-gray-400 uppercase hover:text-green-500 transition-colors"
            >
              Reply
            </button>
            <button className="text-[10px] font-black text-gray-400 uppercase">
              Like
            </button>
          </div>
        </div>
        <button className="text-gray-200">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-4 pt-2 border-l-2 border-gray-50">
          {comment.replies.map(reply => (
            <CommentCard key={reply.id} comment={reply} onReply={onReply} isReply />
          ))}
        </div>
      )}
    </div>
  );
}
