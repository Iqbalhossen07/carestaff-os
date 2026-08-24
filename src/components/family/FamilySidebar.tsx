"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  HeartPulse, 
  Settings,
  Heart
} from "lucide-react";

export default function FamilySidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  const navItems = [
    { name: "My Resident", href: "/family", icon: LayoutDashboard },
  ];

  return (
    <aside className="w-64 h-full bg-[#0F172A] text-white flex flex-col shadow-xl">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-teal-600 p-2 rounded-lg">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">CareStaff OS</span>
      </div>

      <div className="px-6 pb-4">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Family Portal
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto pb-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/family" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-teal-600/10 text-teal-400 font-medium"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-teal-500" : "text-slate-400 group-hover:text-slate-300"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Link
          href="/family/profile"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200"
        >
          <Settings className="w-5 h-5 text-slate-400" />
          My Profile
        </Link>
      </div>
    </aside>
  );
}
