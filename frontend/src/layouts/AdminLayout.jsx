import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, Users, UserCheck, BookOpen, 
    CreditCard, FileText, Bell, LogOut, Menu, X, ChevronRight 
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
        { label: 'Notices', path: '/admin/notices', icon: Bell },
        { label: 'Materials', path: '/admin/materials', icon: BookOpen },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 transform",
                !isSidebarOpen && "-translate-x-full lg:translate-x-0 lg:w-20"
            )}>
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center px-6 border-b border-slate-100">
                        <div className="bg-primary size-8 rounded-lg flex items-center justify-center text-white font-bold shrink-0">I</div>
                        {isSidebarOpen && <span className="ml-3 font-bold text-slate-800 text-lg tracking-tight truncate">InstiManage</span>}
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
                                        "flex items-center px-3 py-2.5 rounded-lg transition-all group",
                                        isActive 
                                            ? "bg-primary text-white shadow-md shadow-primary/20" 
                                            : "text-slate-500 hover:bg-slate-100"
                                    )}
                                >
                                    <Icon className={cn("size-5 shrink-0", !isActive && "group-hover:text-primary")} />
                                    {isSidebarOpen && <span className="ml-3 font-medium text-sm">{item.label}</span>}
                                    {isSidebarOpen && isActive && <ChevronRight className="ml-auto size-4" />}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-slate-100">
                        <button 
                            onClick={() => dispatch(logout())}
                            className="flex items-center w-full px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                            <LogOut className="size-5 shrink-0" />
                            {isSidebarOpen && <span className="ml-3 font-medium text-sm">Logout</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={cn(
                "flex-1 flex flex-col transition-all duration-300",
                isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
            )}>
                {/* Top Navbar */}
                <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 px-6 flex items-center justify-between">
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                        {isSidebarOpen ? <X className="size-5 text-slate-500" /> : <Menu className="size-5 text-slate-500" />}
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.user?.name}</p>
                            <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{user?.role}</p>
                        </div>
                        <div className="size-10 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 font-bold">
                            {user?.user?.name?.charAt(0)}
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
