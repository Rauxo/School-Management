import React, { useEffect, useState } from "react";
import PageLayout from "../layouts/PageLayout";

function HomePage() {
  const images = [
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
  ];

  const [index, setIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageLayout>
      <div className="min-h-screen flex items-center justify-center px-6 pt-20 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
        {/* Container */}
        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-10 items-center">
          {/* LEFT SIDE */}
          <div className="space-y-6 animate-fadeInUp">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
              Welcome to <span className="text-blue-600">MyInstitute</span>
            </h1>

            <p className="text-gray-700 text-lg max-w-lg">
              A smart platform to manage your institute efficiently. From
              attendance to results — everything in one place with a clean and
              modern experience.
            </p>

            <div className="flex gap-4">
              <button className="px-6 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition shadow-md">
                Get Started
              </button>

              <button className="px-6 py-3 rounded-xl border border-gray-400 hover:bg-gray-100 transition">
                Learn More
              </button>
            </div>
          </div>

          {/* RIGHT SIDE (SLIDER) */}
          <div className="flex justify-center relative">
            <div className="w-[90%] md:w-[80%] h-[300px] overflow-hidden rounded-2xl shadow-xl relative">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="Institute"
                  className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-1000 ease-in-out
        ${
          i === index
            ? "opacity-100 scale-100 translate-x-0 z-10"
            : "opacity-0 scale-105 translate-x-10 z-0"
        }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SCROLL SECTION */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-100 px-6">
        <div className="text-center max-w-3xl space-y-4 animate-fadeInUp">
          <h2 className="text-3xl font-semibold text-gray-800">
            Why Choose Us?
          </h2>
          <p className="text-gray-700">
            Simplify academic workflows, track performance, and manage
            everything with ease using our powerful and intuitive system.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}

export default HomePage;
