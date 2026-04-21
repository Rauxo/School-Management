// improved version based on your code
// reference: :contentReference[oaicite:0]{index=0}

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCheck, BookOpen, FileText,
  Bell, CreditCard, LogOut, Menu, X, ChevronRight, Settings, Award, Image as ImageIcon
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/features/auth/authSlice';
import { cn } from '@/utils/cn';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Students', path: '/admin/students', icon: Users },
    { label: 'Staff', path: '/admin/staff', icon: UserCheck },
    { label: 'Batches', path: '/admin/batches', icon: BookOpen },
    { label: 'Fees', path: '/admin/fees', icon: CreditCard },
    { label: 'Exams', path: '/admin/exams', icon: FileText },
    { label: 'Results', path: '/admin/results', icon: BookOpen },
    { label: 'Notices', path: '/admin/notices', icon: Bell },
    { label: 'Materials', path: '/admin/materials', icon: FileText },
    { label: 'Certificates', path: '/admin/certificates', icon: Award },
    { label: 'Banners', path: '/admin/banners', icon: ImageIcon },
  ];

  return (
    <div className="h-screen flex bg-slate-100 overflow-hidden">

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transition-all duration-300",
        isSidebarOpen ? "w-64" : "w-20",
        "lg:translate-x-0",
      )}>
        <div className="flex flex-col h-full">

          {/* Logo */}
          <div className="h-16 flex items-center px-4 border-b">
            <div className="bg-primary size-8 rounded-lg flex items-center justify-center text-white font-bold">
              M
            </div>
            {isSidebarOpen && (
              <span className="ml-3 font-bold text-lg">GURU GLOBAL EDUCATION</span>
            )}
          </div>

          {/* Menu - SCROLLABLE */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2.5 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary text-white shadow"
                      : "text-slate-500 hover:bg-slate-100"
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  {isSidebarOpen && (
                    <span className="ml-3 text-sm font-medium">
                      {item.label}
                    </span>
                  )}
                  {isSidebarOpen && isActive && (
                    <ChevronRight className="ml-auto size-4" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t">
            <button
              onClick={() => dispatch(logout())}
              className="flex items-center w-full px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="size-5" />
              {isSidebarOpen && (
                <span className="ml-3 text-sm">Logout</span>
              )}
            </button>
          </div>

        </div>
      </aside>

      {/* Main */}
      <main className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
      )}>

        {/* Navbar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-primary uppercase">{user?.role}</p>
            </div>
            <div className="size-10 bg-slate-200 rounded-full flex items-center justify-center font-bold">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Content - SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

      </main>
    </div>
  );
};

export default AdminLayout;