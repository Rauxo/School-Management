import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import DataTable from '@/components/common/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Plus, Download } from 'lucide-react';
import { useGetFeesQuery, useCreateFeeMutation, useApproveFeeMutation } from '@/api/services/feesApi';
import API from '@/api/axios';
import { useGetStudentsQuery } from '@/api/services/studentsApi';
import { useGetBatchesQuery } from '@/api/services/batchesApi';
import Modal from '@/components/common/Modal';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Fees = () => {
    const [params, setParams] = useState({ page: 1, limit: 10, search: '' });
    const { data: fees, isLoading } = useGetFeesQuery(params);
    const { data: studentsData } = useGetStudentsQuery({ limit: 1000 });
    const { data: batches } = useGetBatchesQuery();

    const [isModalOpen, setModalOpen] = useState(false);
    const [createFee, { isLoading: isSaving }] = useCreateFeeMutation();
    const [approveFee] = useApproveFeeMutation();
    const [formData, setFormData] = useState({ studentId: '', batchId: '', title: '', amount: '', dueDate: '' });

    const handleApprove = async (id) => {
        try {
            await approveFee(id).unwrap();
            toast.success('Payment approved successfully');
        } catch (err) { toast.error('Failed to approve payment'); }
    };

    const handleDownloadReport = () => {
        try {
            const doc = new jsPDF();
            
            // Add Title
            doc.setFontSize(20);
            doc.setTextColor(40);
            doc.text('Income Report', 14, 22);
            
            doc.setFontSize(11);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

            const tableData = fees?.map(fee => [
                fee._id,
                fee.student?.user?.name || 'Unknown',
                `INR ${fee.amount?.toLocaleString()}`,
                fee.title,
                fee.status.toUpperCase(),
                new Date(fee.dueDate).toLocaleDateString()
            ]) || [];

            doc.autoTable({
                startY: 40,
                head: [['Receipt No', 'Student', 'Amount', 'Title', 'Status', 'Due Date']],
                body: tableData,
                theme: 'striped',
                headStyles: { fillColor: [79, 70, 229] }, // Indigo 600
                styles: { fontSize: 9 },
            });

            doc.save('income_report.pdf');
            toast.success('PDF Report generated');
        } catch (error) {
            console.error(error);
            toast.error('Failed to generate PDF');
        }
    };

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
            header: 'Actions', 
            cell: (row) => (
                <div className="flex gap-2 items-center">
                    {row.status === 'pending' && (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-xs font-semibold text-emerald-600 border-emerald-200 hover:bg-emerald-50 mb-0"
                            onClick={() => handleApprove(row._id)}
                        >
                            ✓ Approve
                        </Button>
                    )}
                    <Button variant="ghost" size="sm" className="size-8 p-0 text-slate-400" title="Download Invoice">
                        <Download size={14} />
                    </Button>
                </div>
            )
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Remove empty strings to avoid sending them to backend
            const submitData = { ...formData };
            if (!submitData.studentId) delete submitData.studentId;
            if (!submitData.batchId) delete submitData.batchId;

            if (!submitData.studentId && !submitData.batchId) {
                toast.error('Please select either a student or a batch');
                return;
            }

            await createFee(submitData).unwrap();
            toast.success('Fee record generated successfully');
            setModalOpen(false);
            setFormData({ studentId: '', batchId: '', title: '', amount: '', dueDate: '' });
        } catch (err) { toast.error(err.data?.message || 'Failed to generate fee record'); }
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
                <div className="flex gap-3">
                    <Button onClick={handleDownloadReport} variant="outline" className="gap-2 shadow-sm border-slate-200 text-slate-700 bg-white hover:bg-slate-50">
                        <Download size={18} /> Download Report
                    </Button>
                    <Button onClick={() => setModalOpen(true)} className="gap-2 shadow-lg shadow-primary/10">
                        <Plus size={18} /> New Fee Record
                    </Button>
                </div>
            </div>

            <DataTable 
                columns={columns} 
                data={fees || []} 
                isLoading={isLoading} 
                onSearch={v => setParams({...params, search: v})}
            />

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Generate Fee Invoice">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Assign to Student</label>
                        <select 
                            className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={formData.studentId}
                            onChange={e => setFormData({...formData, studentId: e.target.value, batchId: ''})}
                            disabled={!!formData.batchId}
                        >
                            <option value="">Individual Student (Optional)</option>
                            {studentsData?.map(s => (
                                <option key={s._id} value={s._id}>{s.user?.name} ({s.rollNumber})</option>
                            ))}
                        </select>
                    </div>

                    <div className="relative flex items-center gap-4 py-2">
                        <div className="flex-1 h-px bg-slate-100"></div>
                        <span className="text-[10px] font-bold text-slate-300 uppercase">OR</span>
                        <div className="flex-1 h-px bg-slate-100"></div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Assign to entire Batch</label>
                        <select 
                            className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={formData.batchId}
                            onChange={e => setFormData({...formData, batchId: e.target.value, studentId: ''})}
                            disabled={!!formData.studentId}
                        >
                            <option value="">Entire Batch (Optional)</option>
                            {batches?.map(b => (
                                <option key={b._id} value={b._id}>{b.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="h-px bg-slate-100 my-4"></div>

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
