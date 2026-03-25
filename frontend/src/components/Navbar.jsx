import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [hideTop, setHideTop] = useState(false);

  const handleLogout = () => {
    dispatch({ type: "auth/logout" });
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setHideTop(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-50 font-[Roboto]">

      {/* TOP BAR */}
      <div
        className={`bg-red-500 text-white text-sm px-6 py-2 transition-all duration-500 ${
          hideTop ? "h-0 overflow-hidden py-0" : "h-auto"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          {/* LEFT */}
          <div className="flex gap-4 items-center">
            <span>🕿 +91 1234567890</span>
            <span>✉️ info@myinstitute.com</span>
          </div>

          {/* RIGHT */}
          <div className="flex gap-4 items-center">
            <span className="cursor-pointer hover:text-gray-300 flex gap-2">
              <img src="https://img.icons8.com/?size=100&id=8808&format=png&color=FFFFFF" className="h-5 w-5" />
              LinkedIn
            </span>
            <span className="cursor-pointer hover:text-gray-300 flex gap-2">
              <img src="https://img.icons8.com/?size=100&id=118467&format=png&color=FFFFFF" className="h-5 w-5" />
              Facebook
            </span>
          </div>

        </div>
      </div>

      {/* MAIN NAVBAR */}
      <div className="bg-blue-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

          {/* LOGO */}
          <Link to="/" className="text-xl font-bold tracking-wide">
            🎓 MyInstitute
          </Link>

          {/* NAV LINKS */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">

            <Link to="/about" className="relative group">
              About Us
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all group-hover:w-full"></span>
            </Link>

            <Link to="/staff" className="relative group">
              Staff
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all group-hover:w-full"></span>
            </Link>

            <Link to="/batches" className="relative group">
              Batches
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all group-hover:w-full"></span>
            </Link>

          </div>

          {/* RIGHT SIDE (AUTH) */}
          {!user ? (
            <Link
              to="/login"
              className="px-5 py-2 rounded-lg bg-white text-blue-800 font-medium hover:bg-gray-200 transition"
            >
              Login
            </Link>
          ) : (
            <div className="relative">

              {/* USER */}
              <div
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 cursor-pointer bg-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-600 transition"
              >
                <div className="w-8 h-8 rounded-full bg-white text-blue-800 flex items-center justify-center font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <span className="capitalize text-sm">
                  {user.role}
                </span>
              </div>

              {/* DROPDOWN */}
              {open && (
                <div className="absolute right-0 mt-2 w-52 bg-white text-black rounded-lg shadow-lg overflow-hidden">

                  <button
                    onClick={() => {
                      if (user.role === "admin") navigate("/admin/dashboard");
                      else if (user.role === "staff") navigate("/staff/dashboard");
                      else navigate("/student/dashboard");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    🚀 Dashboard
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-500"
                  >
                    Logout
                  </button>

                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Navbar;