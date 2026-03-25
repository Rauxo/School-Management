import React, { useEffect, useState } from "react";
import PageLayout from "../layouts/PageLayout";

function HomePage() {
  const images = [
    "https://northeastlive.s3.amazonaws.com/media/uploads/2021/02/Dibrugarh-University.jpg",
    "https://drcollege.ac.in/banner/560ab7275c4804e20078cc161a9a2e36.jpg",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageLayout>

      {/* MAIN SECTION */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-6 pt-32 pb-10">

        <div className="max-w-7xl mx-auto w-full flex gap-6">

          {/* LEFT - IMAGE (70%) */}
          <div className="w-[70%] h-[75vh] relative overflow-hidden shadow-lg">

            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Institute"
                className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-1000 ease-in-out
                ${
                  i === index
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"
                }`}
              />
            ))}

          </div>

          {/* RIGHT - NOTICE (30%) */}
          <div className="w-[30%] bg-white shadow-lg p-6 flex flex-col">

            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
              📢 Notification
            </h2>

            <div className="flex-1 overflow-hidden relative group">

              <div className="animate-scrollUpBottom group-hover:[animation-play-state:paused] space-y-5">

                {[
                  "Admission open for 2026 batch",
                  "Mid-term exams starting from April 10",
                  "New study materials uploaded",
                  "Holiday on account of festival",
                  "Staff meeting scheduled on Monday",
                  "Annual function registrations open",
                ].map((notice, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 text-gray-700 text-base"
                  >
                    <span className="text-red-600  text-lg">➤</span>
                    <p>{notice}</p>
                  </div>
                ))}

              </div>

            </div>
          </div>

        </div>
      </div>

    </PageLayout>
  );
}

export default HomePage;