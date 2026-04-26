import React from "react";
import PageLayout from "../layouts/PageLayout";
import { useGetPublicStaffQuery } from "@/api/services/staffApi";
import { useGetPublicNoticesQuery } from "@/api/services/noticesApi";
import { Card, CardContent } from "@/components/ui/Card";
import { Bell, Clock } from "lucide-react";

function OurStaff() {
  const { data: staff, isLoading: staffLoading } = useGetPublicStaffQuery();
  const { data: notices, isLoading: noticesLoading } = useGetPublicNoticesQuery();

  const staffNotices = notices?.filter(n => n.targetRoles.includes('staff')) || [];

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 px-6 pt-32 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* HEADING */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-2"> Our Dedicated Staff</h1>
            <p className="text-slate-500">Meet the experts behind our students' success.</p>
          </div>

          {/* STAFF GRID */}
          {staffLoading ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white h-48 rounded-2xl animate-pulse shadow-lg" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-20 text-center">
              {staff?.map((item) => (
                <div key={item._id} className="bg-white shadow-lg p-6 rounded-2xl border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="relative inline-block mb-4">
                    {item.image ? (
                      <img
                        src={`http://localhost:5000${item.image}`}
                        alt={item.user?.name}
                        className="w-28 h-28 mx-auto object-cover rounded-2xl shadow-md border-2 border-primary/10"
                      />
                    ) : (
                      <div className="w-28 h-28 mx-auto bg-primary/5 flex items-center justify-center rounded-2xl text-primary text-4xl font-bold shadow-sm">
                        {item.user?.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">{item.user?.name}</h2>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1 mb-3">{item.designation}</p>
                  
                  <div className="flex flex-wrap justify-center gap-1">
                    {item.assignedBatches?.map(b => (
                      <span key={b._id} className="px-2 py-0.5 bg-slate-50 text-[10px] text-slate-500 rounded-full border border-slate-200">
                        {b.name}
                      </span>
                    )) || <span className="text-xs text-slate-400 italic">No assigned batches</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STAFF NOTICES SECTION */}
          {staffNotices.length > 0 && (
            <div className="mt-16 bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-white shadow-sm">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Bell className="text-primary" /> Staff Announcements
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {staffNotices.map((n) => (
                  <Card key={n._id} className="border-none shadow-sm bg-white/80 hover:bg-white transition-all">
                    <CardContent className="p-5">
                      <h3 className="font-bold text-slate-800 mb-2">{n.title}</h3>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-3">{n.content}</p>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        <Clock size={12} /> {new Date(n.createdAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

export default OurStaff;