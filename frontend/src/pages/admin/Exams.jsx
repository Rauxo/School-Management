import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import DataTable from '@/components/common/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Plus, Calendar, FileText } from 'lucide-react';
import { useGetExamsQuery, useCreateExamMutation } from '@/api/services/examsApi';
import { useGetBatchesQuery } from '@/api/services/batchesApi';
import Modal from '@/components/common/Modal';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

const Exams = () => {
    const { data: exams, isLoading } = useGetExamsQuery();
    const { data: batches } = useGetBatchesQuery();
    const [createExam, { isLoading: isSaving }] = useCreateExamMutation();
    const [isModalOpen, setModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({ 
        title: '', description: '', date: '', maxMarks: '', passingMarks: '', batchId: '' 
    });

    const columns = [
        { 
            header: 'Exam Title', 
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                        <FileText size={18} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">{row.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{row.description}</p>
                    </div>
                </div>
            )
        },
        { 
            header: 'Batch', 
            cell: (row) => row.batch ? <Badge variant="secondary">{row.batch.name}</Badge> : <Badge variant="outline">All Batches</Badge>
        },
        { 
            header: 'Schedule', 
            cell: (row) => (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                    <Calendar size={14} className="text-slate-400" />
                    {new Date(row.date).toLocaleDateString()}
                </div>
            )
        },
        { 
            header: 'Pass / Max', 
            cell: (row) => <span className="text-xs font-bold text-slate-700">{row.passingMarks} <span className="text-slate-300">/</span> {row.maxMarks}</span> 
        },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createExam(formData).unwrap();
            toast.success('Examination scheduled successfully');
            setModalOpen(false);
            setFormData({ title: '', description: '', date: '', maxMarks: '', passingMarks: '', batchId: '' });
        } catch (err) { toast.error('Failed to schedule exam'); }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Examinations</h1>
                    <p className="text-slate-500 text-sm">Schedule and manage institutional assessments.</p>
                </div>
                <Button onClick={() => setModalOpen(true)} className="gap-2 shadow-lg shadow-orange-500/10">
                    <Plus size={18} /> Schedule Exam
                </Button>
            </div>

            <DataTable columns={columns} data={exams || []} isLoading={isLoading} />

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Schedule New Examination">
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Exam Title</label>
                        <Input placeholder="Mid-Term Assessment 2024" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Description</label>
                        <Input placeholder="Core subjects evaluation" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700">Target Batch</label>
                            <select 
                                className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                value={formData.batchId}
                                onChange={e => setFormData({...formData, batchId: e.target.value})}
                                required
                            >
                                <option value="">Select Target Batch</option>
                                {batches?.map(b => (
                                    <option key={b._id} value={b._id}>{b.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700">Exam Date</label>
                            <Input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700">Maximum Marks</label>
                            <Input placeholder="100" type="number" value={formData.maxMarks} onChange={e => setFormData({...formData, maxMarks: e.target.value})} required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700">Passing Marks</label>
                            <Input placeholder="35" type="number" value={formData.passingMarks} onChange={e => setFormData({...formData, passingMarks: e.target.value})} required />
                        </div>
                    </div>
                    <div className="flex gap-3 justify-end mt-6 pt-4 border-t">
                        <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSaving}>{isSaving ? 'Processing...' : 'Schedule Exam'}</Button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
};

export default Exams;
