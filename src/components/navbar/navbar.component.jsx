import MeatEmojis from "../logo/logo.component.jsx";
import { useState } from "react";
import ShoppingCartIcon from "../../components/ShoppingCartIcon.component.jsx"; // Import the shopping cart SVG
// Import the shopping cart SVG

const Navbar = () => {
  const [cartItems, setCartItems] = useState(0);

  return (
    <div>
      <MeatEmojis />
      <div>
        <a href="/login">Login</a>
        <span>
          <ShoppingCartIcon /> Cart: {cartItems}
        </span>
      </div>
    </div>
  );
};

export default Navbar;
