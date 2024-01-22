const ShoppingCartIcon = () => {
  return (
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
  );
};

export default ShoppingCartIcon;
