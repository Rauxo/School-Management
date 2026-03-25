import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import DataTable from '@/components/common/DataTable';
import { Badge } from '@/components/ui/Badge';
import { BookOpen, FileDigit } from 'lucide-react';
import { useGetAdminResultsQuery } from '@/api/services/adminResultsApi';

const Results = () => {
    const { data: results, isLoading } = useGetAdminResultsQuery();

    const columns = [
        { 
            header: 'Student', 
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        <BookOpen size={18} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">{row.student?.user?.name || 'Unknown'}</p>
                    </div>
                </div>
            )
        },
        { 
            header: 'Exam', 
            cell: (row) => (
                <div>
                     <p className="font-semibold text-sm text-slate-700">{row.exam?.title || 'Unknown Exam'}</p>
                </div>
            )
        },
        { 
            header: 'Score', 
            cell: (row) => (
                <div className="flex items-center gap-2 font-bold text-slate-700">
                    <FileDigit size={14} className="text-slate-400" />
                    {row.marksObtained} <span className="text-slate-300">/</span> {row.exam?.maxMarks || '-'}
                </div>
            )
        },
        { 
            header: 'Result', 
            cell: (row) => (
                <Badge 
                    variant="outline" 
                    className={row.status === 'pass' ? 'text-green-600 border-green-200 bg-green-50 uppercase text-[10px]' : 'text-red-600 border-red-200 bg-red-50 uppercase text-[10px]'}
                >
                    {row.status}
                </Badge>
            )
        },
        { 
            header: 'Remarks', 
            cell: (row) => <span className="text-xs text-slate-500 italic">{row.remarks || 'No remarks'}</span>
        }
    ];

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">All Results</h1>
                    <p className="text-slate-500 text-sm">View comprehensive examination evaluations across all batches.</p>
                </div>
            </div>

            <DataTable columns={columns} data={results || []} isLoading={isLoading} />
        </AdminLayout>
    );
};

export default Results;
