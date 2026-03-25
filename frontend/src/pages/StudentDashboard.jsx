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
                </Card>
                <Card title="Fee Status">
                    <div className="flex items-center gap-2">
                        <CheckCircle size={20} className="text-green-500" />
                        <span className="font-semibold text-green-600 uppercase">Paid</span>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Academic Notices">
                    <div className="space-y-4">
                        <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                            <h4 className="font-bold text-primary mb-1">Final Exam Schedule Out</h4>
                            <p className="text-xs text-slate-600">Please check the exams section for detailed timetable.</p>
                        </div>
                    </div>
                </Card>
                <Card title="Study Progress">
                    {/* Progress tracking logic here */}
                    <div className="text-sm text-slate-500">Keep up the good work! You are in the top 10% of your batch.</div>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default StudentDashboard;
