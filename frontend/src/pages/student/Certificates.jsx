import React from 'react';
import StudentLayout from '@/layouts/StudentLayout';
import { useGetStudentCertificatesQuery } from '@/api/services/certificatesApi';
import { Card, CardContent } from '@/components/ui/Card';
import { Award, Download, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { getFileUrl } from '@/utils/fileUrl';

const Certificates = () => {
    const { data: certificates, isLoading } = useGetStudentCertificatesQuery();

    return (
        <StudentLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                    My Certificates & Reports
                </h1>
                <p className="text-slate-500 text-sm italic">Your official academic achievements and report cards.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    [1,2,3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-xl animate-pulse" />)
                ) : certificates?.length > 0 ? (
                    certificates.map((c) => (
                        <Card key={c._id} className="border-none shadow-sm hover:shadow-md transition-shadow group overflow-hidden border-t-4 border-amber-500">
                            <CardContent className="p-0">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                                            <Award size={24} />
                                        </div>
                                        <Badge variant="outline" className="text-[10px] font-bold uppercase">Issued</Badge>
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-lg mb-1 leading-tight">{c.title}</h3>
                                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">{c.description || 'Official academic record issued by the institution.'}</p>
                                    
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <Calendar size={12} /> {new Date(c.issueDate).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                                    <Button variant="ghost" size="sm" className="gap-2 text-amber-600 font-bold hover:bg-white" as="a" href={getFileUrl(c.fileUrl)} target="_blank" rel="noopener noreferrer">
                                        <Download size={14} /> Download PDF
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full p-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                        <Award size={48} className="mx-auto text-slate-200 mb-4" />
                        <h3 className="text-slate-400 font-medium italic">You haven't received any certificates yet.</h3>
                    </div>
                )}
            </div>
        </StudentLayout>
    );
};

export default Certificates;
