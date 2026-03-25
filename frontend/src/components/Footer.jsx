import React from "react";

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
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644"
            alt="Institute"
            className="w-full h-32 object-cover"
          />

          <p className="text-sm leading-relaxed">
            Circuit House Road, Golaghat, Assam, India. <br />
            Pin - 785621
          </p>

          <p className="text-sm">
            📞 03774-451224 (Principal), 284482 (Office) <br />
            📠 285607 (Fax)
          </p>

          <p className="text-sm">📧 principal@drcollege.ac.in</p>

          {/* SOCIAL */}
          <div>
            <h3 className="mt-3 font-medium">Follow Us</h3>
            <div className="flex gap-3 mt-2">
              <span className="hover:text-gray-300 cursor-pointer">Facebook</span>
              <span className="hover:text-gray-300 cursor-pointer">LinkedIn</span>
            </div>
          </div>

        </div>

        {/* MIDDLE - IMPORTANT LINKS */}
        <div className="space-y-4">

          <h2 className="text-xl font-semibold border-b border-white/30 pb-2">
            Important Links
          </h2>

          <ul className="space-y-2 text-sm">
            <li className="hover:text-gray-300 cursor-pointer">RTI</li>
            <li className="hover:text-gray-300 cursor-pointer">Download</li>
            <li className="hover:text-gray-300 cursor-pointer">Photo Gallery</li>
            <li className="hover:text-gray-300 cursor-pointer">Our Glorious Past Videos</li>
            <li className="hover:text-gray-300 cursor-pointer">
              National Council for Teacher Education
            </li>
          </ul>

        </div>

        {/* RIGHT - QUICK LINKS */}
        <div className="space-y-4">

          <h2 className="text-xl font-semibold border-b border-white/30 pb-2">
            Quick Links
          </h2>

          <ul className="space-y-2 text-sm">
            <li className="hover:text-gray-300 cursor-pointer">Dibrugarh University</li>
            <li className="hover:text-gray-300 cursor-pointer">DHE</li>
            <li className="hover:text-gray-300 cursor-pointer">MMTTC</li>
            <li className="hover:text-gray-300 cursor-pointer">NAAC</li>
            <li className="hover:text-gray-300 cursor-pointer">UGC</li>
            <li className="hover:text-gray-300 cursor-pointer">KKHSOU</li>
            <li className="hover:text-gray-300 cursor-pointer">IGNOU</li>
            <li className="hover:text-gray-300 cursor-pointer">Govt. of Assam</li>
          </ul>

        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/30 mt-10 pt-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-300">

        <p>© {new Date().getFullYear()} MyInstitute. All rights reserved.</p>

        <div className="flex gap-4 mt-2 md:mt-0">
          <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer">Terms & Conditions</span>
        </div>

      </div>

    </footer>
  );
}

export default Footer;