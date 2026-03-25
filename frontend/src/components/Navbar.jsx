import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch({ type: "auth/logout" });
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl 
    bg-gradient-to-r from-blue-100/40 via-purple-100/30 to-pink-100/40 
    border-b border-white/30 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

        {/* LOGO */}
        <Link 
          to="/" 
          className="text-xl font-bold text-gray-800 tracking-wide hover:opacity-80 transition"
        >
          🎓 MyInstitute
        </Link>

        {/* RIGHT SIDE */}
        {!user ? (
          <Link
            to="/login"
            className="px-5 py-2 rounded-xl 
            bg-white/50 backdrop-blur-md 
            border border-white/40 
            shadow-[0_0_10px_rgba(59,130,246,0.2)] 
            hover:shadow-[0_0_20px_rgba(59,130,246,0.35)] 
            hover:bg-white/70 
            transition"
          >
            Login
          </Link>
        ) : (
          <div className="relative">

            {/* USER BUTTON */}
            <div
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 cursor-pointer 
              bg-white/40 px-3 py-1.5 rounded-xl backdrop-blur-md 
              border border-white/30
              shadow-[0_0_10px_rgba(139,92,246,0.2)]
              hover:shadow-[0_0_20px_rgba(139,92,246,0.35)]
              hover:bg-white/60 transition"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-semibold">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <span className="text-sm text-gray-800 capitalize">
                {user.role}
              </span>
            </div>

            {/* DROPDOWN */}
            {open && (
              <div className="absolute right-0 mt-2 w-52 
              bg-white/60 backdrop-blur-xl 
              rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] 
              border border-white/40 overflow-hidden">

                <button
                  onClick={() => {
                    if (user.role === "admin") navigate("/admin/dashboard");
                    else if (user.role === "staff") navigate("/staff/dashboard");
                    else navigate("/student/dashboard");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-white/50 transition"
                >
                  🚀 Go to Dashboard
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-500 transition"
                >
                  🔴 Logout
                </button>

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;