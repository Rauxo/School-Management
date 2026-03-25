import React from 'react';
import StaffLayout from '@/layouts/StaffLayout';
import StatCard from '@/components/common/StatCard';
import { Users, Clock, FileEdit, BarChart3, Bell } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const StaffDashboard = () => {
    return (
        <StaffLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Faculty Dashboard</h1>
                <p className="text-slate-500 text-sm">Focus on your scheduled activities and student evaluations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="My Students" value="124" icon={Users} />
                <StatCard title="Today's Attendance" value="98%" icon={Clock} color="success" />
                <StatCard title="Pending Evaluations" value="4" icon={FileEdit} color="warning" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card className="border-none shadow-sm h-full">
                    <CardHeader className="border-b border-slate-50">
                        <CardTitle className="text-slate-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            <BarChart3 size={16} /> Activity Stream
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                             {[
                                { t: 'Attendance Completed', d: 'Batch Morning A (10:00 AM)', time: '2 hours ago', icon: Clock, c: 'text-green-600 bg-green-50' },
                                { t: 'New Exam Published', d: 'Final Assessment Q2', time: 'Yesterday', icon: FileEdit, c: 'text-blue-600 bg-blue-50' },
                                { t: 'Administrative Notice', d: 'Faculty meeting at 4 PM', time: 'Yesterday', icon: Bell, c: 'text-orange-600 bg-orange-50' },
                             ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className={`size-10 rounded-xl shrink-0 flex items-center justify-center ${item.c}`}>
                                        <item.icon size={18} />
                                    </div>
                                    <div className="flex-1 border-b border-slate-50 pb-4">
                                        <h4 className="font-bold text-slate-800 text-sm">{item.t}</h4>
                                        <p className="text-xs text-slate-500 mb-1">{item.d}</p>
                                        <p className="text-[10px] font-bold text-slate-300 uppercase">{item.time}</p>
                                    </div>
                                </div>
                             ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm h-full bg-slate-900 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Users size={160} className="text-white" />
                    </div>
                    <CardContent className="p-8 relative z-10 flex flex-col h-full">
                        <Badge className="bg-primary/20 text-primary border-none w-fit mb-4">Pro Tip</Badge>
                        <h3 className="text-xl font-bold text-white mb-2 leading-tight">Batch Management Simplified</h3>
                        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                            You can now mark attendance and enter marks for all your assigned batches directly from the mobile-optimized interface.
                        </p>
                        <div className="mt-auto pt-8 border-t border-slate-800 flex gap-4">
                             <div>
                                 <p className="text-2xl font-bold text-white leading-none">12</p>
                                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Batches</p>
                             </div>
                             <div>
                                 <p className="text-2xl font-bold text-white leading-none">08</p>
                                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Subjects</p>
                             </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </StaffLayout>
    );
};

export default StaffDashboard;
