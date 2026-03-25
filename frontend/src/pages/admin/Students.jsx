import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import DataTable from '@/components/common/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, Edit2, Eye } from 'lucide-react';
import { useGetStudentsQuery, useDeleteStudentMutation, useAddStudentMutation } from '@/api/services/studentsApi';
import Modal from '@/components/common/Modal';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

const Students = () => {
  const [params, setParams] = useState({ page: 1, limit: 10, search: '' });
  const { data: res, isLoading } = useGetStudentsQuery(params);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  
  const [addStudent, { isLoading: isAdding }] = useAddStudentMutation();
  const [deleteStudent] = useDeleteStudentMutation();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', rollNumber: '' });

  const columns = [
    { 
      header: 'Student', 
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
            {row.user?.name?.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{row.user?.name}</p>
            <p className="text-[11px] text-slate-500 uppercase font-medium">{row.rollNumber}</p>
          </div>
        </div>
      )
    },
    { header: 'Email', accessor: 'email', cell: (row) => row.user?.email },
    { 
      header: 'Batch', 
      cell: (row) => row.batch ? <Badge variant="secondary">{row.batch.name}</Badge> : <Badge variant="outline">Unassigned</Badge>
    },
    { 
      header: 'Joined', 
      cell: (row) => new Date(row.createdAt).toLocaleDateString() 
    },
    { 
      header: 'Actions', 
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="size-8 p-0 text-slate-400 hover:text-primary"><Edit2 size={14} /></Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="size-8 p-0 text-slate-400 hover:text-red-500"
            onClick={() => handleDelete(row._id)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      )
    },
  ];

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
        try {
            await deleteStudent(id).unwrap();
            toast.success('Student deleted successfully');
        } catch (err) { toast.error('Failed to delete student'); }
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
        await addStudent(formData).unwrap();
        toast.success('Student added successfully');
        setAddModalOpen(false);
        setFormData({ name: '', email: '', password: '', rollNumber: '' });
    } catch (err) { toast.error(err.data?.message || 'Failed to add student'); }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Student Management</h1>
            <p className="text-slate-500 text-sm italic">Manage your records and batch assignments.</p>
        </div>
        <Button onClick={() => setAddModalOpen(true)} className="gap-2 shadow-lg shadow-primary/20">
          <Plus size={18} /> Add Student
        </Button>
      </div>

      <DataTable 
        columns={columns} 
        data={res || []} 
        isLoading={isLoading}
        onSearch={(v) => setParams({ ...params, search: v })}
      />

      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setAddModalOpen(false)} 
        title="Register New Student"
      >
        <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <Input placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <Input type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            </div>
             <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Initial Password</label>
                <Input type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
            </div>
            <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Roll Number</label>
                <Input placeholder="SM-2024-001" value={formData.rollNumber} onChange={e => setFormData({...formData, rollNumber: e.target.value})} required />
            </div>
            <div className="flex gap-3 justify-end mt-8">
                <Button variant="outline" type="button" onClick={() => setAddModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isAdding}>
                    {isAdding ? 'Saving...' : 'Add Student'}
                </Button>
            </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default Students;
