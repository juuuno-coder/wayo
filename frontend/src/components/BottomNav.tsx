"use client";

import {
  Home,
  Search,
  Book,
  User,
  MessageCircle,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  // 로그인 페이지 등 탭바가 필요 없는 경로 제외
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname?.startsWith("/admin")
  )
    return null;

  return (
    <nav className="fixed lg:absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-200 pb-safe pb-4 pt-3 px-6 z-50">
      <div className="flex justify-between items-center">
        <NavItem
          href="/"
          icon={<Home size={24} />}
          label="홈"
          active={isActive("/")}
        />
        <NavItem
          href="/search"
          icon={<Search size={24} />}
          label="검색"
          active={isActive("/search")}
        />
        <NavItem
          href="/community"
          icon={<MessageCircle size={24} />}
          label="커뮤니티"
          active={isActive("/community")}
        />
        <NavItem
          href="/passport"
          icon={<Book size={24} />}
          label="투어북"
          active={isActive("/passport")}
        />
        <NavItem
          href="/profile"
          icon={<User size={24} />}
          label="마이"
          active={isActive("/profile")}
        />
      </div>
    </nav>
  );
}

function NavItem({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1 min-w-[60px] transition-colors duration-200 group"
    >
      <div
        className={`${
          active ? "text-green-500" : "text-gray-400 group-hover:text-gray-600"
        }`}
      >
        {icon}
      </div>
      <span
        className={`text-xs font-medium ${
          active ? "text-green-500" : "text-gray-500 group-hover:text-gray-700"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}
