import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import DataTable from '@/components/common/DataTable';
import { Badge } from '@/components/ui/Badge';
import { useGetStaffAttendanceAdminQuery } from '@/api/services/dashboardApi';

const StaffAttendance = () => {
    const { data, isLoading } = useGetStaffAttendanceAdminQuery();
    const [params, setParams] = useState({ page: 1, limit: 10, search: '' });

    const logColumns = [
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

    const summaryColumns = [
        { 
            header: 'Staff Member', 
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {row._id?.user?.name?.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">{row._id?.user?.name}</p>
                    </div>
                </div>
            )
        },
        { 
            header: 'Present Days', 
            cell: (row) => <span className="font-bold text-green-600">{row.present}</span>
        },
        { 
            header: 'Absent Days', 
            cell: (row) => <span className="font-bold text-red-600">{row.absent}</span>
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

            <div className="mb-10">
                <h2 className="text-lg font-bold text-slate-700 mb-4">Overall Summary</h2>
                <DataTable 
                    columns={summaryColumns} 
                    data={data?.summary || []} 
                    isLoading={isLoading} 
                />
            </div>

            <div>
                <h2 className="text-lg font-bold text-slate-700 mb-4">Daily Logs</h2>
                <DataTable 
                    columns={logColumns} 
                    data={data?.records || []} 
                    isLoading={isLoading} 
                    onSearch={v => setParams({...params, search: v})} 
                />
            </div>
        </AdminLayout>
    );
};

export default StaffAttendance;
