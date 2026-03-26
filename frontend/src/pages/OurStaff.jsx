import React from "react";
import PageLayout from "../layouts/PageLayout";

function OurStaff() {
  const staff = [
    {
      name: "Rahul Sharma",
      batch: "BCA 1st Year",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Anita Das",
      batch: "BSc IT 2nd Year",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Amit Roy",
      batch: "Commerce Batch",
      img: "https://randomuser.me/api/portraits/men/55.jpg",
    },
    {
      name: "Pooja Singh",
      batch: "Arts Batch",
      img: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ];

  return (
    <PageLayout>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 px-6 pt-32 pb-16">

        <div className="max-w-7xl mx-auto">

          {/* HEADING */}
          <h1 className="text-4xl font-bold text-gray-800 mb-10">
            👩‍🏫 Our Staff
          </h1>

          {/* GRID */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {staff.map((item, i) => (
              <div
                key={i}
                className="bg-white shadow-lg p-4 text-center hover:shadow-xl transition"
              >
                {/* IMAGE */}
                <img
                  src={item.img}
                  alt=""
                  className="w-28 h-28 mx-auto object-cover rounded-full mb-4"
                />

                {/* NAME */}
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h2>

                {/* BATCH */}
                <p className="text-sm text-gray-500 mt-1">
                  Assigned: {item.batch}
                </p>
              </div>
            ))}

          </div>

        </div>

      </div>

    </PageLayout>
  );
}

export default OurStaff;