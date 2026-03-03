"use client";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Home, Users, MessageCircle, CircleUser } from "lucide-react";
import { FaAd } from "react-icons/fa";
import { useState, useEffect } from "react";

const bottomNavItems = [
  { label: "Home",      href: "/",                 icon: Home },
  { label: "Message",   href: "/profile?tab=chat", icon: MessageCircle },
  { label: "Post Ad",   href: "/post-ad",           icon: FaAd },
  { label: "Profile",   href: "/profile",           icon: CircleUser },
  { label: "Community", href: "/community",         icon: Users },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 10) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const isActive = (href: string) => {
    // Message tab: active only when on /profile with ?tab=chat
    if (href === "/profile?tab=chat") {
      return pathname === "/profile" && searchParams?.get("tab") === "chat";
    }
    // Profile tab: active on /profile but NOT when ?tab=chat (that's Message)
    if (href === "/profile") {
      return pathname === "/profile" && searchParams?.get("tab") !== "chat";
    }
    // Home: exact match only
    if (href === "/") {
      return pathname === "/";
    }
    // Everything else: starts with href
    return pathname?.startsWith(href) ?? false;
  };

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 shadow-lg transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center justify-around px-2 py-3">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all ${
                active
                  ? "text-[#39B54A] font-medium"
                  : "text-neutral-600 hover:text-[#39B54A]"
              }`}
            >
              <Icon className={`size-5 ${active ? "scale-110" : ""}`} />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}