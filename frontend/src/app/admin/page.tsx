"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Globe,
  Calendar,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Search,
  Filter,
  LogOut,
  Menu,
  LayoutDashboard,
  Bell,
  CheckCircle,
  AlertCircle,
  Lock,
  User,
  ArrowRight,
  Edit,
  Trash2
} from "lucide-react";
import Image from "next/image";

interface CrawledEvent {
  id: number;
  title: string;
  category: string;
  location: string;
  start_date: string;
  end_date: string;
  approval_status: string;
  source_url: string;
  crawled_at: string;
  image_url?: string;
  price?: string;
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [loginError, setLoginError] = useState("");

  const [events, setEvents] = useState<CrawledEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CrawledEvent | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchEvents();
    }
  }, [currentTab, isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const isAdmin = (loginId === "admin" && loginPw === "admin1234!");
    const isSuperAdmin = (loginId === "juuuno@naver.com" && loginPw === "elwkdlselfoq1!");

    if (isAdmin || isSuperAdmin) {
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("ID/이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginId("");
    setLoginPw("");
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/admin/events?status=${currentTab}`);
      if (res.ok) {
        setEvents(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: number, action: "approve" | "reject") => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/admin/events/${id}/${action}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        setEvents(events.filter(e => e.id !== id));
      }
    } catch (error) {
      console.error(`Failed to ${action} event:`, error);
    }
  };

  const handleBulkApprove = async () => {
    const ids = events.filter(e => e.approval_status === "pending").map(e => e.id);
    if (ids.length === 0) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/admin/events/bulk_approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids })
      });
      if (res.ok) {
        setEvents([]);
      }
    } catch (error) {
      console.error("Bulk approve failed:", error);
    }
  };

  const handleFetch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/admin/events/fetch`, { method: "POST" });
      if (res.ok) {
        alert("데이터 수집이 시작되었습니다. 잠시 후 새로고침 해주세요.");
        fetchEvents();
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNormalize = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/admin/events/normalize`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        alert(data.message);
        fetchEvents();
      }
    } catch (error) {
      console.error("Normalize failed:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/admin/events/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEvents(events.filter(e => e.id !== id));
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleUpdate = async (event: CrawledEvent) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/admin/events/${event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event })
      });
      if (res.ok) {
        setEvents(events.map(e => e.id === event.id ? event : e));
        setEditingEvent(null);
        alert("수정되었습니다.");
      } else {
        alert("수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'festival': return 'bg-pink-50 text-pink-600 border-pink-100';
      case 'exhibition': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'art': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'contest': return 'bg-orange-50 text-orange-600 border-orange-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  // --- LOGIN UI ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100 animate-in zoom-in duration-500">
              <ShieldCheck size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tighter">가보자고! Admin</h1>
            <p className="text-gray-500 font-medium">관리자 계정으로 로그인해 주세요.</p>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Admin ID / Email</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all font-bold text-gray-900 placeholder:text-gray-400"
                    placeholder="아이디를 입력하세요"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all font-bold text-gray-900 placeholder:text-gray-400"
                    placeholder="비밀번호를 입력하세요"
                    value={loginPw}
                    onChange={(e) => setLoginPw(e.target.value)}
                    required
                  />
                </div>
              </div>

              {loginError && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={14} /> {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-green-100 hover:bg-green-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Login <ArrowRight size={20} />
              </button>
            </form>
          </div>

          <p className="text-center mt-8 text-sm text-gray-400 font-medium">
            권한이 없으신가요? <span className="text-green-500 cursor-pointer hover:underline">시스템 관리자 문의</span>
          </p>
        </div>
      </div>
    );
  }

  // --- DASHBOARD UI ---
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar (Desktop) */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 transform 
        lg:relative lg:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-green-600 font-black text-xl mb-1">
              <ShieldCheck size={28} />
              가보자고!
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Admin Control Center</p>
          </div>
          <button className="lg:hidden text-gray-400" onClick={() => setIsMobileMenuOpen(false)}>
            <XCircle size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => { setCurrentTab("pending"); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentTab === "pending" ? "bg-green-50 text-green-700" : "text-gray-500 hover:bg-gray-50"}`}
          >
            <div className="flex items-center gap-3">
              <Clock size={18} /> 투어 검수
            </div>
            {currentTab === "pending" && events.length > 0 && (
              <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full">{events.length}</span>
            )}
          </button>

          <button
            onClick={() => { setCurrentTab("approved"); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentTab === "approved" ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:bg-gray-50"}`}
          >
            <CheckCircle2 size={18} /> 승인 완료
          </button>

          <button
            onClick={() => { setCurrentTab("rejected"); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentTab === "rejected" ? "bg-red-50 text-red-700" : "text-gray-500 hover:bg-gray-50"}`}
          >
            <XCircle size={18} /> 반려 목록
          </button>

          <div className="pt-4 mt-4 border-t border-gray-100">
            <p className="px-4 mb-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Data Management</p>
            <button
              onClick={handleFetch}
              disabled={loading}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-orange-50 hover:text-orange-700 transition-all disabled:opacity-50"
            >
              <Globe size={18} /> 수동 데이터 수집 실행
            </button>
            <button
              onClick={handleNormalize}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-purple-50 hover:text-purple-700 transition-all"
            >
              <LayoutDashboard size={18} /> 데이터 정규화
            </button>
          </div>
        </nav>

        <div className="p-4 space-y-2 border-t border-gray-100">
          <div className="bg-gray-900 rounded-2xl p-4 text-white">
            <p className="text-xs font-bold text-gray-400 mb-2">오늘 수집 현황</p>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-black">24건</span>
              <span className="text-[10px] text-green-400 font-bold mb-1">↑ 12%</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all mt-4"
          >
            <LogOut size={18} /> 로그아웃
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header (Mobile) */}
        <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2 text-green-600 font-black">
            <ShieldCheck size={24} /> 가보자고!
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} className="text-gray-600" />
          </button>
        </header>

        {/* Header (Desktop & Mobile Content) */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-10 scrollbar-hide">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-gray-900 mb-1 lg:mb-2">
                {currentTab === "pending" ? "이벤트 검수 대기" : currentTab === "approved" ? "승인된 이벤트" : "반려된 이벤트"}
              </h1>
              <p className="text-xs lg:text-sm text-gray-500 font-medium">수집된 데이터를 검토하고 사용자에게 공개하세요.</p>
            </div>

            {currentTab === "pending" && events.length > 0 && (
              <button
                onClick={handleBulkApprove}
                className="w-full md:w-auto bg-green-500 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-green-100 hover:bg-green-600 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} /> 일괄 승인
              </button>
            )}
          </header>

          {/* Filters & Search */}
          <div className="bg-white p-3 lg:p-4 rounded-2xl border border-gray-200 shadow-sm mb-8 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="이벤트명 또는 지역 검색..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-green-500 transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50">
              <Filter size={16} /> 상세필터
            </button>
          </div>

          {/* Content List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-10 h-10 border-4 border-green-100 border-t-green-500 rounded-full animate-spin" />
              <p className="text-gray-400 font-bold text-xs animate-pulse uppercase tracking-widest">Loading...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="bg-white rounded-4xl border-2 border-dashed border-gray-200 py-24 text-center px-4">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="text-gray-300" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">데이터가 없습니다.</h3>
              <p className="text-gray-400 font-medium text-xs">새로운 이벤트를 기다려주세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white group rounded-3xl border border-gray-200 p-4 lg:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 lg:gap-8 hover:border-green-500 hover:shadow-xl hover:shadow-green-50/50 transition-all duration-300"
                >
                  {/* Thumb/Icon */}
                  <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center text-2xl shadow-sm border overflow-hidden relative ${getCategoryTheme(event.category)}`}>
                    {event.image_url ? (
                      <Image
                        src={event.image_url}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <>{event.category === 'festival' ? '🎉' : event.category === 'exhibition' ? '🏢' : event.category === 'art' ? '🎨' : '🏆'}</>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border ${getCategoryTheme(event.category)}`}>
                        {event.category}
                      </span>
                      <span className="text-[9px] text-gray-400 font-bold flex items-center gap-1">
                        <Clock size={10} /> {new Date(event.crawled_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors truncate">
                      {event.title}
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-x-4 gap-y-1 text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1.5 shrink-0"><Calendar size={14} className="text-gray-400" /> {new Date(event.start_date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5 truncate"><MapPin size={14} className="text-gray-400" /> {event.location}</span>
                      <a href={event.source_url} target="_blank" className="flex items-center gap-1.5 text-blue-500 hover:underline"><Globe size={14} /> 링크 <ExternalLink size={10} /></a>
                    </div>
                  </div>

                  {/* Actions */}
                  {currentTab === "pending" ? (
                    <div className="flex gap-2 w-full md:w-auto">
                      <button
                        onClick={() => handleAction(event.id, "reject")}
                        className="flex-1 md:w-12 md:h-12 md:flex-none aspect-square rounded-xl md:rounded-2xl border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
                      >
                        <XCircle size={20} />
                        <span className="md:hidden ml-2 font-bold text-sm">반려</span>
                      </button>
                      <button
                        onClick={() => handleAction(event.id, "approve")}
                        className="flex-3 md:w-12 md:h-12 md:flex-none aspect-square rounded-xl md:rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-100 hover:bg-green-600 transition-all font-bold"
                      >
                        <CheckCircle2 size={20} />
                        <span className="md:hidden ml-2 text-sm">최종 승인</span>
                      </button>
                    </div>
                  ) : currentTab === "approved" ? (
                    <div className="flex gap-2 w-full md:w-auto">
                      <button
                        onClick={() => setEditingEvent(event)}
                        className="flex-1 md:w-10 md:h-10 md:flex-none aspect-square rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-all"
                        title="수정"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('정말 삭제하시겠습니까?')) {
                            handleDelete(event.id);
                          }
                        }}
                        className="flex-1 md:w-10 md:h-10 md:flex-none aspect-square rounded-xl border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"
                        title="삭제"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full md:w-auto px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-red-50 text-red-600">
                      <AlertCircle size={14} />
                      반려 처리됨
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingEvent(null)} />
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 lg:p-8 animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-gray-900 mb-6">이벤트 수정</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdate(editingEvent);
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1">제목</label>
                  <input
                    type="text"
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">시작일</label>
                  <input
                    type="date"
                    value={editingEvent.start_date.split('T')[0]}
                    onChange={(e) => setEditingEvent({ ...editingEvent, start_date: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">종료일</label>
                  <input
                    type="date"
                    value={editingEvent.end_date.split('T')[0]}
                    onChange={(e) => setEditingEvent({ ...editingEvent, end_date: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1">장소</label>
                  <input
                    type="text"
                    value={editingEvent.location}
                    onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1">이미지 URL</label>
                  <input
                    type="text"
                    value={editingEvent.image_url || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, image_url: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-bold bg-green-500 text-white shadow-lg shadow-green-100 hover:bg-green-600 transition-all"
                >
                  저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
