import React, { useState } from 'react';
import StudentLayout from '@/layouts/StudentLayout';
import { useGetStudentMaterialsQuery } from '@/api/services/studentDataApi';
import { Card, CardContent } from '@/components/ui/Card';
import { FileText, Download, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const Materials = () => {
    const { data: materials, isLoading } = useGetStudentMaterialsQuery();
    const [activeTab, setActiveTab] = useState('All');

    const filteredMaterials = materials?.filter(m => {
        if (activeTab === 'All') return true;
        const mt = m.type?.toLowerCase() || '';
        if (activeTab === 'Study Materials') return !mt.includes('practice');
        if (activeTab === 'Practice Sheets') return mt.includes('practice');
        return true;
    });

    return (
        <StudentLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    Learning Resources
                </h1>
                <p className="text-slate-500 text-sm italic">Access your shared study materials and references.</p>
            </div>

            <div className="flex gap-4 mb-6 border-b border-slate-200">
                {['All', 'Study Materials', 'Practice Sheets'].map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-bold transition-all ${activeTab === tab ? 'border-b-2 border-primary text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    [1,2,3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-xl animate-pulse" />)
                ) : filteredMaterials?.length > 0 ? (
                    filteredMaterials.map((m) => (
                        <Card key={m._id} className="border-none shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
                            <CardContent className="p-0">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                            <FileText size={24} />
                                        </div>
                                        <Badge variant="outline" className="text-[10px] font-bold uppercase">{m.type || 'PDF'}</Badge>
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-lg mb-1 leading-tight">{m.title}</h3>
                                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">{m.description || 'Reference material for your current batch.'}</p>
                                    
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <Clock size={12} /> {new Date(m.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                                    <Button variant="ghost" size="sm" className="gap-2 text-primary font-bold hover:bg-white" as="a" href={m.fileUrl} target="_blank">
                                        <Download size={14} /> Download
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full p-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                        <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                        <h3 className="text-slate-400 font-medium italic">No materials found in your archive.</h3>
                    </div>
                )}
            </div>
        </StudentLayout>
    );
};

export default Materials;
