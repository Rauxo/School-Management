import React, { useState } from 'react';
import StaffLayout from '@/layouts/StaffLayout';
import { useGetMyBatchesQuery } from '@/api/services/dashboardApi';
import { useGetBatchStudentsQuery } from '@/api/services/staffAttendanceApi';
import { useGetStudentProfileQuery, useGetBatchResultsQuery } from '@/api/services/staffApi';
import { Badge } from '@/components/ui/Badge';

const StudentDetails = ({ studentId, batchId }) => {
    const { data: profile, isLoading: isProfileLoading } = useGetStudentProfileQuery(studentId, { skip: !studentId || studentId === 'undefined' });
    const { data: results, isLoading: isResultsLoading } = useGetBatchResultsQuery(batchId, { skip: !batchId });

    if (!studentId) return <div className="p-8 text-center text-slate-400 bg-white rounded-xl border border-slate-100 h-full flex items-center justify-center">Select a student to view their profile</div>;

    if (isProfileLoading || isResultsLoading) return <div className="p-8 text-center">Loading student details...</div>;

    // Filter results for this student only
    const studentResults = results?.filter(r => r.student?._id === studentId) || [];

    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-4">
                    <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
                        {profile?.user?.name?.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{profile?.user?.name}</h2>
                        <p className="text-slate-500 font-medium">Roll No: {profile?.rollNumber}</p>
                    </div>
                </div>
            </div>
            
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 rounded-lg">
                            <p className="text-xs text-slate-500 mb-1">Email</p>
                            <p className="text-sm font-semibold">{profile?.user?.email}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                            <p className="text-xs text-slate-500 mb-1">Phone</p>
                            <p className="text-sm font-semibold">{profile?.phone || 'N/A'}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                            <p className="text-xs text-slate-500 mb-1">Batch</p>
                            <p className="text-sm font-semibold">{profile?.batch?.name}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                            <p className="text-xs text-slate-500 mb-1">Status</p>
                            <Badge variant={profile?.status === 'active' ? 'success' : 'secondary'} className="uppercase text-[10px]">{profile?.status}</Badge>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Exam Performance</h3>
                    {studentResults.length > 0 ? (
                        <div className="space-y-3">
                            {studentResults.map(res => (
                                <div key={res._id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-slate-700">{res.exam?.title}</p>
                                        <p className="text-xs text-slate-400">Max Marks: {res.exam?.maxMarks}</p>
                                    </div>
                                    <div className="text-right flex items-center gap-3">
                                        <div className="flex flex-col items-end">
                                            <span className="font-mono font-bold text-lg">{res.marksObtained}</span>
                                        </div>
                                        <Badge variant={res.status === 'pass' ? 'success' : 'destructive'} className="uppercase">
                                            {res.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400 italic">No exam results found for this student.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const StaffStudents = () => {
    const { data: batches } = useGetMyBatchesQuery();
    const [selectedBatchId, setSelectedBatchId] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');

    const { data: students, isLoading: isStudentsLoading } = useGetBatchStudentsQuery(selectedBatchId, { skip: !selectedBatchId });

    return (
        <StaffLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Student Profiles</h1>
                <p className="text-slate-500 text-sm">View basic info and performance of students in your assigned batches.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
                {/* Left Panel: Batch Select & List */}
                <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <select 
                            className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={selectedBatchId}
                            onChange={(e) => {
                                setSelectedBatchId(e.target.value);
                                setSelectedStudentId('');
                            }}
                        >
                            <option value="">Select a Batch</option>
                            {batches?.map(b => (
                                <option key={b._id} value={b._id}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {!selectedBatchId ? (
                            <p className="text-center text-sm text-slate-400 mt-10">Please select a batch first</p>
                        ) : isStudentsLoading ? (
                            <p className="text-center text-sm text-slate-400 mt-10">Loading students...</p>
                        ) : students?.length === 0 ? (
                            <p className="text-center text-sm text-slate-400 mt-10">No students in this batch.</p>
                        ) : (
                            students?.map(s => (
                                <button
                                    key={s._id}
                                    onClick={() => setSelectedStudentId(s._id)}
                                    className={`w-full text-left p-3 flex justify-between items-center rounded-lg transition-colors ${
                                        selectedStudentId === s._id ? 'bg-primary/10 border-primary/20' : 'hover:bg-slate-50 border-transparent'
                                    } border`}
                                >
                                    <div>
                                        <p className={`font-semibold text-sm ${selectedStudentId === s._id ? 'text-primary' : 'text-slate-700'}`}>{s.user?.name}</p>
                                        <p className="text-xs text-slate-400">{s.rollNumber}</p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Panel: Detail View */}
                <div className="lg:col-span-2 relative">
                    <StudentDetails studentId={selectedStudentId} batchId={selectedBatchId} />
                </div>
            </div>
        </StaffLayout>
    );
};

export default StaffStudents;
