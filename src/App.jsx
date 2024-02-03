import "./App.css";
import Navbar from "./components/navbar/navbar.component";
import MeatType from "./components/meatCategory/meatType.component";
import SearchBox from "./components/searchbox.component";

const meatTypes = ["Beef", "Poultry", "Pork", "Lamb", "Fish", "Other"];

function App() {
  return (
    <div className="flex flex-col bg-gradient-to-b from-cyan-100 to-blue-200 md:w-1/2 h-screen">
      <div className="">
        <Navbar />
      </div>
      <div className="">
        <SearchBox placeholder={"search"} />
      </div>
      <div>
        <MeatType meatTypes={meatTypes} />
      </div>
    </div>
  );
}

export default App;
