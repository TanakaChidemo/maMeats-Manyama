import { useState } from "react";
import "./App.css";
import Navbar from "./components/navbar/navbar.component";
import MeatType from "./components/meatCategory/meatType.component";

const meatTypes = ["Beef", "Poultry", "Pork", "Lamb", "Fish", "Other"];

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-1/2">
      <Navbar />
      <MeatType meatTypes={meatTypes} />
    </div>
  );
}

export default App;
