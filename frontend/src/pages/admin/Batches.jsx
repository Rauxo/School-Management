import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import DataTable from '@/components/common/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Plus, Users, Calendar } from 'lucide-react';
import { useGetBatchesQuery, useCreateBatchMutation } from '@/api/services/batchesApi';
import Modal from '@/components/common/Modal';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

const Batches = () => {
    const { data: batches, isLoading } = useGetBatchesQuery();
    const [isModalOpen, setModalOpen] = useState(false);
    const [createBatch, { isLoading: isSaving }] = useCreateBatchMutation();
    const [formData, setFormData] = useState({ name: '', description: '', schedule: '' });

    const columns = [
        { 
            header: 'Batch Name', 
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Users size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">{row.name}</p>
                        <p className="text-[11px] text-slate-400">{row.description}</p>
                    </div>
                </div>
            )
        },
        { header: 'Schedule', accessor: 'schedule', cell: (row) => <div className="flex items-center gap-2 text-slate-600"><Calendar size={14} /> {row.schedule}</div> },
        { 
            header: 'Students', 
            cell: (row) => <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none">{row.students?.length || 0} enrolled</Badge> 
        },
        { 
            header: 'Status', 
            cell: () => <Badge variant="success" className="animate-pulse">Active</Badge> 
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createBatch(formData).unwrap();
            toast.success('New batch created successfully');
            setModalOpen(false);
            setFormData({ name: '', description: '', schedule: '' });
        } catch (err) { toast.error('Creation failed'); }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                   <h1 className="text-2xl font-bold text-slate-800">Batch Management</h1>
                   <p className="text-slate-500 text-sm">Organize students into groups and schedules.</p>
                </div>
                <Button onClick={() => setModalOpen(true)} className="gap-2">
                    <Plus size={18} /> Create Batch
                </Button>
            </div>

            <DataTable columns={columns} data={batches || []} isLoading={isLoading} />

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Create New Batch">
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <Input placeholder="Batch Name (e.g. Morning 2024)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    <Input placeholder="Brief Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                    <Input placeholder="Schedule (e.g. Mon-Fri, 9AM-12PM)" value={formData.schedule} onChange={e => setFormData({...formData, schedule: e.target.value})} required />
                    <div className="flex gap-3 justify-end mt-8">
                        <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Create Batch'}</Button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
};

export default Batches;
