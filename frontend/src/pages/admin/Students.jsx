import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import DataTable from '@/components/common/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { 
  useGetStudentsQuery, 
  useDeleteStudentMutation, 
  useAddStudentMutation,
  useUpdateStudentMutation 
} from '@/api/services/studentsApi';
import { useGetBatchesQuery } from '@/api/services/batchesApi';
import Modal from '@/components/common/Modal';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

const Students = () => {
  const [params, setParams] = useState({ page: 1, limit: 10, search: '' });
  const { data: res, isLoading } = useGetStudentsQuery(params);
  const { data: batches } = useGetBatchesQuery();
  
  const [addStudent, { isLoading: isAdding }] = useAddStudentMutation();
  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();
  const [deleteStudent] = useDeleteStudentMutation();

  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const initialForm = { 
    name: '', email: '', password: '', rollNumber: '', 
    batchId: '', phone: '', address: '', parentName: '', parentPhone: '' 
  };
  const [formData, setFormData] = useState(initialForm);

  const columns = [
    { 
      header: 'Student', 
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs uppercase">
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
    { header: 'Phone', accessor: 'phone' },
    { 
      header: 'Actions', 
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="size-8 p-0 text-slate-400 hover:text-primary"
            onClick={() => handleEditClick(row)}
          >
            <Edit2 size={14} />
          </Button>
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

  const handleEditClick = (student) => {
    setEditMode(true);
    setCurrentId(student._id);
    setFormData({
      name: student.user?.name || '',
      email: student.user?.email || '',
      password: '', // Keep empty for updates
      rollNumber: student.rollNumber || '',
      batchId: student.batch?._id || student.batch || '',
      phone: student.phone || '',
      address: student.address || '',
      parentName: student.parentName || '',
      parentPhone: student.parentPhone || ''
    });
    setModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditMode(false);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
        try {
            await deleteStudent(id).unwrap();
            toast.success('Student deleted successfully');
        } catch (err) { toast.error('Failed to delete student'); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (isEditMode) {
            await updateStudent({ id: currentId, ...formData }).unwrap();
            toast.success('Student updated successfully');
        } else {
            await addStudent(formData).unwrap();
            toast.success('Student added successfully');
        }
        setModalOpen(false);
        setFormData(initialForm);
    } catch (err) { toast.error(err.data?.message || 'Failed to save student'); }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Student Management</h1>
            <p className="text-slate-500 text-sm italic">Manage your records and batch assignments.</p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2 shadow-lg shadow-primary/20">
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
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        title={isEditMode ? "Edit Student" : "Register New Student"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Full Name</label>
                    <Input placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Email Address</label>
                    <Input type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">{isEditMode ? "New Password (Leave blank to keep same)" : "Initial Password"}</label>
                    <Input type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={!isEditMode} />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Roll Number</label>
                    <Input placeholder="SM-2024-001" value={formData.rollNumber} onChange={e => setFormData({...formData, rollNumber: e.target.value})} required />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Batch</label>
                    <select 
                        className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={formData.batchId}
                        onChange={e => setFormData({...formData, batchId: e.target.value})}
                        required
                    >
                        <option value="">Select Batch</option>
                        {batches?.map(b => (
                            <option key={b._id} value={b._id}>{b.name}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                    <Input placeholder="1234567890" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Address</label>
                <Input placeholder="123 Main St, City" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Parent Name</label>
                    <Input placeholder="Jane Doe" value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})} />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Parent Phone</label>
                    <Input placeholder="0987654321" value={formData.parentPhone} onChange={e => setFormData({...formData, parentPhone: e.target.value})} />
                </div>
            </div>

            <div className="flex gap-3 justify-end mt-8 pt-4 border-t">
                <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isAdding || isUpdating}>
                    {isAdding || isUpdating ? 'Saving...' : (isEditMode ? 'Update Student' : 'Add Student')}
                </Button>
            </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default Students;
