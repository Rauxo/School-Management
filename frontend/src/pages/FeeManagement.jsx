import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, Button } from '@/components/UI';
import axios from 'axios';

const FeeManagement = () => {
    const [fees, setFees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ studentId: '', title: '', amount: '', dueDate: '' });

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        const { data } = await axios.get('/api/admin/fees');
        setFees(data);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        await axios.post('/api/admin/fees', formData);
        setShowModal(false);
        fetchFees();
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Fee Management</h1>
                <Button onClick={() => setShowModal(true)}>Create Fee Record</Button>
            </div>

            <Card className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-100 text-slate-400 text-sm">
                            <th className="pb-4 font-medium">Student</th>
                            <th className="pb-4 font-medium">Title</th>
                            <th className="pb-4 font-medium">Amount</th>
                            <th className="pb-4 font-medium">Due Date</th>
                            <th className="pb-4 font-medium text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {fees.map((f) => (
                            <tr key={f._id} className="text-sm">
                                <td className="py-4">
                                    <div className="font-semibold text-slate-700">{f.student?.user?.name}</div>
                                    <div className="text-xs text-slate-400">{f.student?.rollNumber}</div>
                                </td>
                                <td className="py-4">{f.title}</td>
                                <td className="py-4 font-medium">₹{f.amount}</td>
                                <td className="py-4">{new Date(f.dueDate).toLocaleDateString()}</td>
                                <td className="py-4 text-right">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${f.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {f.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="max-w-md w-full" title="Create New Fee">
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input className="w-full p-2 border rounded-lg text-sm" placeholder="Student ID" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} required />
                            <input className="w-full p-2 border rounded-lg text-sm" placeholder="Title (e.g., Monthly Fee - March)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                            <input className="w-full p-2 border rounded-lg text-sm" type="number" placeholder="Amount" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
                            <input className="w-full p-2 border rounded-lg text-sm" type="date" placeholder="Due Date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} required />
                            <div className="flex gap-3 justify-end mt-6">
                                <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit">Create</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </DashboardLayout>
    );
};

export default FeeManagement;
