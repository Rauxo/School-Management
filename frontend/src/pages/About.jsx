import React from "react";
import PageLayout from "../layouts/PageLayout";
import img from "../components/1.jpeg"

function About() {
  return (
    <PageLayout>

      {/* MAIN SECTION */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-6 pt-32 pb-16">

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT - TEXT */}
          <div className="space-y-6">

            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              About Us
            </h1>

            <div className="w-20 h-1 bg-blue-600"></div>

            <p className="text-gray-700 text-lg leading-relaxed">
              GURU GLOBAL EDUCATION is a premier educational institution dedicated to
              excellence in teaching, learning, and innovation. We aim to create
              a dynamic academic environment where students can grow both
              intellectually and personally.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed">
              Our institution integrates modern technology with traditional
              values to ensure quality education. We focus on empowering
              students, supporting staff, and building a strong academic
              community.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed">
              With experienced faculty, advanced infrastructure, and a commitment
              to continuous improvement, we strive to shape future leaders and
              responsible citizens.
            </p>
          </div>

          {/* RIGHT - IMAGE */}
          <div className="w-full h-[400px] md:h-[500px] overflow-hidden shadow-xl">

            <img
              src={img}
              alt="Institute"
              className="w-full h-full object-cover hover:scale-105 transition duration-500"
            />

          </div>

        </div>
      </div>

      {/* EXTRA SECTION (OPTIONAL) */}
      <div className="bg-white py-16 px-6">

        <div className="max-w-7xl mx-auto text-center space-y-6">

          <h2 className="text-3xl font-semibold text-gray-800">
            Our Vision & Mission
          </h2>

          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Our vision is to provide quality education that nurtures innovation,
            creativity, and leadership. Our mission is to empower students with
            knowledge, skills, and values that help them succeed in life and
            contribute to society.
          </p>

        </div>
      </div>

    </PageLayout>
  );
}

export default About;