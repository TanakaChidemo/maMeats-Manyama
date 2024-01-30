import { useState } from "react";
import "./App.css";
import Navbar from "./components/navbar/navbar.component";
import MeatType from "./components/meatCategory/meatType.component";

const meatTypes = ["Beef", "Poultry", "Pork", "Lamb", "Fish", "Other"];

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col justify-center bg-gradient-to-b from-cyan-100 to-blue-200 md:w-1/2">
      <div>
        <Navbar />
      </div>
      <div>
        <MeatType meatTypes={meatTypes} />
      </div>
    </div>
  );
}

export default App;
