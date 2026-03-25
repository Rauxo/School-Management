import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import Modal from '@/components/common/Modal';
import { Plus, Trash2, Pencil, UserCog } from 'lucide-react';
import {
    useGetStaffQuery,
    useAddStaffMutation,
    useDeleteStaffMutation,
    useUpdateStaffMutation
} from '@/api/services/staffApi';
import { useGetBatchesQuery } from '@/api/services/batchesApi';
import toast from 'react-hot-toast';

const emptyForm = {
    name: '', email: '', password: '', employeeId: '',
    designation: '', salary: '', phone: '', address: '', assignedBatches: []
};

const StaffManagement = () => {
    const { data: staff, isLoading } = useGetStaffQuery();
    const { data: batches } = useGetBatchesQuery();
    const [addStaff, { isLoading: isAdding }] = useAddStaffMutation();
    const [deleteStaff] = useDeleteStaffMutation();
    const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();

    const [isAddOpen, setAddOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null); // { id, assignedBatches }
    const [formData, setFormData] = useState(emptyForm);

    const toggleBatch = (batchId) => {
        setFormData(prev => ({
            ...prev,
            assignedBatches: prev.assignedBatches.includes(batchId)
                ? prev.assignedBatches.filter(b => b !== batchId)
                : [...prev.assignedBatches, batchId]
        }));
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await addStaff(formData).unwrap();
            toast.success('Staff member added');
            setAddOpen(false);
            setFormData(emptyForm);
        } catch (err) { toast.error(err.data?.message || 'Failed to add staff'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this staff member?')) return;
        try {
            await deleteStaff(id).unwrap();
            toast.success('Staff member removed');
        } catch { toast.error('Failed to delete'); }
    };

    const openBatchAssign = (s) => {
        setEditingStaff(s);
        setFormData({
            ...emptyForm,
            assignedBatches: (s.assignedBatches || []).map(b => b._id || b)
        });
    };

    const handleBatchAssignSave = async () => {
        try {
            await updateStaff({ id: editingStaff._id, assignedBatches: formData.assignedBatches }).unwrap();
            toast.success('Batch assignments updated');
            setEditingStaff(null);
        } catch { toast.error('Failed to update batch assignments'); }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Staff Management</h1>
                    <p className="text-slate-500 text-sm">Manage faculty, designations and batch assignments.</p>
                </div>
                <Button onClick={() => { setFormData(emptyForm); setAddOpen(true); }} className="gap-2">
                    <Plus size={18} /> Add Staff
                </Button>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="pb-4 px-6 font-semibold">Name</th>
                                <th className="pb-4 px-6 font-semibold">Emp ID</th>
                                <th className="pb-4 px-6 font-semibold">Designation</th>
                                <th className="pb-4 px-6 font-semibold">Assigned Batches</th>
                                <th className="pb-4 px-6 font-semibold text-right">Salary</th>
                                <th className="pb-4 px-6 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                [1,2,3].map(i => (
                                    <tr key={i}>
                                        {[1,2,3,4,5,6].map(j => (
                                            <td key={j} className="py-4 px-6">
                                                <div className="h-4 bg-slate-100 rounded animate-pulse" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : staff?.length > 0 ? staff.map((s) => (
                                <tr key={s._id} className="text-sm hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                                {s.user?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-700">{s.user?.name}</p>
                                                <p className="text-[11px] text-slate-400">{s.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 font-mono text-slate-600 text-xs">{s.employeeId}</td>
                                    <td className="py-4 px-6 italic text-slate-500">{s.designation}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex flex-wrap gap-1">
                                            {s.assignedBatches?.length > 0
                                                ? s.assignedBatches.map(b => (
                                                    <Badge key={b._id || b} variant="outline" className="text-[10px]">{b.name || b}</Badge>
                                                ))
                                                : <span className="text-xs text-slate-300 italic">None</span>
                                            }
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right font-medium text-slate-700">₹{Number(s.salary).toLocaleString()}</td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => openBatchAssign(s)}
                                                className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                                                title="Assign Batches"
                                            >
                                                <UserCog size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(s._id)}
                                                className="size-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400 italic text-sm">No staff members found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Add Staff Modal */}
            <Modal isOpen={isAddOpen} onClose={() => setAddOpen(false)} title="Add New Staff Member">
                <form onSubmit={handleAdd} className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">Full Name</label>
                            <Input placeholder="Dr. Sharma" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">Email</label>
                            <Input placeholder="staff@school.com" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Password</label>
                        <Input type="password" placeholder="Temporary password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">Employee ID</label>
                            <Input placeholder="EMP-001" value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})} required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">Designation</label>
                            <Input placeholder="Lecturer" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} required />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Salary (₹)</label>
                        <Input type="number" placeholder="25000" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} required />
                    </div>
                    <div className="flex gap-3 justify-end mt-6 pt-4 border-t">
                        <Button variant="outline" type="button" onClick={() => setAddOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isAdding}>{isAdding ? 'Adding...' : 'Add Staff'}</Button>
                    </div>
                </form>
            </Modal>

            {/* Batch Assignment Modal */}
            <Modal isOpen={!!editingStaff} onClose={() => setEditingStaff(null)} title={`Assign Batches — ${editingStaff?.user?.name}`}>
                <div className="pt-2 space-y-4">
                    <p className="text-sm text-slate-500">Select the batches this staff member can access for attendance and marks entry.</p>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {batches?.length > 0 ? batches.map(b => {
                            const assigned = formData.assignedBatches.includes(b._id);
                            return (
                                <label key={b._id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${assigned ? 'border-primary/30 bg-primary/5' : 'border-slate-100 hover:bg-slate-50'}`}>
                                    <input
                                        type="checkbox"
                                        checked={assigned}
                                        onChange={() => toggleBatch(b._id)}
                                        className="size-4 rounded text-primary focus:ring-primary/20"
                                    />
                                    <span className="font-medium text-slate-700 text-sm">{b.name}</span>
                                    {b.description && <span className="text-xs text-slate-400 ml-auto">{b.description}</span>}
                                </label>
                            );
                        }) : (
                            <p className="text-sm text-slate-400 italic p-4 text-center">No batches found. Create batches first.</p>
                        )}
                    </div>
                    <div className="flex gap-3 justify-end pt-4 border-t">
                        <Button variant="outline" onClick={() => setEditingStaff(null)}>Cancel</Button>
                        <Button onClick={handleBatchAssignSave} disabled={isUpdating}>
                            {isUpdating ? 'Saving...' : 'Save Assignments'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
};

export default StaffManagement;
