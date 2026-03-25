import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import DataTable from '@/components/common/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Plus, CreditCard, Download } from 'lucide-react';
import { useGetFeesQuery, useCreateFeeMutation } from '@/api/services/feesApi';
import Modal from '@/components/common/Modal';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

const Fees = () => {
    const [params, setParams] = useState({ page: 1, limit: 10, search: '' });
    const { data: fees, isLoading } = useGetFeesQuery(params);
    const [isModalOpen, setModalOpen] = useState(false);
    const [createFee, { isLoading: isSaving }] = useCreateFeeMutation();
    const [formData, setFormData] = useState({ studentId: '', title: '', amount: '', dueDate: '' });

    const columns = [
        { 
            header: 'Student', 
            cell: (row) => (
                <div>
                    <p className="font-bold text-slate-800">{row.student?.user?.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{row.student?.rollNumber}</p>
                </div>
            )
        },
        { header: 'Fee Title', accessor: 'title' },
        { header: 'Amount', cell: (row) => <span className="font-mono font-bold">₹{row.amount?.toLocaleString()}</span> },
        { header: 'Due Date', cell: (row) => new Date(row.dueDate).toLocaleDateString() },
        { 
            header: 'Status', 
            cell: (row) => (
                <Badge variant={row.status === 'paid' ? 'success' : 'destructive'} className="uppercase">
                    {row.status}
                </Badge>
            )
        },
        {
            header: 'Invoice',
            cell: (row) => (
                <Button variant="ghost" size="sm" className="size-8 p-0 text-slate-400" title="Download Invoice">
                    <Download size={14} />
                </Button>
            )
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createFee(formData).unwrap();
            toast.success('Fee record generated successfully');
            setModalOpen(false);
            setFormData({ studentId: '', title: '', amount: '', dueDate: '' });
        } catch (err) { toast.error('Failed to generate fee record'); }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">
                        Financial Management
                    </h1>
                    <p className="text-slate-500 text-sm italic">Track payments, invoices and pending dues.</p>
                </div>
                <Button onClick={() => setModalOpen(true)} className="gap-2 shadow-lg shadow-primary/10">
                    <Plus size={18} /> New Fee Record
                </Button>
            </div>

            <DataTable 
                columns={columns} 
                data={fees || []} 
                isLoading={isLoading} 
                onSearch={v => setParams({...params, search: v})}
            />

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Generate Fee Invoice">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input placeholder="Student Database ID" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} required />
                    <Input placeholder="Invoice Title (e.g. Annual Tuition 2024)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                    <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Amount (₹)" type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
                        <Input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} required />
                    </div>
                    <div className="flex gap-3 justify-end mt-8">
                        <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSaving}>{isSaving ? 'Generating...' : 'Confirm Invoice'}</Button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
};

export default Fees;
