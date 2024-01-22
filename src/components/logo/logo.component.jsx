import React from "react";
const MeatEmojis = () => {
  return (
    <div className="flex border-2 items-center justify-between px-2">
      <div
        role="img"
        aria-label="Meat Emojis"
        className="text-6xl flex items-center"
      >
        🥩
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "Bigelow Rules" }}
        >
          maMeats Manyama
        </h1>
      </div>
      <button
        className="text-lg font-bold"
        style={{ fontFamily: "Bigelow Rules" }}
      >
        login
      </button>
    </div>
  );
};

export default MeatEmojis;
