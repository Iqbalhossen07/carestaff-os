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
  UserCheck,
  ShieldAlert,
  PoundSterling,
  LogOut,
  MessageSquare
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function Sidebar({ dbUser, onClose }: { dbUser?: any, onClose?: () => void }) {
  const pathname = usePathname();
  const role = dbUser?.role;
  const isSuperAdmin = dbUser?.userType === "SUPER_ADMIN" || role?.isSuperAdmin;

  const allNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, perm: role?.canViewDashboard },
    { name: "Roles & Permissions", href: "/dashboard/roles", icon: ShieldCheck, perm: role?.canManageRoles },
    { name: "Staff Management", href: "/dashboard/staff", icon: Users, perm: role?.canManageStaff },
    { name: "Residents", href: "/dashboard/residents", icon: Users, perm: role?.canViewResidents },
    { name: "Sales & Admissions", href: "/dashboard/crm", icon: PhoneCall, perm: role?.canManageCRM },
    { name: "Rota & Shifts", href: "/dashboard/rota", icon: CalendarDays, perm: role?.canEditRota },
    { name: "eMAR Overview", href: "/dashboard/emar", icon: Pill, perm: role?.canViewEmar },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare, perm: role?.canManageMessages },
    { name: "Kitchen & Nutrition", href: "/dashboard/kitchen", icon: UtensilsCrossed, perm: role?.canManageKitchen },
    { name: "Maintenance", href: "/dashboard/maintenance", icon: Wrench, perm: role?.canManageMaintenance },
    { name: "Visitor Logs", href: "/dashboard/visitors", icon: UserCheck, perm: role?.canManageVisitors },
    { name: "Safeguarding", href: "/dashboard/incidents", icon: ShieldAlert, perm: role?.canManageSafeguarding },
    { name: "Finance & Billing", href: "/dashboard/finance", icon: PoundSterling, perm: role?.canViewFinance },
    { name: "Reports & Compliance", href: "/dashboard/reports", icon: FileText, perm: role?.canManageReports },
    { name: "My Profile", href: "/dashboard/profile", icon: UserCheck, perm: role?.canManageProfile },
    { name: "Global Settings", href: "/dashboard/settings", icon: Settings, perm: role?.canManageSettings },
  ];

  const navItems = allNavItems.filter(item => {
    if (isSuperAdmin) return true;
    if (!role) return true; // fallback
    return item.perm === true;
  });

  return (
    <aside className="w-full lg:w-64 bg-gray-900 text-white min-h-screen flex flex-col h-full overflow-y-auto">
      <div className="p-6 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="CareStaff OS Logo" className="w-8 h-8 rounded-lg shadow-sm" />
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">CareStaff OS</h2>
            <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mt-0.5">Admin Panel</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 bg-gray-800 rounded text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-1 mb-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === '/dashboard' 
            ? pathname === '/dashboard' 
            : (pathname === item.href || pathname.startsWith(item.href + '/'));
            
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
