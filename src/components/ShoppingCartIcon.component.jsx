import React, { useState } from "react";
const ShoppingCartIcon = () => {
  const [cartItems, setCartItems] = useState(0);
  return (
    <div className="relative flex justify-between items-center border-2 border-red-400 py-2 px-2 w-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="32" // Adjust the width here
        height="32" // Adjust the height here
      >
        <path d="M3 3h2l1.5 6h12l1.394-5.576A2 2 0 0 1 20.894 2H6" />
        <circle cx="9" cy="19" r="2" />
        <circle cx="17" cy="19" r="2" />
        <path d="M17 8h-1V6a4 4 0 0 0-4-4h-2a4 4 0 0 0-4 4v2H3" />
      </svg>
      {/* <svg viewBox="0 0 32 32" width="32" height="32">
        <path
          fill="none"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M184,184H69.81818L41.92162,30.56892A8,8,0,0,0,34.05066,24H16"
          className="colorStroke000 svgStroke"
        ></path>
        <circle
          cx="80"
          cy="204"
          r="20"
          fill="none"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="12"
          className="colorStroke000 svgStroke"
        ></circle>
        <circle
          cx="184"
          cy="204"
          r="20"
          fill="none"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="12"
          className="colorStroke000 svgStroke"
        ></circle>
        <path
          fill="none"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="12"
          d="M62.54543,144H188.10132a16,16,0,0,0,15.74192-13.13783L216,64H48"
          className="colorStroke000 svgStroke"
        ></path>
      </svg>  */}

      <span className="absolute top-0 right-0 flex text-xs place-content-center place-items-center text-white rounded-full bg-red-600 py-0 px-0 w-5 h-5 border-2">
        {cartItems}
      </span>
    </div>
  );
};

export default ShoppingCartIcon;
