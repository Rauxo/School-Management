import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import DataTable from '@/components/common/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, Edit2, Eye } from 'lucide-react';
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download } from 'lucide-react';

const Students = () => {
  const [params, setParams] = useState({ page: 1, limit: 10, search: '' });
  const { data: res, isLoading } = useGetStudentsQuery(params);
  const { data: batches } = useGetBatchesQuery();
  
  const [addStudent, { isLoading: isAdding }] = useAddStudentMutation();
  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();
  const [deleteStudent] = useDeleteStudentMutation();

  const [isModalOpen, setModalOpen] = useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const initialForm = { 
    name: '', email: '', password: '', rollNumber: '', 
    batchId: '', phone: '', address: '', parentName: '', parentPhone: '' 
  };
  const [formData, setFormData] = useState(initialForm);

  const handleExport = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text('Student List', 14, 22);
      doc.setFontSize(11);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

      const tableData = (res || []).map(s => [
        s.user?.name || 'N/A',
        s.rollNumber || 'N/A',
        s.user?.email || 'N/A',
        s.batch?.name || 'Unassigned',
        s.phone || 'N/A'
      ]);

      autoTable(doc, {
        startY: 40,
        head: [['Name', 'Roll Number', 'Email', 'Batch', 'Phone']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [51, 65, 85] }
      });

      doc.save('students_list.pdf');
      toast.success('Students exported as PDF');
    } catch (err) { toast.error('Export failed'); }
  };

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
            onClick={() => handleViewDetails(row)}
            title="View Details"
          >
            <Eye size={14} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="size-8 p-0 text-slate-400 hover:text-primary"
            onClick={() => handleEditClick(row)}
            title="Edit"
          >
            <Edit2 size={14} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="size-8 p-0 text-slate-400 hover:text-red-500"
            onClick={() => handleDelete(row._id)}
            title="Delete"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      )
    },
  ];

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setDetailModalOpen(true);
  };

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
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download size={18} /> Export PDF
          </Button>
          <Button onClick={handleOpenAdd} className="gap-2 shadow-lg shadow-primary/20">
            <Plus size={18} /> Add Student
          </Button>
        </div>
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
      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => setDetailModalOpen(false)} 
        title="Student Details"
      >
        {selectedStudent && (
          <div className="space-y-6 py-2">
            <div className="flex items-center gap-4 border-b pb-6">
              <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold uppercase">
                {selectedStudent.user?.name?.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedStudent.user?.name}</h3>
                <p className="text-slate-500 font-medium">{selectedStudent.rollNumber}</p>
                <Badge variant={selectedStudent.status === 'active' ? 'success' : 'secondary'} className="mt-1 uppercase text-[10px]">
                  {selectedStudent.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                <p className="text-sm text-slate-700 font-medium">{selectedStudent.user?.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</p>
                <p className="text-sm text-slate-700 font-medium">{selectedStudent.phone || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Batch</p>
                <p className="text-sm text-slate-700 font-medium">
                  {selectedStudent.batch?.name || 'Unassigned'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Admission Date</p>
                <p className="text-sm text-slate-700 font-medium">
                  {selectedStudent.admissionDate ? new Date(selectedStudent.admissionDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Residential Address</p>
              <p className="text-sm text-slate-700 font-medium">{selectedStudent.address || 'N/A'}</p>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Parent / Guardian Information</h4>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Guardian Name</p>
                  <p className="text-sm text-slate-700 font-medium">{selectedStudent.parentName || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Guardian Phone</p>
                  <p className="text-sm text-slate-700 font-medium">{selectedStudent.parentPhone || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={() => setDetailModalOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default Students;
