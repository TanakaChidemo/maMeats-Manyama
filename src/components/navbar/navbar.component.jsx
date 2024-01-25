import MeatEmojis from "../logo/logo.component.jsx";
import { useState } from "react";
import ShoppingCartIcon from "../../components/ShoppingCartIcon.component.jsx"; // Import the shopping cart SVG
// Import the shopping cart SVG

const Navbar = () => {
  const [cartItems, setCartItems] = useState(12);

  return (
    <div className="flex justify-between">
      <MeatEmojis />
      <div className="flex justify-between items-center">
        <a href="/login" className="px-4">
          Login
        </a>
        <span
          className="cart-icon flex"
          onClick={{setCartItems} => {cartItems} + 1}
        >
          <ShoppingCartIcon />
          {cartItems > 0 && (
            <span className="cart-items absolute inset-8">{cartItems}</span>
          )}
        </span>
      </div>
    </div>
  );
};

export default Navbar;
