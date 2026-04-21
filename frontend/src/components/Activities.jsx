import React from "react";
import img1 from "./1.jpeg"
import img2 from "./2.jpeg"
import img3 from "./3.jpeg"
import img4 from "./4.jpeg"

function Activities() {
  const activities = [
    {
      img: img1,
    },
    {
      img: img2,
    },
    {
      img:img3,
    },
    {
      img: img4,
    },
  ];

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-purple-100 py-16 px-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADING */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800">
             Gallery
          </h2>
          <div className="w-16 h-1 bg-blue-600 mt-2"></div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          {activities.map((item, i) => (
            <div
              key={i}
              className="relative overflow-hidden shadow-lg group cursor-pointer"
            >
              {/* IMAGE */}
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center">

                <h3 className="text-white text-xl font-semibold transform translate-y-6 group-hover:translate-y-0 transition duration-500">
                  {item.name}
                </h3>

              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default Activities;