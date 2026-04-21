import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, User, Clock, CreditCard,
  BookOpen, FileText, Bell, LogOut, Menu, X
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/features/auth/authSlice';
import { cn } from '@/utils/cn';

const StudentLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const menuItems = [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Attendance', path: '/student/attendance', icon: Clock },
    { label: 'Fees', path: '/student/fees', icon: CreditCard },
    { label: 'Materials', path: '/student/materials', icon: BookOpen },
    { label: 'Certificates', path: '/student/certificates', icon: FileText },
    { label: 'Notices', path: '/student/notices', icon: Bell },
  ];

  return (
    <div className="h-screen flex bg-slate-100 overflow-hidden">

      {/* Overlay (mobile) */}
      {isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 bg-white border-r transition-all duration-300",
        isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-20"
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

          {/* Menu - scrollable */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-2.5 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-slate-500 hover:bg-slate-100"
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  <span className={cn(
                    "ml-3 text-sm",
                    !isSidebarOpen && "lg:hidden"
                  )}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t">
            <button
              onClick={() => dispatch(logout())}
              className="flex items-center w-full px-3 py-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="size-5" />
              <span className={cn(
                "ml-3 text-sm",
                !isSidebarOpen && "lg:hidden"
              )}>
                Logout
              </span>
            </button>
          </div>

        </div>
      </aside>

      {/* Main */}
      <main className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        "lg:ml-20",
        isSidebarOpen && "lg:ml-64"
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
            <div className="text-right">
              <p className="text-sm font-semibold">{user?.user?.name}</p>
              <p className="text-xs text-slate-400 uppercase">{user?.role}</p>
            </div>

            <div className="size-10 bg-slate-200 rounded-full flex items-center justify-center">
              <User size={18} />
            </div>
          </div>
        </header>

        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

      </main>
    </div>
  );
};

export default StudentLayout;