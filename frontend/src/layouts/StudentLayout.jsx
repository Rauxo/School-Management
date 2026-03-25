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
        <div className="min-h-screen bg-slate-50 flex">
            {/* Minimalist Sidebar for Students */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 transform",
                !isSidebarOpen && "-translate-x-full lg:translate-x-0 lg:w-20"
            )}>
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center px-6 border-b border-slate-100">
                        <div className="bg-primary size-8 rounded-lg flex items-center justify-center text-white font-bold shrink-0">I</div>
                        {isSidebarOpen && <span className="ml-3 font-bold text-slate-800 text-lg">InstiManage</span>}
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
                                        isActive ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-50"
                                    )}
                                >
                                    <Icon className="size-5 shrink-0" />
                                    {isSidebarOpen && <span className="ml-3 font-medium text-sm">{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-slate-100">
                        <button onClick={() => dispatch(logout())} className="flex items-center w-full px-3 py-2 text-slate-400 hover:text-red-500 rounded-lg transition-all">
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
                <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 px-6 flex items-center justify-between">
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
                        <Menu className="size-5 text-slate-500" />
                    </button>
                    <div className="ml-auto flex items-center gap-4">
                         <div className="text-right">
                            <p className="text-sm font-semibold">{user?.user?.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{user?.role}</p>
                        </div>
                        <div className="size-10 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400">
                            <User className="size-5" />
                        </div>
                    </div>
                </header>
                <div className="p-6">{children}</div>
            </main>
        </div>
    );
};

export default StudentLayout;
