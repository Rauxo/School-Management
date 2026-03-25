import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import DataTable from '@/components/common/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, Edit2, UserPlus } from 'lucide-react';
import { useGetStaffQuery, useAddStaffMutation } from '@/api/services/staffApi';
import Modal from '@/components/common/Modal';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

const Staff = () => {
    const { data: staff, isLoading } = useGetStaffQuery();
    const [isModalOpen, setModalOpen] = useState(false);
    const [addStaff, { isLoading: isSaving }] = useAddStaffMutation();
    const [formData, setFormData] = useState({ 
        name: '', email: '', password: '', employeeId: '', designation: '', salary: '' 
    });

    const columns = [
        { 
            header: 'Staff Member', 
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                        {row.user?.name?.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">{row.user?.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{row.employeeId}</p>
                    </div>
                </div>
            )
        },
        { header: 'Designation', accessor: 'designation', cell: (row) => <Badge variant="outline">{row.designation}</Badge> },
        { header: 'Email', accessor: 'email', cell: (row) => row.user?.email },
        { header: 'Salary', accessor: 'salary', cell: (row) => <span className="font-mono font-bold">₹{row.salary?.toLocaleString()}</span> },
        { 
            header: 'Actions', 
            cell: () => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="size-8 p-0"><Edit2 size={14} /></Button>
                    <Button variant="ghost" size="sm" className="size-8 p-0 text-red-400"><Trash2 size={14} /></Button>
                </div>
            )
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addStaff(formData).unwrap();
            toast.success('Staff member registered successfully');
            setModalOpen(false);
            setFormData({ name: '', email: '', password: '', employeeId: '', designation: '', salary: '' });
        } catch (err) { toast.error(err.data?.message || 'Failed to save staff'); }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Staff Directory</h1>
                    <p className="text-slate-500 text-sm">Manage faculty and administrative members.</p>
                </div>
                <Button onClick={() => setModalOpen(true)} className="gap-2">
                    <UserPlus size={18} /> Register Staff
                </Button>
            </div>

            <DataTable columns={columns} data={staff || []} isLoading={isLoading} />

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Register Staff Member">
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                        <Input placeholder="Email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <Input placeholder="Initial Password" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                    <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Employee ID" value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})} required />
                        <Input placeholder="Designation" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} required />
                    </div>
                    <Input placeholder="Monthly Salary (₹)" type="number" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} required />
                    <div className="flex gap-3 justify-end mt-6">
                        <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSaving}>{isSaving ? 'Processing...' : 'Register'}</Button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
};

export default Staff;
