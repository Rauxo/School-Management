import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, Button } from '@/components/UI';
import axios from 'axios';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', rollNumber: '', batchId: ''
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        const { data } = await axios.get('/api/admin/students');
        setStudents(data);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/admin/students', formData);
            setShowModal(false);
            fetchStudents();
        } catch (err) { alert(err.response?.data?.message || 'Error'); }
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Student Management</h1>
                <Button onClick={() => setShowModal(true)}>Add Student</Button>
            </div>

            <Card className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-100 italic text-slate-400 text-sm">
                            <th className="pb-4 font-medium">Name</th>
                            <th className="pb-4 font-medium">Roll No</th>
                            <th className="pb-4 font-medium">Batch</th>
                            <th className="pb-4 font-medium">Email</th>
                            <th className="pb-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {students.map((s) => (
                            <tr key={s._id} className="text-sm">
                                <td className="py-4 font-semibold text-slate-700">{s.user?.name}</td>
                                <td className="py-4">{s.rollNumber}</td>
                                <td className="py-4">{s.batch?.name || 'N/A'}</td>
                                <td className="py-4">{s.user?.email}</td>
                                <td className="py-4 text-right">
                                    <button className="text-primary font-medium hover:underline">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="max-w-md w-full" title="Add New Student">
                        <form onSubmit={handleAdd} className="space-y-4">
                            <input 
                                className="w-full p-2 border rounded-lg text-sm" 
                                placeholder="Name" 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                required 
                            />
                            <input 
                                className="w-full p-2 border rounded-lg text-sm" 
                                placeholder="Email" 
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                required 
                            />
                            <input 
                                className="w-full p-2 border rounded-lg text-sm" 
                                type="password"
                                placeholder="Password" 
                                value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})}
                                required 
                            />
                            <input 
                                className="w-full p-2 border rounded-lg text-sm" 
                                placeholder="Roll Number" 
                                value={formData.rollNumber}
                                onChange={e => setFormData({...formData, rollNumber: e.target.value})}
                                required 
                            />
                            <div className="flex gap-3 justify-end mt-6">
                                <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit">Save Student</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </DashboardLayout>
    );
};

export default StudentManagement;
