"use client";

import { useState, useRef, useEffect } from "react";
import FamilySidebar from "./FamilySidebar";
import { Menu, LayoutDashboard, HeartPulse, Pill, ChevronDown, User, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

function FamilyTopbar({ dbUser }: { dbUser?: any }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const name = dbUser?.name;
  const email = dbUser?.email;
  const image = dbUser?.image;

  return (
    <header className="hidden lg:flex items-center justify-end px-8 py-4 bg-white border-b border-gray-200 z-10">
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-gray-200"
        >
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">{name}</p>
            <p className="text-xs text-teal-600 font-bold">Family Member</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
            {image ? (
              <img src={image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-teal-600" />
            )}
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
            <div className="px-4 py-2 border-b border-gray-100 mb-2">
              <p className="text-sm font-bold text-gray-900">{name}</p>
              <p className="text-xs text-gray-500 truncate">{email}</p>
            </div>
            <Link 
              href="/family/profile"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors"
            >
              <User className="w-4 h-4" /> My Profile
            </Link>
            <div className="border-t border-gray-100 my-1"></div>
            <button 
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default function FamilyLayoutClient({ children, dbUser }: { children: React.ReactNode, dbUser?: any }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-full lg:w-64 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <FamilySidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Desktop Topbar */}
        <FamilyTopbar dbUser={dbUser} />

        {/* Mobile top header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-center shadow-sm z-30 relative gap-2">
          <HeartPulse className="w-6 h-6 text-teal-600" />
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
            className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-teal-600 transition-colors"
          >
            <Menu className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold">Menu</span>
          </button>
          
          <Link href="/family" className={`flex flex-col items-center justify-center w-full h-full transition-colors ${pathname === '/family' ? 'text-teal-600' : 'text-gray-500 hover:text-teal-600'}`}>
            <LayoutDashboard className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold">Home</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
