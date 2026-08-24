"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu, LayoutDashboard, Users, CalendarDays, Pill } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-full lg:w-64 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top header (Minimal) */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-center shadow-sm z-30 relative gap-2">
          <img src="/logo.svg" alt="CareStaff" className="w-6 h-6 rounded-md" />
          <h1 className="text-lg font-black text-gray-900 tracking-tight">CareStaff OS</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-8 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 lg:hidden flex justify-around items-center h-16 z-30 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-blue-600 transition-colors"
          >
            <Menu className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold">Menu</span>
          </button>
          
          <Link href="/dashboard" className={`flex flex-col items-center justify-center w-full h-full transition-colors ${pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>
            <LayoutDashboard className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold">Home</span>
          </Link>

          <Link href="/dashboard/residents" className={`flex flex-col items-center justify-center w-full h-full transition-colors ${pathname.startsWith('/dashboard/residents') ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>
            <Users className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold">Residents</span>
          </Link>

          <Link href="/dashboard/rota" className={`flex flex-col items-center justify-center w-full h-full transition-colors ${pathname.startsWith('/dashboard/rota') ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>
            <CalendarDays className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold">Rota</span>
          </Link>

          <Link href="/dashboard/emar" className={`flex flex-col items-center justify-center w-full h-full transition-colors ${pathname.startsWith('/dashboard/emar') ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>
            <Pill className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold">eMAR</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
