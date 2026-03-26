import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card } from '@/components/UI';
import { UserCheck, BookOpen, Clock, Users, Book, AlertCircle } from 'lucide-react';
import axios from 'axios';

const StaffDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('/api/staff/dashboard');
                setStats(data);
            } catch (err) {
                console.error('Failed to fetch dashboard stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <DashboardLayout><div className="flex items-center justify-center h-64 text-slate-400 font-medium">Loading dashboard...</div></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card title="My Students">
                    <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-slate-800">{stats?.totalStudents || 0}</span>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users size={20} /></div>
                    </div>
                </Card>
                <Card title="Assigned Batches">
                    <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-slate-800">{stats?.assignedBatchCount || 0}</span>
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><BookOpen size={20} /></div>
                    </div>
                </Card>
                <Card title="Evaluations Due">
                    <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-slate-800">{stats?.pendingEvaluations || 0}</span>
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Clock size={20} /></div>
                    </div>
                </Card>
                <Card title="My Attendance">
                    <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-slate-800">{stats?.attendanceRate !== null ? `${stats.attendanceRate}%` : 'N/A'}</span>
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg"><UserCheck size={20} /></div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Today's Overview">
                    <div className="space-y-4">
                        <div className={`p-4 rounded-xl border ${stats?.attendanceMarkedToday ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'}`}>
                            <h4 className={`font-bold text-sm mb-1 ${stats?.attendanceMarkedToday ? 'text-green-800' : 'text-amber-800'}`}>
                                {stats?.attendanceMarkedToday ? 'Attendance Recorded' : 'Mark Today\'s Attendance'}
                            </h4>
                            <p className={`text-xs ${stats?.attendanceMarkedToday ? 'text-green-600' : 'text-amber-600'}`}>
                                {stats?.attendanceMarkedToday 
                                    ? 'You have already recorded your attendance for today. Well done!' 
                                    : 'Please ricord your presence in the attendance module to maintain your record.'}
                            </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm p-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-slate-600 font-medium">Total Subjects Managed</span>
                            <span className="text-slate-800 font-bold ml-auto">{stats?.subjectCount || 0}</span>
                        </div>
                    </div>
                </Card>
                <Card title="Tasks & Reminders">
                    <div className="text-sm text-slate-500 italic flex items-center gap-2">
                        <AlertCircle size={16} className="text-slate-400" />
                        No pending administrative alerts.
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default StaffDashboard;
