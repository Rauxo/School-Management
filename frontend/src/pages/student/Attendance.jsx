import React from 'react';
import StudentLayout from '@/layouts/StudentLayout';
import { useGetStudentAttendanceQuery } from '@/api/services/studentDataApi';
import DataTable from '@/components/common/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Calendar } from 'lucide-react';

const StudentAttendance = () => {
    const { data: attendance, isLoading } = useGetStudentAttendanceQuery();

    const columns = [
        { 
            header: 'Date', 
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    <span>{new Date(row.date).toLocaleDateString()}</span>
                </div>
            )
        },
        { header: 'Status', cell: (row) => (
            <Badge variant={row.status === 'present' ? 'success' : 'destructive'} className="uppercase">
                {row.status}
            </Badge>
        )},
        { header: 'Marked By', cell: () => 'System/Faculty' }
    ];

    return (
        <StudentLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Attendance Record</h1>
                <p className="text-slate-500 text-sm">Review your daily presence logs.</p>
            </div>
            <DataTable columns={columns} data={attendance || []} isLoading={isLoading} />
        </StudentLayout>
    );
};

export default StudentAttendance;
