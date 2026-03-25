import React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card } from '@/components/UI';
import { UserCheck, BookOpen, Clock } from 'lucide-react';

const StaffDashboard = () => {
    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card title="Assigned Students">
                    <span className="text-3xl font-bold">45</span>
                </Card>
                <Card title="Upcoming Exams">
                    <span className="text-3xl font-bold">2</span>
                </Card>
                <Card title="My Attendance (%)">
                    <span className="text-3xl font-bold">98%</span>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Recent Activities">
                    <div className="space-y-4">
                        {[1,2,3].map(i => (
                            <div key={i} className="flex items-center gap-4 text-sm">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                <span className="text-slate-600">Marked attendance for Batch A</span>
                                <span className="text-slate-400 text-xs ml-auto">2h ago</span>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card title="Pending Mark Entry">
                    <div className="text-sm text-slate-500 italic">All marks entered for current exams.</div>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default StaffDashboard;
