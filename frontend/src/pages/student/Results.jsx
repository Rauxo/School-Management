import React from 'react';
import StudentLayout from '@/layouts/StudentLayout';
import { useGetStudentProfileQuery } from '@/api/services/studentDataApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const Results = () => {
    const { data, isLoading } = useGetStudentProfileQuery();

    const results = data?.results || [];

    return (
        <StudentLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                    Academic Results
                </h1>
                <p className="text-slate-500 text-sm italic">Review your complete exam performance and scores.</p>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-xl animate-pulse" />)}
                </div>
            ) : results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((r, i) => {
                        const scorePercentage = (r.marksObtained / r.exam?.maxMarks) * 100;
                        return (
                            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow group overflow-hidden flex flex-col">
                                <CardHeader className="border-b border-slate-100 bg-slate-50 p-5 flex flex-row items-center justify-between space-y-0">
                                    <div>
                                        <CardTitle className="text-slate-800 text-lg font-bold mb-1">{r.exam?.title}</CardTitle>
                                        <div className="text-xs text-slate-500 font-medium">Max Marks: {r.exam?.maxMarks}</div>
                                    </div>
                                    <Badge variant={r.status === 'pass' ? 'success' : 'destructive'} className="uppercase">
                                        {r.status}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="p-6 flex-1 flex flex-col justify-center">
                                    <div className="flex items-end justify-between mb-4">
                                        <div>
                                            <span className="text-4xl font-extrabold text-slate-800 tracking-tighter">{r.marksObtained}</span>
                                            <span className="text-slate-400 font-bold ml-1">/ {r.exam?.maxMarks}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Score</span>
                                            <span className={`text-sm font-bold ${scorePercentage >= 75 ? 'text-emerald-500' : (scorePercentage >= 50 ? 'text-blue-500' : 'text-red-500')}`}>
                                                {scorePercentage.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="w-full bg-slate-100 rounded-full h-3 mt-auto">
                                        <div 
                                            className={`h-3 rounded-full ${scorePercentage >= 75 ? 'bg-gradient-to-r from-emerald-400 to-green-500' : (scorePercentage >= 50 ? 'bg-gradient-to-r from-blue-400 to-indigo-500' : 'bg-gradient-to-r from-red-400 to-rose-500')}`} 
                                            style={{ width: `${Math.min(100, scorePercentage)}%` }}
                                        ></div>
                                    </div>
                                    
                                    {r.remarks && (
                                        <p className="mt-4 text-xs tabular-nums text-slate-500 italic p-3 bg-white rounded-lg border border-slate-100">
                                            "{r.remarks}"
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="p-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                    <div className="size-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold">📄</span>
                    </div>
                    <h3 className="text-slate-500 font-medium italic">No exam results published yet.</h3>
                </div>
            )}
        </StudentLayout>
    );
};

export default Results;
