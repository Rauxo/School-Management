import React, { useState } from 'react';
import StaffLayout from '@/layouts/StaffLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Check, X, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react';
import { useGetBatchStudentsQuery, useMarkAttendanceMutation } from '@/api/services/staffAttendanceApi';
import { useGetMyBatchesQuery, useGetTodayAttendanceQuery } from '@/api/services/dashboardApi';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/Badge';

const Attendance = () => {
    const [selectedBatchId, setSelectedBatchId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const { data: myBatches, isLoading: batchesLoading } = useGetMyBatchesQuery();
    const { data: students, isFetching } = useGetBatchStudentsQuery(selectedBatchId, { skip: !selectedBatchId });
    const { data: todayMap, refetch: refetchToday } = useGetTodayAttendanceQuery(selectedBatchId, { skip: !selectedBatchId });
    const [markAttendance, { isLoading: isMarking }] = useMarkAttendanceMutation();

    // Check if entire batch is already marked today
    const batchAlreadyMarked = students?.length > 0 && todayMap && students.every(s => todayMap[s._id]);

    const handleMark = async (studentId, status) => {
        try {
            await markAttendance({ studentId, batchId: selectedBatchId, status }).unwrap();
            // refetch today's status map
            refetchToday();
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
                <p className="text-slate-500 text-sm italic font-medium">Select one of your assigned batches to begin marking.</p>
            </div>

            {/* Batch Selector */}
            <Card className="mb-8 border-none shadow-sm bg-primary/5">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-1">
                        <label className="text-xs font-bold text-primary uppercase ml-1">Select Assigned Batch</label>
                        {batchesLoading ? (
                            <div className="h-10 bg-white rounded-md animate-pulse" />
                        ) : myBatches?.length > 0 ? (
                            <div className="relative">
                                <select
                                    value={selectedBatchId}
                                    onChange={e => { setSelectedBatchId(e.target.value); setSearchQuery(''); }}
                                    className="w-full h-10 px-3 pr-10 rounded-md border border-transparent bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none text-slate-700"
                                >
                                    <option value="">— Choose a batch —</option>
                                    {myBatches.map(b => (
                                        <option key={b._id} value={b._id}>{b.name}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-md px-3 py-2.5 text-sm text-amber-700">
                                <AlertCircle size={16} /> No batches assigned. Ask your admin to assign you to a batch.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Already-marked banner */}
            {batchAlreadyMarked && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl px-5 py-4 mb-6 text-green-700">
                    <CheckCircle2 size={20} className="shrink-0" />
                    <div>
                        <p className="font-bold text-sm">Attendance already marked for today!</p>
                        <p className="text-xs text-green-600">You can still update individual statuses if needed.</p>
                    </div>
                </div>
            )}

            {selectedBatchId && (
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
                            filteredStudents.map((s) => {
                                const todayStatus = todayMap?.[s._id];
                                return (
                                    <Card key={s._id} className={`transition-colors group ${todayStatus === 'present' ? 'border-green-200 bg-green-50/30' : todayStatus === 'absent' ? 'border-red-200 bg-red-50/20' : 'hover:border-primary/50'}`}>
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-slate-50 flex items-center justify-center font-bold text-slate-400 border border-slate-100 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                                    {s.user?.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm leading-tight">{s.user?.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.rollNumber}</p>
                                                    {todayStatus && (
                                                        <Badge
                                                            variant="outline"
                                                            className={`text-[9px] mt-1 ${todayStatus === 'present' ? 'text-green-600 border-green-200 bg-green-50' : 'text-red-600 border-red-200 bg-red-50'}`}
                                                        >
                                                            {todayStatus}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleMark(s._id, 'present')}
                                                    disabled={isMarking}
                                                    className={`size-8 rounded-lg flex items-center justify-center transition-all shadow-sm active:scale-90 disabled:opacity-50 ${todayStatus === 'present' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'}`}
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleMark(s._id, 'absent')}
                                                    disabled={isMarking}
                                                    className={`size-8 rounded-lg flex items-center justify-center transition-all shadow-sm active:scale-90 disabled:opacity-50 ${todayStatus === 'absent' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'}`}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })
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
