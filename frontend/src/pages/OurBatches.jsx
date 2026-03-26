import React from "react";
import PageLayout from "../layouts/PageLayout";
import { useGetPublicBatchesQuery } from "@/api/services/batchesApi";

function OurBatches() {
  const { data: batches, isLoading } = useGetPublicBatchesQuery();

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 px-6 pt-32 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* HEADING */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">🎓 Our Training Batches</h1>
            <p className="text-slate-500">Explore our wide range of professional and academic courses.</p>
          </div>

          {/* GRID */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white h-48 rounded-2xl animate-pulse shadow-sm" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {batches?.map((item) => (
                <div
                  key={item._id}
                  className="bg-white shadow-sm p-8 rounded-2xl border border-slate-100 hover:shadow-md transition-all hover:bg-slate-50 group"
                >
                  <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors mb-6 font-bold text-xl">
                    {item.name.charAt(0)}
                  </div>
                  {/* TITLE */}
                  <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors">
                    {item.name}
                  </h2>

                  {/* DESCRIPTION */}
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>

                  <div className="pt-4 border-t border-slate-100 mt-auto">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">Active Enrollment</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && (!batches || batches.length === 0) && (
            <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-slate-200">
               <p className="text-slate-400 italic font-medium">No batches are currently available for display.</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

export default OurBatches;