import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, Button } from '@/components/UI';
import axios from 'axios';

const StaffManagement = () => {
    const [staff, setStaff] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', employeeId: '', designation: '', salary: 0
    });

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const { data } = await axios.get('/api/admin/staff');
            setStaff(data);
        } catch (err) { console.error(err); }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/admin/staff', formData);
            setShowModal(false);
            fetchStaff();
        } catch (err) { alert(err.response?.data?.message || 'Error'); }
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Staff Management</h1>
                <Button onClick={() => setShowModal(true)}>Add Staff</Button>
            </div>

            <Card className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-100 text-slate-400 text-sm">
                            <th className="pb-4 font-medium">Name</th>
                            <th className="pb-4 font-medium">Emp ID</th>
                            <th className="pb-4 font-medium">Designation</th>
                            <th className="pb-4 font-medium text-right">Salary</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {staff.map((s) => (
                            <tr key={s._id} className="text-sm">
                                <td className="py-4 font-semibold text-slate-700">{s.user?.name}</td>
                                <td className="py-4">{s.employeeId}</td>
                                <td className="py-4 italic text-slate-500">{s.designation}</td>
                                <td className="py-4 text-right font-medium">₹{s.salary.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="max-w-md w-full" title="Add New Staff">
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input className="p-2 border rounded-lg text-sm" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                <input className="p-2 border rounded-lg text-sm" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                            </div>
                            <input className="w-full p-2 border rounded-lg text-sm" type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                            <div className="grid grid-cols-2 gap-4">
                                <input className="p-2 border rounded-lg text-sm" placeholder="Employee ID" value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})} required />
                                <input className="p-2 border rounded-lg text-sm" placeholder="Designation" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} required />
                            </div>
                            <input className="w-full p-2 border rounded-lg text-sm" type="number" placeholder="Salary" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} required />
                            <div className="flex gap-3 justify-end mt-6">
                                <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit">Save Staff</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </DashboardLayout>
    );
};

export default StaffManagement;
