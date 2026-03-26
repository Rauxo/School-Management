import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card } from '@/components/UI';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import axios from 'axios';

const StudentDashboard = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get('/api/student/profile');
                setData(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Welcome, {data?.student.user?.name || 'Student'}!</h1>
                <p className="text-slate-500 text-sm">
                    Roll No: <span className="font-semibold text-slate-700">{data?.student.rollNumber}</span> | 
                    Batch: <span className="font-semibold text-primary">{data?.student.batch?.name || 'Unassigned'}</span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card title="Attendance">
                    <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold">{data?.attendancePercentage.toFixed(1) || 0}%</span>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div 
                                className="bg-primary h-full transition-all duration-500" 
                                style={{ width: `${data?.attendancePercentage || 0}%` }}
                            />
                        </div>
                    </div>
                </Card>
                <Card title="Recent Grade">
                    <span className="text-3xl font-bold">{data?.results[0]?.marksObtained || 'N/A'}</span>
                    <span className="text-xs text-slate-400 ml-2">/ {data?.results[0]?.exam?.maxMarks || 100}</span>
                    {data?.results[0] && (
                        <div className={`text-[10px] font-bold uppercase mt-1 ${data.results[0].status === 'pass' ? 'text-green-500' : 'text-red-500'}`}>
                            {data.results[0].status}
                        </div>
                    )}
                </Card>
                <Card title="Fee Status">
                    <div className="flex items-center gap-2">
                        <CheckCircle size={20} className="text-green-500" />
                        <span className="font-semibold text-green-600 uppercase">Up to Date</span>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Academic Notices">
                    <div className="space-y-4">
                        <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                            <h4 className="font-bold text-primary mb-1">Stay Updated!</h4>
                            <p className="text-xs text-slate-600">Check the notices section regularly for school announcements and events.</p>
                        </div>
                    </div>
                </Card>
                <Card title="Study Progress">
                    <div className="text-sm text-slate-500">
                        {data?.attendancePercentage > 75 
                            ? "Great job! Your attendance is on track." 
                            : "Your attendance is below 75%. Please try to attend more classes."}
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default StudentDashboard;
