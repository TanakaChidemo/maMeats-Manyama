import MeatEmoji from "../logo/logo.component.jsx";
import { useState } from "react";
import ShoppingCartIcon from "../../components/ShoppingCartIcon.component.jsx";

const Navbar = () => {
  return (
    <div className="flex justify-between h-16">
      <div className="flex items-center w-2/3">
        <MeatEmoji />
        <h1 className="md: text-3xl" style={{ fontFamily: "Bigelow Rules" }}>
          maMeats Manyama
        </h1>
      </div>
      <div className="flex items-center justify-evenly w-1/3">
        <button className="border-2 h-6 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white text-sm px-3 rounded-2xl">
          Login
        </button>
        <ShoppingCartIcon />
      </div>
    </div>
  );
};

export default Navbar;
