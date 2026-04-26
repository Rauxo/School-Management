import React, { useState } from 'react';
import StaffLayout from '@/layouts/StaffLayout';
import DataTable from '@/components/common/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, FileText, Download } from 'lucide-react';
import { useGetStaffMaterialsQuery, useUploadStaffMaterialMutation } from '@/api/services/materialsApi';
import { useGetMyBatchesQuery } from '@/api/services/dashboardApi';
import Modal from '@/components/common/Modal';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { getFileUrl } from '@/utils/fileUrl';

const Materials = () => {
    const { data: materials, isLoading } = useGetStaffMaterialsQuery();
    const { data: batches } = useGetMyBatchesQuery();
    const [uploadMaterial, { isLoading: isSaving }] = useUploadStaffMaterialMutation();
    const [isModalOpen, setModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({ 
        title: '', description: '', type: 'Study', batchId: '', file: null 
    });

    const columns = [
        { 
            header: 'Material Details', 
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        <FileText size={18} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">{row.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{row.description}</p>
                    </div>
                </div>
            )
        },
        { 
            header: 'Type', 
            cell: (row) => <Badge variant="outline" className="capitalize">{row.type}</Badge> 
        },
        { 
            header: 'Target Batch', 
            cell: (row) => row.batch ? <Badge variant="secondary">{row.batch.name}</Badge> : <Badge variant="outline">All Batches</Badge>
        },
        { 
            header: 'Uploaded By', 
            cell: (row) => <span className="text-xs font-semibold text-slate-600">{row.uploadedBy?.name}</span> 
        },
        {
            header: 'Actions',
            cell: (row) => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="size-8 p-0 text-slate-400" as="a" href={getFileUrl(row.fileUrl)} target="_blank" rel="noopener noreferrer">
                        <Download size={14} />
                    </Button>
                </div>
            )
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.file) {
            toast.error('Please select a file to upload');
            return;
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('type', formData.type);
        data.append('batchId', formData.batchId);
        data.append('file', formData.file);

        try {
            await uploadMaterial(data).unwrap();
            toast.success('Material uploaded successfully');
            setModalOpen(false);
            setFormData({ title: '', description: '', type: 'Study', batchId: '', file: null });
        } catch (err) { toast.error('Upload failed'); }
    };

    return (
        <StaffLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Study Materials</h1>
                    <p className="text-slate-500 text-sm">Upload notes, assignments and resources for your students.</p>
                </div>
                <Button onClick={() => setModalOpen(true)} className="gap-2 shadow-lg shadow-indigo-500/10">
                    <Plus size={18} /> Upload Material
                </Button>
            </div>

            <DataTable columns={columns} data={materials || []} isLoading={isLoading} />

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Upload Study Material">
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Material Title</label>
                        <Input placeholder="Advanced Physics Notes - Ch 1" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Short Description</label>
                        <Input placeholder="Covers mechanics and thermodynamics" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700">Target Batch</label>
                            <select 
                                className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                value={formData.batchId}
                                onChange={e => setFormData({...formData, batchId: e.target.value})}
                            >
                                <option value="">All Batches</option>
                                {batches?.map(b => (
                                    <option key={b._id} value={b._id}>{b.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700">Material Type</label>
                            <select 
                                className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                value={formData.type}
                                onChange={e => setFormData({...formData, type: e.target.value})}
                                required
                            >
                                <option value="Study">Study</option>
                                <option value="practice">practice</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Select File</label>
                        <input 
                            type="file" 
                            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/5 file:text-primary hover:file:bg-primary/10 transition-all cursor-pointer border border-slate-200 rounded-md p-1"
                            onChange={e => setFormData({...formData, file: e.target.files[0]})}
                            required
                        />
                    </div>

                    <div className="flex gap-3 justify-end mt-6 pt-4 border-t">
                        <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSaving}>{isSaving ? 'Uploading...' : 'Upload'}</Button>
                    </div>
                </form>
            </Modal>
        </StaffLayout>
    );
};

export default Materials;
