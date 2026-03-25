import React, { useState } from 'react';
import StaffLayout from '@/layouts/StaffLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BookOpen, Send, Loader2 } from 'lucide-react';
import { useEnterMarksMutation } from '@/api/services/staffResultsApi';
import toast from 'react-hot-toast';

const MarksEntry = () => {
    const [formData, setFormData] = useState({ studentId: '', examId: '', marksObtained: '' });
    const [enterMarks, { isLoading }] = useEnterMarksMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await enterMarks(formData).unwrap();
            toast.success('Marks updated successfully');
            setFormData({ ...formData, marksObtained: '' });
        } catch (err) { toast.error(err.data?.message || 'Failed to enter marks'); }
    };

    return (
        <StaffLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Results Management</h1>
                <p className="text-slate-500 text-sm">Enter and update student performance for examinations.</p>
            </div>

            <div className="max-w-2xl">
                <Card className="border-none shadow-xl shadow-slate-200/50">
                    <CardHeader className="bg-primary/5 border-b border-primary/10">
                        <CardTitle className="text-primary flex items-center gap-2">
                            <BookOpen size={20} /> Evaluation Form
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Student Database ID</label>
                                    <Input 
                                        placeholder="e.g. 65db..." 
                                        value={formData.studentId} 
                                        onChange={e => setFormData({...formData, studentId: e.target.value})} 
                                        required 
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Exam Database ID</label>
                                    <Input 
                                        placeholder="e.g. 65ex..." 
                                        value={formData.examId} 
                                        onChange={e => setFormData({...formData, examId: e.target.value})} 
                                        required 
                                        className="h-11"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Marks Obtained</label>
                                <Input 
                                    type="number" 
                                    placeholder="Enter score (e.g. 85)" 
                                    value={formData.marksObtained} 
                                    onChange={e => setFormData({...formData, marksObtained: e.target.value})} 
                                    required 
                                    className="h-11 text-lg font-bold text-primary"
                                />
                            </div>

                            <Button type="submit" className="w-full h-12 gap-2" disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                                {isLoading ? 'Submitting Score...' : 'Post Evaluation'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </StaffLayout>
    );
};

export default MarksEntry;
