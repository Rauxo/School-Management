import React, { useState } from 'react';
import StaffLayout from '@/layouts/StaffLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BookOpen, Send, Loader2, ChevronDown } from 'lucide-react';
import { useEnterMarksMutation } from '@/api/services/staffResultsApi';
import { useGetExamsQuery } from '@/api/services/examsApi';
import { useGetBatchStudentsQuery } from '@/api/services/staffAttendanceApi';
import toast from 'react-hot-toast';

const MarksEntry = () => {
    const [selectedExamId, setSelectedExamId] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [marksObtained, setMarksObtained] = useState('');
    const [remarks, setRemarks] = useState('');

    const { data: exams, isLoading: examsLoading } = useGetExamsQuery();
    const [enterMarks, { isLoading }] = useEnterMarksMutation();

    // Derive the batchId from the selected exam
    const selectedExam = exams?.find(e => e._id === selectedExamId);
    const batchId = selectedExam?.batch?._id;  // ✅ FIX: extract the actual ID, not the whole object

    const { data: students, isFetching: studentsFetching } = useGetBatchStudentsQuery(batchId, {
        skip: !batchId
    });

    const handleExamChange = (e) => {
        setSelectedExamId(e.target.value);
        setSelectedStudentId(''); // reset student when exam changes
        setMarksObtained('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await enterMarks({
                examId: selectedExamId,
                studentId: selectedStudentId,
                marksObtained: Number(marksObtained),
                remarks
            }).unwrap();
            toast.success('Marks updated successfully');
            setMarksObtained('');
            setRemarks('');
            setSelectedStudentId('');
        } catch (err) { toast.error(err.data?.message || 'Failed to enter marks'); }
    };

    return (
        <StaffLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Results Management</h1>
                <p className="text-slate-500 text-sm">Select an exam to load its batch, then choose a student and enter marks.</p>
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

                            {/* Step 1: Select Exam */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    Step 1 — Select Exam
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedExamId}
                                        onChange={handleExamChange}
                                        required
                                        className="w-full h-11 px-3 pr-10 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none text-slate-700"
                                    >
                                        <option value="">— Choose an exam —</option>
                                        {exams?.map(exam => (
                                            <option key={exam._id} value={exam._id}>
                                                {exam.title} {exam.batch ? '' : '(No batch)'}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                                {selectedExam && (
                                    <p className="text-xs text-slate-400 ml-1">
                                        Max: {selectedExam.maxMarks} | Pass: {selectedExam.passingMarks} | Date: {new Date(selectedExam.examDate).toLocaleDateString()}
                                    </p>
                                )}
                            </div>

                            {/* Step 2: Select Student (populated from batch) */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    Step 2 — Select Student  {batchId && !studentsFetching && `(${students?.length ?? 0} in batch)`}
                                </label>
                                <div className="relative">
                                    {studentsFetching ? (
                                        <div className="h-11 bg-slate-100 rounded-md animate-pulse" />
                                    ) : (
                                        <>
                                            <select
                                                value={selectedStudentId}
                                                onChange={e => setSelectedStudentId(e.target.value)}
                                                required
                                                disabled={!batchId || studentsFetching}
                                                className="w-full h-11 px-3 pr-10 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none text-slate-700 disabled:bg-slate-50 disabled:text-slate-400"
                                            >
                                                <option value="">{!selectedExamId ? '— Select exam first —' : !batchId ? '— Exam has no batch assigned —' : '— Choose a student —'}</option>
                                                {students?.map(s => (
                                                    <option key={s._id} value={s._id}>
                                                        {s.user?.name} ({s.rollNumber})
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Step 3: Marks + Remarks */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Marks Obtained</label>
                                    <Input
                                        type="number"
                                        placeholder={selectedExam ? `0 – ${selectedExam.maxMarks}` : 'Enter score'}
                                        value={marksObtained}
                                        onChange={e => setMarksObtained(e.target.value)}
                                        min={0}
                                        max={selectedExam?.maxMarks}
                                        required
                                        className="h-11 text-lg font-bold text-primary"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Remarks (optional)</label>
                                    <Input
                                        placeholder="e.g. Good effort"
                                        value={remarks}
                                        onChange={e => setRemarks(e.target.value)}
                                        className="h-11"
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-12 gap-2" disabled={isLoading || !selectedExamId || !selectedStudentId}>
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