import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import DataTable from '@/components/common/DataTable';
import { Badge } from '@/components/ui/Badge';
import { useGetStaffAttendanceAdminQuery } from '@/api/services/dashboardApi';

const StaffAttendance = () => {
    const { data: attendanceData, isLoading } = useGetStaffAttendanceAdminQuery();
    const [params, setParams] = useState({ page: 1, limit: 10, search: '' });

    const columns = [
        { 
            header: 'Date', 
            cell: (row) => new Date(row.date).toLocaleDateString() 
        },
        { 
            header: 'Staff Member', 
            cell: (row) => (
                <div>
                    <p className="font-bold text-slate-800">{row.staff?.user?.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{row.staff?.user?.email}</p>
                </div>
            )
        },
        { 
            header: 'Status', 
            cell: (row) => (
                <Badge variant={row.status === 'present' ? 'success' : (row.status === 'absent' ? 'destructive' : 'warning')} className="uppercase">
                    {row.status}
                </Badge>
            )
        }
    ];

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Staff Attendance</h1>
                    <p className="text-slate-500 text-sm">View attendance records for all staff members.</p>
                </div>
            </div>

            <DataTable 
                columns={columns} 
                data={attendanceData || []} 
                isLoading={isLoading} 
                onSearch={v => setParams({...params, search: v})} 
            />
        </AdminLayout>
    );
};

export default StaffAttendance;
