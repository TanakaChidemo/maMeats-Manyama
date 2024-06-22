import MeatEmoji from "../logo/logo.component.jsx";
import ShoppingCartIcon from "../../components/ShoppingCartIcon.component.jsx";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex h-16 px-14">
      <div className="flex items-center w-2/3">
        <Link to="/">
          <MeatEmoji />
        </Link>
        <Link to="/">
          <h1 className="md: text-2xl" style={{ fontFamily: "Bigelow Rules" }}>
            maMeats Manyama
          </h1>
        </Link>
      </div>
      <div className="flex items-center justify-evenly w-1/3">
        <Link to="/login">
          <button className="border-2 h-6 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white text-sm px-3 rounded-2xl">
            Login
          </button>
        </Link>
        <ShoppingCartIcon />
      </div>
    </div>
  );
};

export default Navbar;
