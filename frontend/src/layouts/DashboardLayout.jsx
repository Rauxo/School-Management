import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/authSlice';
import { LayoutDashboard, Users, UserCheck, CreditCard, BookOpen, Bell, FileText, LogOut } from 'lucide-react';

const DashboardLayout = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const menuItems = {
        admin: [
            { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
            { icon: Users, label: 'Students', path: '/students' },
            { icon: UserCheck, label: 'Staff', path: '/staff' },
            { icon: CreditCard, label: 'Fees', path: '/fees' },
            { icon: BookOpen, label: 'Exams', path: '/exams' },
            { icon: Bell, label: 'Notices', path: '/notices' },
            { icon: FileText, label: 'Reports', path: '/reports' },
        ],
        staff: [
            { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
            { icon: UserCheck, label: 'Attendance', path: '/attendance' },
            { icon: BookOpen, label: 'Exams', path: '/exams' },
            { icon: Bell, label: 'Notices', path: '/notices' },
        ],
        student: [
            { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
            { icon: fileText, label: 'Results', path: '/results' },
            { icon: BookOpen, label: 'Materials', path: '/materials' },
            { icon: Bell, label: 'Notices', path: '/notices' },
        ]
    };

    const currentMenu = menuItems[user?.role] || [];

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-xl font-bold text-primary">EduManage</h1>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {currentMenu.map((item, idx) => (
                        <a
                            key={idx}
                            href={item.path}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 hover:text-primary transition-colors"
                        >
                            <item.icon size={18} />
                            {item.label}
                        </a>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-100">
                    <button 
                        onClick={() => dispatch(logout())}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-500">Welcome,</span>
                        <span className="text-sm font-bold text-slate-900">{user?.name}</span>
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                            {user?.role}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Profile placeholder */}
                        <div className="w-8 h-8 rounded-full bg-slate-200" />
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
