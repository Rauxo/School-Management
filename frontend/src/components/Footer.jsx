import React from "react";
import logo from "./logo.jpeg"

function Footer() {
  return (
    <footer className="bg-blue-900 text-white pt-12 pb-6 px-6">

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">

        {/* LEFT - CONTACT */}
        <div className="space-y-4">

          <h2 className="text-xl font-semibold border-b border-white/30 pb-2">
            Contact Us
          </h2>

          {/* IMAGE */}
          <img
            src={logo}
            alt="Guru Global Abacus"
            className=" h-32 object-contain bg-white "
          />

          <p className="text-sm leading-relaxed">
            Gaurisagar Tiniali (Near Overbridge), <br />
            Assam, India
          </p>

          <p className="text-sm">
            📞 7002809836 <br />
            📞 7635869905
          </p>

          <p className="text-sm">
             Guru Global Education
          </p>

          <div>
            <h3 className="mt-3 font-medium">Follow Us</h3>
            <div className="flex gap-3 mt-2">
              <span className="hover:text-gray-300 cursor-pointer">Facebook</span>
              <span className="hover:text-gray-300 cursor-pointer">Instagram</span>
            </div>
          </div>

        </div>

        <div className="space-y-4">

          <h2 className="text-xl font-semibold border-b border-white/30 pb-2">
            Our Courses
          </h2>

          <ul className="space-y-2 text-sm">
            <li>Abacus Classes</li>
            <li>Vedic Maths</li>
            <li>Phonics & Spoken English</li>
            <li>Brain Gym</li>
            <li>Speed Writing</li>
            <li>Personality Development</li>
            <li>Story Telling</li>
          </ul>

        </div>

        {/* RIGHT - BENEFITS */}
        <div className="space-y-4">

          <h2 className="text-xl font-semibold border-b border-white/30 pb-2">
            Benefits
          </h2>

          <ul className="space-y-2 text-sm">
            <li>✔ Improves Math Skills</li>
            <li>✔ Improves Concentration</li>
            <li>✔ Improves Memory</li>
            <li>✔ Boosts Confidence</li>
            <li>✔ Enhances Brain Development</li>
          </ul>

        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/30 mt-10 pt-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-300">

        <p>© {new Date().getFullYear()} Guru Global Abacus. All rights reserved.</p>

        <div className="flex gap-4 mt-2 md:mt-0">
          <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer">Terms & Conditions</span>
        </div>

      </div>

    </footer>
  );
}

export default Footer;