import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, Button } from '@/components/UI';
import axios from 'axios';

const AttendanceMarking = () => {
    const [batchId, setBatchId] = useState('');
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState({}); // { studentId: status }

    const fetchStudents = async () => {
        if (!batchId) return;
        const { data } = await axios.get(`/api/staff/students/${batchId}`);
        setStudents(data);
    };

    const handleMark = async (studentId, status) => {
        try {
            await axios.post('/api/staff/attendance', { studentId, batchId, status });
            setMarks(prev => ({ ...prev, [studentId]: status }));
        } catch (err) { alert('Error marking attendance'); }
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Mark Attendance</h1>
                <div className="flex gap-2">
                    <input 
                        className="p-2 border rounded-lg text-sm" 
                        placeholder="Enter Batch ID" 
                        value={batchId}
                        onChange={e => setBatchId(e.target.value)}
                    />
                    <Button onClick={fetchStudents}>Load Students</Button>
                </div>
            </div>

            {students.length > 0 && (
                <Card>
                    <div className="space-y-4">
                        {students.map(s => (
                            <div key={s._id} className="flex items-center justify-between p-3 border-b border-slate-50 last:border-0">
                                <div>
                                    <div className="font-semibold">{s.user.name}</div>
                                    <div className="text-xs text-slate-400">{s.rollNumber}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleMark(s._id, 'present')}
                                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${marks[s._id] === 'present' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                                    >
                                        P
                                    </button>
                                    <button 
                                        onClick={() => handleMark(s._id, 'absent')}
                                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${marks[s._id] === 'absent' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                                    >
                                        A
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </DashboardLayout>
    );
};

export default AttendanceMarking;
