import React from "react";
import { GiCrownedHeart } from "react-icons/gi";

const Footer = () => {
  return (
    <footer className="bg-transparent text-gray flex items-center justify-end p-4">
      <p className="flex items-center">
        Made with love{" "}
        <span className="text-red-500 ml-2">
          <GiCrownedHeart />
        </span>
      </p>
    </footer>
  );
};

export default Footer;