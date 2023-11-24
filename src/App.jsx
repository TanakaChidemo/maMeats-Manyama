import { useState } from "react";
import "./App.css";
import Navbar from "./components/navbar/navbar.component";
import Chapter from "./components/chapter/chapter.component";
import MeatType from "./components/meatCategory/meatType.component";

const meatTypes = ["Beef", "Poultry", "Pork", "Lamb", "Fish", "Other"];

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Navbar />
      <Chapter />
      <MeatType meatTypes={meatTypes} />
    </div>
  );
}

export default App;
