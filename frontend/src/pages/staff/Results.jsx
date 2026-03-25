import React, { useState } from 'react';
import StaffLayout from '@/layouts/StaffLayout';
import DataTable from '@/components/common/DataTable';
import { Badge } from '@/components/ui/Badge';
import { BookOpen, FileDigit, Filter } from 'lucide-react';
import { useGetMyBatchesQuery } from '@/api/services/dashboardApi';
import { useGetBatchResultsQuery } from '@/api/services/staffApi';

const Results = () => {
    const { data: batches } = useGetMyBatchesQuery();
    const [selectedBatchId, setSelectedBatchId] = useState('');
    
    const { data: results, isLoading } = useGetBatchResultsQuery(selectedBatchId, {
        skip: !selectedBatchId
    });

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
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{row.student?.rollNumber}</p>
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
                    variant={row.status === 'pass' ? 'success' : 'destructive'}
                    className="uppercase text-[10px]"
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
        <StaffLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Batch Results</h1>
                    <p className="text-slate-500 text-sm">Monitor student performance across your assigned batches.</p>
                </div>
                
                <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
                    <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                        <Filter size={18} />
                    </div>
                    <select 
                        className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer pr-10"
                        value={selectedBatchId}
                        onChange={(e) => setSelectedBatchId(e.target.value)}
                    >
                        <option value="">Select a Batch</option>
                        {batches?.map(b => (
                            <option key={b._id} value={b._id}>{b.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {!selectedBatchId ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-20 text-center">
                    <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="text-slate-400 font-medium italic">Please select a batch to view examination results.</h3>
                </div>
            ) : (
                <DataTable columns={columns} data={results || []} isLoading={isLoading} />
            )}
        </StaffLayout>
    );
};

export default Results;
