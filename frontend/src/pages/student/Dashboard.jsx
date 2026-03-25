import React from 'react';
import StudentLayout from '@/layouts/StudentLayout';
import StatCard from '@/components/common/StatCard';
import { BookOpen, Clock, CreditCard, TrendingUp, CheckCircle } from 'lucide-react';
import { useGetStudentProfileQuery } from '@/api/services/studentDataApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const StudentDashboard = () => {
    const { data, isLoading } = useGetStudentProfileQuery();

    const avgScore = data?.results?.length > 0
        ? (data.results.reduce((acc, r) => acc + (r.marksObtained / r.exam.maxMarks), 0) / data.results.length) * 100
        : 0;
    
    const attendanceLevel = data?.attendancePercentage || 0;

    return (
        <StudentLayout>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Academic Overview</h1>
                    <p className="text-slate-500 text-sm">Track your progress and upcoming activities.</p>
                </div>
                <Badge variant="success" className="h-8 px-4 rounded-lg font-bold">Enrolled: {data?.studentProfile?.batch?.name || 'Loading...'}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard 
                    title="Overall Attendance" 
                    value={isLoading ? "..." : `${data?.attendancePercentage?.toFixed(1) || 0}%`} 
                    icon={Clock} 
                />
                <StatCard 
                    title="Recent Score" 
                    value={isLoading ? "..." : (data?.results?.[0]?.marksObtained || 'N/A')} 
                    icon={TrendingUp} 
                    color="success"
                />
                <StatCard 
                    title="Enrollment Status" 
                    value="Active" 
                    icon={CheckCircle} 
                    color="purple"
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 flex flex-col md:flex-row gap-8 items-center border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-indigo-500"></div>
                <div className="flex-1 w-full space-y-5 lg:pr-8">
                    <div>
                        <div className="flex justify-between mb-1.5 px-1">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Attendance Limit</span>
                            <span className="text-xs font-bold text-slate-700">{attendanceLevel.toFixed(0)}% / 100%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3">
                            <div className="bg-gradient-to-r from-blue-400 to-indigo-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, attendanceLevel)}%` }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-1.5 px-1">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Academics</span>
                            <span className="text-xs font-bold text-slate-700">{avgScore.toFixed(0)}% Avg</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3">
                            <div className="bg-gradient-to-r from-emerald-400 to-green-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, avgScore)}%` }}></div>
                        </div>
                    </div>
                </div>
                <div className="text-center md:w-48 shrink-0">
                    <p className="text-3xl font-extrabold tracking-tight text-slate-800">
                        {((attendanceLevel + avgScore) / 2) >= 75 ? 'Excellent' : (((attendanceLevel + avgScore) / 2) >= 50 ? 'Good' : 'Needs Work')}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mt-2">Current Standing</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm h-full">
                    <CardHeader className="border-b border-slate-100 italic">
                        <CardTitle className="text-slate-600 text-sm font-bold uppercase tracking-widest">Recent Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {data?.results?.length > 0 ? (
                            <div className="divide-y divide-slate-50">
                                {data.results.slice(0, 5).map((r, i) => (
                                    <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 bg-blue-50 text-blue-600 rounded flex items-center justify-center font-bold text-xs">{r.exam?.title?.charAt(0)}</div>
                                            <p className="font-semibold text-slate-700 text-sm">{r.exam?.title}</p>
                                        </div>
                                        <p className="font-mono font-bold text-primary">{r.marksObtained} <span className="text-[10px] text-slate-400">/ {r.exam?.maxMarks}</span></p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-slate-400 italic text-sm">No exam results published yet.</div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm h-full flex flex-col">
                    <CardHeader className="border-b border-slate-100 italic">
                        <CardTitle className="text-slate-600 text-sm font-bold uppercase tracking-widest">Ongoing Fee Status</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col items-center justify-center p-8">
                        <div className="size-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
                            <CreditCard size={32} />
                        </div>
                        <h4 className="font-bold text-slate-800 mb-1 leading-tight text-center">Your account is in good standing</h4>
                        <p className="text-xs text-slate-500 text-center px-4 leading-relaxed">All current academic and facility fees have been processed successfully.</p>
                        <button variant="outline" className="mt-6 w-full max-w-xs border-slate-200">View Invoices</button>
                    </CardContent>
                </Card>
            </div>
        </StudentLayout>
    );
};

export default StudentDashboard;
