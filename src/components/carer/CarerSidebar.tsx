"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Pill, 
  MessageSquareDiff, 
  AlertOctagon, 
  Settings,
  HeartPulse,
  MessageSquare
} from "lucide-react";

export default function CarerSidebar({ dbUser, onClose }: { dbUser?: any, onClose?: () => void }) {
  const pathname = usePathname();
  const role = dbUser?.role;
  const isSuperAdmin = role?.isSuperAdmin;

  const allNavItems = [
    { name: "Dashboard", href: "/carer", icon: LayoutDashboard, show: isSuperAdmin || role?.canViewDashboard !== false },
    { name: "My Rota", href: "/carer/rota", icon: CalendarDays, show: isSuperAdmin || role?.canEditRota !== false }, // Default true for basic view if needed, but let's map strictly to canEditRota
    { name: "Residents & Care", href: "/carer/residents", icon: HeartPulse, show: isSuperAdmin || role?.canViewResidents !== false },
    { name: "eMAR Tasks", href: "/carer/emar", icon: Pill, show: isSuperAdmin || role?.canViewEmar },
    { name: "Handovers", href: "/carer/handovers", icon: MessageSquareDiff, show: isSuperAdmin || role?.canViewResidents !== false },
    { name: "Report Incident", href: "/carer/incidents", icon: AlertOctagon, show: isSuperAdmin || role?.canManageSafeguarding !== false },
    { name: "Messages", href: "/carer/messages", icon: MessageSquare, show: isSuperAdmin || role?.canManageMessages !== false },
  ];

  // We filter items where show is not explicitly false
  // For safety, some items like Dashboard, Rota, Residents, Incidents might be loosely permitted if role isn't completely strictly defined.
  // We use !== false so that if a role doesn't exist (undefined), standard workers still see basic items.
  const navItems = allNavItems.filter(item => {
    if (!role) return true; // If no custom role assigned, standard worker sees all defaults
    if (isSuperAdmin) return true;
    
    // Strict mapping based on permissions
    if (item.name === "Dashboard" && !role.canViewDashboard) return false;
    if (item.name === "My Rota" && !role.canEditRota) return false; 
    if (item.name === "Residents & Care" && !role.canViewResidents) return false;
    if (item.name === "eMAR Tasks" && !role.canViewEmar) return false;
    if (item.name === "Handovers" && !role.canViewResidents) return false;
    if (item.name === "Report Incident" && !role.canManageSafeguarding) return false;
    if (item.name === "Messages" && !role.canManageMessages) return false;
    
    return true;
  });

  return (
    <aside className="w-64 h-full bg-[#0F172A] text-white flex flex-col shadow-xl">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <HeartPulse className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">CareStaff OS</span>
      </div>

      <div className="px-6 pb-4">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Carer Panel
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto pb-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/carer" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-blue-600/10 text-blue-400 font-medium"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-blue-500" : "text-slate-400 group-hover:text-slate-300"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        {(!role || isSuperAdmin || role.canManageProfile) && (
          <Link
            href="/carer/profile"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200"
          >
            <Settings className="w-5 h-5 text-slate-400" />
            My Profile
          </Link>
        )}
      </div>
    </aside>
  );
}
