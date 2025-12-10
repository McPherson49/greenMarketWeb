"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Store, Users } from "lucide-react";
import { FaAd } from "react-icons/fa";

const bottomNavItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Post Ad", href: "/post-ad", icon: FaAd },
  { label: "Shop", href: "/shop", icon: Store },
  { label: "Community", href: "/community", icon: Users },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 shadow-lg">
      <div className="flex items-center justify-around px-2 py-3">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all ${
                isActive
                  ? "text-[#39B54A] font-medium"
                  : "text-neutral-600 hover:text-[#39B54A]"
              }`}
            >
              <Icon className={`size-5 ${isActive ? "scale-110" : ""}`} />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}