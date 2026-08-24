"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  CalendarDays, 
  Pill, 
  FileText,
  Settings,
  UtensilsCrossed,
  PhoneCall,
  Wrench,
  LogOut 
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Roles & Permissions", href: "/dashboard/roles", icon: ShieldCheck },
  { name: "Staff Management", href: "/dashboard/staff", icon: Users },
  { name: "Residents", href: "/dashboard/residents", icon: Users },
  { name: "Sales & Admissions", href: "/dashboard/crm", icon: PhoneCall },
  { name: "Rota & Shifts", href: "/dashboard/rota", icon: CalendarDays },
  { name: "eMAR Overview", href: "/dashboard/emar", icon: Pill },
  { name: "Kitchen & Nutrition", href: "/dashboard/kitchen", icon: UtensilsCrossed },
  { name: "Maintenance", href: "/dashboard/maintenance", icon: Wrench },
  { name: "Reports & Compliance", href: "/dashboard/reports", icon: FileText },
  { name: "Global Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-400">CareStaff OS</h2>
        <p className="text-gray-400 text-sm mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
