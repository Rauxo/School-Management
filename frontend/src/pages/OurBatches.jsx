import React from "react";
import PageLayout from "../layouts/PageLayout";

function OurBatches() {
  const batches = [
    {
      name: "BCA 1st Year",
      duration: "2025 - 2028",
      desc: "Focused on programming, databases, and software development.",
    },
    {
      name: "BSc IT",
      duration: "2024 - 2027",
      desc: "Covers networking, IT systems, and application development.",
    },
    {
      name: "Commerce Batch",
      duration: "2025 - 2028",
      desc: "Includes accounting, business studies, and economics.",
    },
    {
      name: "Arts Batch",
      duration: "2025 - 2028",
      desc: "Subjects include history, political science, and literature.",
    },
  ];

  return (
    <PageLayout>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 px-6 pt-32 pb-16">

        <div className="max-w-7xl mx-auto">

          {/* HEADING */}
          <h1 className="text-4xl font-bold text-gray-800 mb-10">
            🎓 Our Batches
          </h1>

          {/* GRID */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {batches.map((item, i) => (
              <div
                key={i}
                className="bg-white shadow-lg p-6 hover:shadow-xl transition"
              >
                {/* TITLE */}
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.name}
                </h2>

                {/* DURATION */}
                <p className="text-sm text-blue-600 font-medium mb-2">
                  Duration: {item.duration}
                </p>

                {/* DESCRIPTION */}
                <p className="text-gray-600 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}

          </div>

        </div>

      </div>

    </PageLayout>
  );
}

export default OurBatches;