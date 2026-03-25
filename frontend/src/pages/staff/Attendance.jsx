import React, { useState } from 'react';
import StaffLayout from '@/layouts/StaffLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Check, X, Loader2 } from 'lucide-react';
import { useGetBatchStudentsQuery, useMarkAttendanceMutation } from '@/api/services/staffAttendanceApi';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/Badge';

const Attendance = () => {
    const [batchId, setBatchId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const { data: students, isFetching } = useGetBatchStudentsQuery(batchId, { skip: !batchId });
    const [markAttendance, { isLoading: isMarking }] = useMarkAttendanceMutation();

    const handleMark = async (studentId, status) => {
        try {
            await markAttendance({ studentId, batchId, status }).unwrap();
            toast.success(`Marked as ${status}`);
        } catch (err) { toast.error('Failed to mark'); }
    };

    const filteredStudents = students?.filter(s => 
        s.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <StaffLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Daily Attendance</h1>
                <p className="text-slate-500 text-sm italic font-medium">Select a batch to begin marking. (Try: {batchId || "Enter Batch ID"})</p>
            </div>

            <Card className="mb-8 border-none shadow-sm bg-primary/5">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-1">
                        <label className="text-xs font-bold text-primary uppercase ml-1">Secure Batch Authorization</label>
                        <Input 
                            placeholder="Enter Authorized Batch ID..." 
                            value={batchId} 
                            onChange={e => setBatchId(e.target.value)} 
                            className="bg-white border-transparent focus:ring-primary/20"
                        />
                    </div>
                    <Button variant="outline" className="h-10 border-primary text-primary hover:bg-primary/5">Verify Batch Access</Button>
                </CardContent>
            </Card>

            {batchId && (
                <div className="space-y-4 animate-in fade-in duration-500">
                    <div className="relative max-w-sm mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                        <Input 
                             placeholder="Filter students..." 
                             className="pl-10 bg-white" 
                             value={searchQuery}
                             onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isFetching ? (
                            [1,2,3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />)
                        ) : filteredStudents?.length > 0 ? (
                            filteredStudents.map((s) => (
                                <Card key={s._id} className="hover:border-primary/50 transition-colors group">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-slate-50 flex items-center justify-center font-bold text-slate-400 border border-slate-100 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                                {s.user?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm leading-tight">{s.user?.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.rollNumber}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleMark(s._id, 'present')}
                                                className="size-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm active:scale-90"
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleMark(s._id, 'absent')}
                                                className="size-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-90"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full">
                               <Badge variant="outline" className="w-full justify-center py-8 text-slate-400 italic">No students found matching your criteria.</Badge>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </StaffLayout>
    );
};

export default Attendance;
