import React from "react";

function Welcome() {
  const achievements = [
    {
      img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
      title: "Top Ranked Institute 2025",
      date: "March 2025",
    },
    {
      img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
      title: "100% Placement Record",
      date: "January 2025",
    },
    {
      img: "https://images.unsplash.com/photo-1588072432836-e10032774350",
      title: "Best Faculty Award",
      date: "December 2024",
    },
  ];

  return (
    <div className="w-full bg-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-start">

        {/* LEFT SIDE */}
        <div className="space-y-6">

          {/* ICON + TITLE */}
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 p-3 rounded-full text-white text-xl">
              🏠
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome</h2>
          </div>

          {/* LINE */}
          <div className="w-16 h-1 bg-yellow-400"></div>

          {/* TEXT */}
          <p className="text-gray-700 text-lg leading-relaxed">
            Welcome to MyInstitute, where excellence meets innovation. We are
            committed to providing a modern educational environment that empowers
            students, enhances learning experiences, and ensures academic success.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            Our platform simplifies academic management, making it easier for
            students, staff, and administrators to stay connected and productive.
          </p>

        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">

          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
            🎯 Our Achievements
          </h2>

          <div className="space-y-4">

            {achievements.map((item, i) => (
              <div
                key={i}
                className="flex gap-4 bg-white shadow-md p-3 hover:shadow-lg transition"
              >
                {/* IMAGE */}
                <img
                  src={item.img}
                  alt=""
                  className="w-24 h-20 object-cover"
                />

                {/* TEXT */}
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}

export default Welcome;