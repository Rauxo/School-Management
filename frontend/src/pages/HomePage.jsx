import React, { useEffect, useState } from "react";
import PageLayout from "../layouts/PageLayout";
import Welcome from "../components/Welcome";
import Activities from "../components/Activities";
import { useGetBannersQuery } from "@/api/services/bannerApi";
import { useGetPublicNoticesQuery } from "@/api/services/noticesApi";

function HomePage() {
  const { data: banners, isLoading: bannersLoading } = useGetBannersQuery();
  const { data: notices, isLoading: noticesLoading } = useGetPublicNoticesQuery();

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners && banners.length > 0) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % banners.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  return (
    <PageLayout>
      {/* MAIN SECTION */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-6 pt-32 pb-10">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-6">
          {/* LEFT - IMAGE (70%) */}
          <div className="w-full md:w-[70%] h-[50vh] md:h-[75vh] relative overflow-hidden shadow-lg rounded-2xl">
            {bannersLoading ? (
              <div className="w-full h-full bg-slate-200 animate-pulse flex items-center justify-center">
                <p className="text-slate-400 font-bold">Loading Banners...</p>
              </div>
            ) : banners && banners.length > 0 ? (
              banners.map((banner, i) => (
                <div key={banner._id} className={`absolute top-0 left-0 w-full h-full transition-all duration-1000 ease-in-out ${i === index ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}>
                  <img
                    src={`http://localhost:5000${banner.imageUrl}`}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  {(banner.title || banner.description) && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md p-6 text-white">
                      <h3 className="text-2xl font-bold mb-1">{banner.title}</h3>
                      <p className="text-sm opacity-90">{banner.description}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                <p className="text-slate-400 italic">No active banners available.</p>
              </div>
            )}
          </div>

          {/* RIGHT - NOTICE (30%) */}
          <div className="w-full md:w-[30%] bg-white shadow-lg p-6 flex flex-col rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
              📢 <span className="tracking-tight">Notice Board</span>
            </h2>

            <div className="flex-1 overflow-hidden relative group min-h-[300px]">
              {noticesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-12 bg-slate-50 rounded animate-pulse" />
                  ))}
                </div>
              ) : notices && notices.length > 0 ? (
                <div className="animate-scrollUpBottom group-hover:[animation-play-state:paused] space-y-5">
                  {[...notices, ...notices].map((notice, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 bg-slate-50/50 p-3 rounded-lg border border-slate-100 hover:border-primary/20 hover:bg-white transition-all"
                    >
                      <span className="text-primary mt-1">➤</span>
                      <div>
                        <p className="font-bold text-slate-800 text-sm mb-1">{notice.title}</p>
                        <p className="text-xs text-slate-600 line-clamp-2">{notice.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center italic text-slate-400 text-sm">
                  No public notices available.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Welcome />
      <Activities/>
    </PageLayout>
  );
}

export default HomePage;
