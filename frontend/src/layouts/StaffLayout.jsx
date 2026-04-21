import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Clock, FileEdit, FileText, Bell, LogOut, Menu, X, FileDigit ,BookOpen } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/features/auth/authSlice';
import { cn } from '@/utils/cn';

const StaffLayout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const menuItems = [
        { label: 'Dashboard', path: '/staff/dashboard', icon: LayoutDashboard },
        { label: 'Students', path: '/staff/students', icon: Users },
        { label: 'Attendance', path: '/staff/attendance', icon: Clock },
        { label: 'Enter Marks', path: '/staff/marks', icon: FileEdit },
        { label: 'Exams', path: '/staff/exams', icon: FileText },
        { label: 'Materials', path: '/staff/materials', icon: BookOpen },
        { label: 'Results', path: '/staff/results', icon: FileDigit },
        { label: 'Notices', path: '/staff/notices', icon: Bell },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transition-transform duration-300 transform",
                !isSidebarOpen && "-translate-x-full lg:translate-x-0 lg:w-20"
            )}>
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center px-6 border-b border-slate-800">
                        <div className="bg-primary size-8 rounded-lg flex items-center justify-center text-white font-bold shrink-0">M</div>
                        {isSidebarOpen && <span className="ml-3 font-bold text-white text-lg tracking-tight">GURU GLOBAL EDUCATION</span>}
                    </div>

                    <nav className="flex-1 p-4 space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link 
                                    key={item.path} 
                                    to={item.path}
                                    className={cn(
                                        "flex items-center px-3 py-2.5 rounded-lg transition-all",
                                        isActive ? "bg-primary text-white" : "hover:bg-slate-800 hover:text-white"
                                    )}
                                >
                                    <Icon className="size-5 shrink-0" />
                                    {isSidebarOpen && <span className="ml-3 font-medium text-sm">{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-slate-800">
                        <button onClick={() => dispatch(logout())} className="flex items-center w-full px-3 py-2 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                            <LogOut className="size-5 shrink-0" />
                            {isSidebarOpen && <span className="ml-3 font-medium text-sm">Logout</span>}
                        </button>
                    </div>
                </div>
            </aside>

            <main className={cn(
                "flex-1 flex flex-col transition-all duration-300",
                isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
            )}>
                <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 px-6 flex items-center justify-between shadow-sm">
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg">
                        <Menu className="size-5 text-slate-500" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-semibold">{user?.user?.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{user?.role}</p>
                        </div>
                        <div className="size-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                            {user?.user?.name?.charAt(0)}
                        </div>
                    </div>
                </header>
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
};

export default StaffLayout;
