import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowUp } from "lucide-react";

const PageLayout = ({ children }) => {
  const [showBtn, setShowBtn] = useState(false);

  // detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowBtn(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Navbar />

      <div>{children}</div>

      <Footer />

      {/* SCROLL TO TOP BUTTON */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 p-3 rounded-full 
        bg-blue-600 text-white shadow-lg border border-white/30
        hover:bg-blue-700 transition-all duration-300
        ${
          showBtn
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <ArrowUp size={20} />
      </button>
    </>
  );
};

export default PageLayout;