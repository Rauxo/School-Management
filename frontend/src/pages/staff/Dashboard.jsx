import React from 'react';
import StaffLayout from '@/layouts/StaffLayout';
import StatCard from '@/components/common/StatCard';
import { Users, Clock, FileEdit, BarChart3, Bell, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useGetStaffDashboardStatsQuery, useGetMyBatchesQuery } from '@/api/services/dashboardApi';
import { useGetNoticesQuery } from '@/api/services/noticesApi';
import { useSelector } from 'react-redux';

const StaffDashboard = () => {
    const { user } = useSelector(state => state.auth);
    const { data: stats, isLoading: statsLoading } = useGetStaffDashboardStatsQuery();
    const { data: batches, isLoading: batchesLoading } = useGetMyBatchesQuery();
    const { data: notices } = useGetNoticesQuery();

    // Recent notices (last 3)
    const recentNotices = notices?.slice(0, 3) || [];

    const attendanceDisplay = statsLoading
        ? '—'
        : stats?.attendanceMarkedToday
            ? `${stats.attendanceRate}%`
            : 'Not Marked';

    return (
        <StaffLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Faculty Dashboard</h1>
                <p className="text-slate-500 text-sm">Focus on your scheduled activities and student evaluations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="My Students"
                    value={statsLoading ? '...' : (stats?.totalStudents ?? '—')}
                    icon={Users}
                />
                <StatCard
                    title="Today's Attendance"
                    value={attendanceDisplay}
                    icon={Clock}
                    color={stats?.attendanceMarkedToday ? 'success' : 'warning'}
                />
                <StatCard
                    title="Pending Evaluations"
                    value={statsLoading ? '...' : (stats?.pendingEvaluations ?? '—')}
                    icon={FileEdit}
                    color="warning"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Notices Stream */}
                <Card className="border-none shadow-sm h-full">
                    <CardHeader className="border-b border-slate-50">
                        <CardTitle className="text-slate-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            <Bell size={16} /> Recent Notices
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-5">
                            {recentNotices.length > 0 ? recentNotices.map((n, i) => {
                                const unread = !n.readBy?.includes(user?._id);
                                return (
                                    <div key={n._id} className="flex gap-4">
                                        <div className={`size-10 rounded-xl shrink-0 flex items-center justify-center ${unread ? 'text-red-600 bg-red-50' : 'text-slate-400 bg-slate-50'}`}>
                                            <Bell size={18} />
                                        </div>
                                        <div className="flex-1 border-b border-slate-50 pb-4">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-slate-800 text-sm">{n.title}</h4>
                                                {unread && <span className="size-2 bg-red-500 rounded-full" />}
                                            </div>
                                            <p className="text-xs text-slate-500 mb-1 line-clamp-1">{n.content}</p>
                                            <p className="text-[10px] font-bold text-slate-300 uppercase">{new Date(n.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <p className="text-sm text-slate-400 italic">No recent notices.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Assigned Batches Panel */}
                <Card className="border-none shadow-sm h-full bg-slate-900 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Users size={160} className="text-white" />
                    </div>
                    <CardContent className="p-8 relative z-10 flex flex-col h-full">
                        <Badge className="bg-primary/20 text-primary border-none w-fit mb-4">My Batches</Badge>
                        <h3 className="text-xl font-bold text-white mb-2 leading-tight">Batch Management Simplified</h3>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                            You can mark attendance and enter marks for your assigned batches directly from the sidebar.
                        </p>

                        {batchesLoading ? (
                            <div className="space-y-2">
                                {[1,2].map(i => <div key={i} className="h-8 bg-slate-800 rounded-lg animate-pulse" />)}
                            </div>
                        ) : batches?.length > 0 ? (
                            <div className="space-y-2 mb-6">
                                {batches.map(b => (
                                    <div key={b._id} className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2">
                                        <CheckCircle2 size={14} className="text-green-400 shrink-0" />
                                        <span className="text-white text-sm font-medium">{b.name}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2 mb-6">
                                <AlertCircle size={14} className="text-amber-400 shrink-0" />
                                <span className="text-slate-400 text-sm">No batches assigned yet. Contact Admin.</span>
                            </div>
                        )}

                        <div className="mt-auto pt-6 border-t border-slate-800 flex gap-6">
                            <div>
                                <p className="text-2xl font-bold text-white leading-none">{batchesLoading ? '...' : (batches?.length ?? 0)}</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Batches</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white leading-none">{statsLoading ? '...' : (stats?.pendingEvaluations ?? 0)}</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pending Results</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </StaffLayout>
    );
};

export default StaffDashboard;
