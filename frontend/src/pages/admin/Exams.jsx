import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import DataTable from '@/components/common/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Plus, BookOpen, Clock } from 'lucide-react';
import { useGetExamsQuery, useCreateExamMutation } from '@/api/services/examsApi';
import Modal from '@/components/common/Modal';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

const Exams = () => {
    const { data: exams, isLoading } = useGetExamsQuery();
    const [isModalOpen, setModalOpen] = useState(false);
    const [createExam, { isLoading: isSaving }] = useCreateExamMutation();
    const [formData, setFormData] = useState({ title: '', batchId: '', date: '', maxMarks: '' });

    const columns = [
        { 
            header: 'Exam Title', 
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                        <BookOpen size={20} />
                    </div>
                    <p className="font-bold text-slate-800">{row.title}</p>
                </div>
            )
        },
        { header: 'Batch', cell: (row) => <Badge variant="outline">{row.batch?.name || 'All Batches'}</Badge> },
        { header: 'Schedule Date', cell: (row) => <div className="flex items-center gap-2"><Clock size={14} className="text-slate-400" /> {new Date(row.date).toLocaleDateString()}</div> },
        { header: 'Max Marks', cell: (row) => <span className="font-bold text-slate-700">{row.maxMarks}</span> },
        { header: 'Status', cell: (row) => <Badge variant="secondary">Scheduled</Badge> }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createExam(formData).unwrap();
            toast.success('Exam scheduled successfully');
            setModalOpen(false);
        } catch (err) { toast.error('Failed to schedule exam'); }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                   <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Examination Center</h1>
                   <p className="text-slate-500 text-sm italic">Schedule assessments and define criteria.</p>
                </div>
                <Button onClick={() => setModalOpen(true)} className="gap-2 shadow-lg shadow-orange-500/20">
                    <Plus size={18} /> Schedule Exam
                </Button>
            </div>

            <DataTable columns={columns} data={exams || []} isLoading={isLoading} />

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="New Examination">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input placeholder="Exam Title (e.g. Midterm 2024)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                    <Input placeholder="Batch ID (leave blank for all)" value={formData.batchId} onChange={e => setFormData({...formData, batchId: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                        <Input placeholder="Max Marks (e.g. 100)" type="number" value={formData.maxMarks} onChange={e => setFormData({...formData, maxMarks: e.target.value})} required />
                    </div>
                    <div className="flex gap-3 justify-end mt-8">
                        <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSaving}>{isSaving ? 'Scheduling...' : 'Confirm Exam'}</Button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
};

export default Exams;
