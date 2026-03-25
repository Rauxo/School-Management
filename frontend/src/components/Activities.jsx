import React from "react";

function Activities() {
  const activities = [
    {
      name: "Football",
      img: "https://5.imimg.com/data5/SELLER/Default/2021/8/BE/XM/KA/9058559/sports-football.jpg",
    },
    {
      name: "Cricket",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwsiTELzQ257ZCyCt8K5v8wQnZxz-l5Bbopg&s",
    },
    {
      name: "Basketball",
      img: "https://images.unsplash.com/photo-1519861531473-9200262188bf",
    },
    {
      name: "Badminton",
      img: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff",
    },
    {
      name: "Volleyball",
      img: "https://images.unsplash.com/photo-1593341646782-e0b495cff86d",
    },
    {
      name: "Athletics",
      img: "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf",
    },
  ];

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-purple-100 py-16 px-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADING */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800">
            🏆 Activities & Sports
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