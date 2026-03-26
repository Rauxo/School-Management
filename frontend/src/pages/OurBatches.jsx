import React from "react";
import PageLayout from "../layouts/PageLayout";
import { useGetPublicBatchesQuery } from "@/api/services/batchesApi";

function OurBatches() {
  const { data: batches, isLoading } = useGetPublicBatchesQuery();

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-100 px-6 pt-32 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* HEADING */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🎓 Our Training Batches
            </h1>
            <p className="text-gray-500 text-sm">
              Explore our available courses and enroll today.
            </p>
          </div>

          {/* LOADING */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white h-40 border border-gray-300 rounded-md animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {batches?.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-gray-300 rounded-md p-5 hover:shadow-sm transition"
                >
                  {/* TITLE */}
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    {item.name}
                  </h2>

                  {/* DESCRIPTION */}
                  <p className="text-gray-600 text-sm mb-4">
                    {item.description}
                  </p>

                  {/* FOOTER */}
                  <div className="border-t pt-2 mt-2">
                    <span className="text-xs text-green-600 font-medium">
                      ● Active Enrollment
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {!isLoading && (!batches || batches.length === 0) && (
            <div className="text-center py-16 bg-white border border-gray-300 rounded-md">
              <p className="text-gray-500 text-sm">
                No batches are currently available.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

export default OurBatches;