import MeatEmoji from "../logo/logo.component.jsx";
import { useState } from "react";
import ShoppingCartIcon from "../../components/ShoppingCartIcon.component.jsx";

const Navbar = () => {
  return (
    <div className="flex justify-between">
      <div className="flex justify-between items-center">
        <MeatEmoji />
        <h1 className="text-4xl" style={{ fontFamily: "Bigelow Rules" }}>
          maMeats Manyama
        </h1>
      </div>
      <div className="flex justify-between items-center">
        <a href="/login" className="px-4">
          Login
        </a>
        <ShoppingCartIcon />
      </div>
    </div>
  );
};

export default Navbar;
