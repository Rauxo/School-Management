import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import DataTable from '@/components/common/DataTable';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, Edit2, Image as ImageIcon } from 'lucide-react';
import {
    useGetBannersQuery,
    useAddBannerMutation,
    useUpdateBannerMutation,
    useDeleteBannerMutation
} from '@/api/services/bannerApi';
import Modal from '@/components/common/Modal';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

const Banners = () => {
    const { data: banners, isLoading } = useGetBannersQuery();
    const [addBanner, { isLoading: isAdding }] = useAddBannerMutation();
    const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
    const [deleteBanner] = useDeleteBannerMutation();

    const [isModalOpen, setModalOpen] = useState(false);
    const [isEditMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const initialForm = { title: '', description: '', image: null, active: true };
    const [formData, setFormData] = useState(initialForm);

    const columns = [
        {
            header: 'Banner',
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <img 
                        src={`http://localhost:5000${row.imageUrl}`} 
                        alt={row.title} 
                        className="size-16 rounded-lg object-cover border border-slate-200"
                    />
                    <div>
                        <p className="font-bold text-slate-800">{row.title || 'No Title'}</p>
                        <p className="text-xs text-slate-500 line-clamp-1">{row.description || 'No Description'}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Status',
            cell: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${row.active ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
                    {row.active ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            header: 'Actions',
            cell: (row) => (
                <div className="flex gap-1">
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
                        className="size-8 p-0 text-red-400 hover:text-red-600"
                        onClick={() => handleDelete(row._id)}
                    >
                        <Trash2 size={14} />
                    </Button>
                </div>
            )
        }
    ];

    const handleEditClick = (banner) => {
        setEditMode(true);
        setCurrentId(banner._id);
        setFormData({
            title: banner.title || '',
            description: banner.description || '',
            active: banner.active,
            image: null
        });
        setModalOpen(true);
    };

    const handleOpenAdd = () => {
        setEditMode(false);
        setFormData(initialForm);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            try {
                await deleteBanner(id).unwrap();
                toast.success('Banner removed successfully');
            } catch (err) { toast.error(err.data?.message || 'Failed to remove banner'); }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('active', formData.active);
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            if (isEditMode) {
                await updateBanner({ id: currentId, data }).unwrap();
                toast.success('Banner updated successfully');
            } else {
                await addBanner(data).unwrap();
                toast.success('Banner added successfully');
            }
            setModalOpen(false);
        } catch (err) { toast.error(err.data?.message || 'Failed to save banner'); }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Home Page Banners</h1>
                    <p className="text-slate-500 text-sm">Manage banners displayed on the public home page (2-5 banners).</p>
                </div>
                <Button onClick={handleOpenAdd} className="gap-2">
                    <Plus size={18} /> Add Banner
                </Button>
            </div>

            <DataTable columns={columns} data={banners || []} isLoading={isLoading} />

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={isEditMode ? "Edit Banner" : "Add Banner"}>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Banner Image</label>
                        <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={e => setFormData({...formData, image: e.target.files[0]})} 
                            required={!isEditMode}
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Title</label>
                        <Input 
                            placeholder="Banner Title" 
                            value={formData.title} 
                            onChange={e => setFormData({...formData, title: e.target.value})} 
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Description</label>
                        <Input 
                            placeholder="Banner Description" 
                            value={formData.description} 
                            onChange={e => setFormData({...formData, description: e.target.value})} 
                        />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input 
                            type="checkbox" 
                            id="active"
                            checked={formData.active}
                            onChange={e => setFormData({...formData, active: e.target.checked})}
                            className="rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="active" className="text-sm font-semibold text-slate-700">Active</label>
                    </div>

                    <div className="flex gap-3 justify-end mt-6 pt-4 border-t">
                        <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isAdding || isUpdating}>
                            {isAdding || isUpdating ? 'Processing...' : (isEditMode ? 'Update' : 'Add')}
                        </Button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
};

export default Banners;
