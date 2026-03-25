import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import StaffLayout from '@/layouts/StaffLayout';
import StudentLayout from '@/layouts/StudentLayout';
import { useSelector } from 'react-redux';
import { useGetNoticesQuery } from '@/api/services/noticesApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Bell, Clock, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const Notices = () => {
    const { user } = useSelector(state => state.auth);
    const { data: notices, isLoading } = useGetNoticesQuery();

    const Layout = user?.role === 'admin' ? AdminLayout : user?.role === 'staff' ? StaffLayout : StudentLayout;

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Institutional Announcements</h1>
                <p className="text-slate-500 text-sm">Stay updated with the latest news and schedules.</p>
            </div>

            <div className="max-w-3xl space-y-4">
                {isLoading ? (
                    [1,2,3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />)
                ) : notices?.length > 0 ? (
                    notices.map((n) => (
                        <Card key={n._id} className="border-none shadow-sm hover:translate-x-1 transition-transform cursor-pointer group">
                            <CardContent className="p-5 flex gap-4 items-start">
                                <div className="p-3 bg-primary/5 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Bell size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-bold text-slate-800 leading-tight">{n.title}</h3>
                                        <Badge variant="outline" className="text-[10px] uppercase">{n.targetRole || 'Everyone'}</Badge>
                                    </div>
                                    <p className="text-sm text-slate-600 line-clamp-2 mb-3 leading-relaxed">{n.content}</p>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                        <Clock size={12} /> {new Date(n.createdAt).toLocaleString()}
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-slate-300 group-hover:text-primary mt-2" />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="p-12 text-center text-slate-400 italic">No notices posted recently.</div>
                )}
            </div>
        </Layout>
    );
};

export default Notices;
