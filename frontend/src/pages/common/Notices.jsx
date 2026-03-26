import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import StaffLayout from '@/layouts/StaffLayout';
import StudentLayout from '@/layouts/StudentLayout';
import { useSelector } from 'react-redux';
import { useGetNoticesQuery, useCreateNoticeMutation, useMarkNoticeAsReadMutation } from '@/api/services/noticesApi';
import { Card, CardContent } from '@/components/ui/Card';
import { Bell, Clock, ChevronRight, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/common/Modal';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

const Notices = () => {
    const { user } = useSelector(state => state.auth);
    const { data: notices, isLoading } = useGetNoticesQuery();
    const [createNotice, { isLoading: isSaving }] = useCreateNoticeMutation();
    const [markAsRead] = useMarkNoticeAsReadMutation();

    const [isModalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', content: '', targetRoles: [] });

    const Layout = user?.role === 'admin' ? AdminLayout : user?.role === 'staff' ? StaffLayout : StudentLayout;

    const isUnread = (notice) => {
        if (!user?._id) return false;
        return !notice.readBy?.includes(user._id);
    };

    const handleNoticeClick = async (notice) => {
        if (isUnread(notice)) {
            try {
                await markAsRead(notice._id).unwrap();
            } catch {
                // Silent fail — UI still functions
            }
        }
    };

    const handleRoleChange = (role) => {
        const updatedRoles = formData.targetRoles.includes(role)
            ? formData.targetRoles.filter(r => r !== role)
            : [...formData.targetRoles, role];
        setFormData({ ...formData, targetRoles: updatedRoles });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.targetRoles.length === 0) {
            toast.error('Please select at least one target role');
            return;
        }
        try {
            await createNotice(formData).unwrap();
            toast.success('Notice posted successfully');
            setModalOpen(false);
            setFormData({ title: '', content: '', targetRoles: [] });
        } catch (err) { toast.error('Failed to post notice'); }
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Institutional Announcements</h1>
                    <p className="text-slate-500 text-sm">Stay updated with the latest news and schedules.</p>
                </div>
                {user?.role === 'admin' && (
                    <Button onClick={() => setModalOpen(true)} className="gap-2">
                        <Plus size={18} /> Post Notice
                    </Button>
                )}
            </div>

            <div className="max-w-3xl space-y-4">
                {isLoading ? (
                    [1,2,3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />)
                ) : notices?.length > 0 ? (
                    notices.map((n) => {
                        const unread = isUnread(n);
                        return (
                            <Card
                                key={n._id}
                                className={`border-none shadow-sm hover:translate-x-1 transition-transform cursor-pointer group ${unread ? 'ring-2 ring-primary/20 bg-primary/[0.02]' : ''}`}
                                onClick={() => handleNoticeClick(n)}
                            >
                                <CardContent className="p-5 flex gap-4 items-start">
                                    <div className="relative shrink-0">
                                        <div className="p-3 bg-primary/5 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                                            <Bell size={20} />
                                        </div>
                                        {/* Red unread dot */}
                                        {unread && (
                                            <span className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className={`font-bold leading-tight ${unread ? 'text-slate-900' : 'text-slate-700'}`}>
                                                {n.title}
                                                {unread && (
                                                    <span className="ml-2 text-[10px] font-bold text-red-500 uppercase tracking-widest">New</span>
                                                )}
                                            </h3>
                                            <div className="flex gap-1">
                                                {n.targetRoles?.map(role => (
                                                    <Badge key={role} variant="outline" className="text-[10px] uppercase">{role}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 line-clamp-2 mb-3 leading-relaxed">{n.content}</p>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                            <Clock size={12} /> {new Date(n.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-slate-300 group-hover:text-primary mt-2" />
                                </CardContent>
                            </Card>
                        );
                    })
                ) : (
                    <div className="p-12 text-center text-slate-400 italic">No notices posted recently.</div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Upload New Announcement">
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Notice Title</label>
                        <Input placeholder="Urgent: Schedule Update" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Notice Content</label>
                        <textarea
                            className="w-full h-32 px-3 py-2 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="Detailed information about the announcement..."
                            value={formData.content}
                            onChange={e => setFormData({...formData, content: e.target.value})}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 block">Target Audience</label>
                        <div className="flex gap-4">
                            {['student', 'staff', 'admin', 'public'].map(role => (
                                <label key={role} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.targetRoles.includes(role)}
                                        onChange={() => handleRoleChange(role)}
                                        className="size-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                                    />
                                    <span className="text-sm text-slate-600 capitalize">{role}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3 justify-end mt-8 pt-4 border-t">
                        <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSaving}>{isSaving ? 'Posting...' : 'Post Notice'}</Button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
};

export default Notices;
