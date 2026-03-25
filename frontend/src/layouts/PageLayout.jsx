import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PageLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div>{children}</div>
      <Footer />
    </>
  );
};

export default PageLayout;
