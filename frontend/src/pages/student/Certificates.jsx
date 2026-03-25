import React from 'react';
import StudentLayout from '@/layouts/StudentLayout';
import { useGetCertificatesQuery } from '@/api/services/certificatesApi';
import { Card, CardContent } from '@/components/ui/Card';
import { Award, Download, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const Certificates = () => {
    const { data: certs, isLoading } = useGetCertificatesQuery();

    return (
        <StudentLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Achievements & Certificates</h1>
                <p className="text-slate-500 text-sm">Download your verified institutional credentials.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {isLoading ? (
                    [1,2].map(i => <div key={i} className="h-48 bg-slate-100 rounded-2xl animate-pulse" />)
                ) : certs?.length > 0 ? (
                    certs.map((c) => (
                        <Card key={c._id} className="border-none shadow-xl shadow-slate-200/50 bg-gradient-to-br from-white to-slate-50 overflow-hidden group">
                           <CardContent className="p-8 relative">
                               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                   <Award size={120} />
                               </div>
                               
                               <div className="flex items-center gap-2 mb-6 text-primary">
                                   <ShieldCheck size={20} className="fill-primary/20" />
                                   <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Verified Credential</span>
                               </div>

                               <h2 className="text-xl font-extrabold text-slate-900 mb-2 leading-tight uppercase tracking-tight">{c.title}</h2>
                               <p className="text-sm text-slate-500 mb-8 border-l-2 border-slate-200 pl-4 italic">Awarded on {new Date(c.createdAt).toLocaleDateString()}</p>

                               <div className="flex justify-between items-end">
                                   <div className="space-y-1">
                                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital ID</p>
                                       <p className="text-xs font-mono text-slate-600">ID-{c._id.slice(-8).toUpperCase()}</p>
                                   </div>
                                   <Button className="rounded-xl shadow-lg shadow-primary/20" as="a" href={c.fileUrl} target="_blank">
                                       <Download size={16} className="mr-2" /> Download PDF
                                   </Button>
                               </div>
                           </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100 text-center">
                        <Award size={40} className="mx-auto text-slate-200 mb-4" />
                        <h3 className="text-slate-400 font-medium italic">No certificates found yet. Keep up the good work!</h3>
                    </div>
                )}
            </div>
        </StudentLayout>
    );
};

export default Certificates;
