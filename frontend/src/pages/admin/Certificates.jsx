import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import DataTable from '@/components/common/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Award, Plus, Download, FileText } from 'lucide-react';
import { useGetAdminCertificatesQuery, useIssueCertificateMutation } from '@/api/services/certificatesApi';
import { useGetStudentsQuery } from '@/api/services/studentsApi';
import Modal from '@/components/common/Modal';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

const Certificates = () => {
    const { data: certificates, isLoading } = useGetAdminCertificatesQuery();
    const { data: students } = useGetStudentsQuery({ limit: 1000 });
    const [issueCertificate, { isLoading: isIssuing }] = useIssueCertificateMutation();
    
    const [isModalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({ studentId: '', title: '', description: '', file: null });

    const columns = [
        { 
            header: 'Student', 
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                        {row.student?.user?.name?.charAt(0)}
                    </div>
                    <p className="font-bold text-slate-800">{row.student?.user?.name}</p>
                </div>
            )
        },
        { header: 'Title', accessor: 'title' },
        { 
            header: 'Issued Date', 
            cell: (row) => new Date(row.issueDate).toLocaleDateString() 
        },
        { 
            header: 'Actions', 
            cell: (row) => (
                <Button variant="ghost" size="sm" className="gap-2 text-primary h-8" as="a" href={row.fileUrl} target="_blank">
                    <Download size={14} /> View/Download
                </Button>
            )
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('studentId', formData.studentId);
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('file', formData.file);

        try {
            await issueCertificate(data).unwrap();
            toast.success('Certificate issued successfully');
            setModalOpen(false);
            setFormData({ studentId: '', title: '', description: '', file: null });
        } catch (err) { toast.error('Failed to issue certificate'); }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Certificates & Report Cards</h1>
                    <p className="text-slate-500 text-sm italic">Generate and manage official student achievements.</p>
                </div>
                <Button onClick={() => setModalOpen(true)} className="gap-2 shadow-lg shadow-amber-200">
                    <Plus size={18} /> Issue Certificate
                </Button>
            </div>

            <DataTable columns={columns} data={certificates || []} isLoading={isLoading} />

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Issue New Certificate">
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Select Student</label>
                        <select 
                            className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={formData.studentId}
                            onChange={e => setFormData({...formData, studentId: e.target.value})}
                            required
                        >
                            <option value="">Select Student</option>
                            {students?.map(s => (
                                <option key={s._id} value={s._id}>{s.user?.name} ({s.rollNumber})</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Title</label>
                        <Input placeholder="e.g. Annual Report Card 2024" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Description (Optional)</label>
                        <Input placeholder="Brief description of the achievement" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Certificate File (PDF/Image)</label>
                        <Input type="file" onChange={e => setFormData({...formData, file: e.target.files[0]})} required />
                    </div>

                    <div className="flex gap-3 justify-end mt-8 pt-4 border-t">
                        <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isIssuing}>{isIssuing ? 'Issuing...' : 'Issue Certificate'}</Button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
};

export default Certificates;
