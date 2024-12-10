import { Outlet } from "react-router-dom";
import "./../../App.css";
import Navbar from "../../components/navbar/navbar.component";

const meatTypes = ["Beef", "Poultry", "Pork", "Lamb", "Fish", "Other"];

const Navigation = () => {
  return (
    <div className="flex m-auto flex-col bg-gradient-to-b from-cyan-100 to-blue-200 md:w-1/2 h-screen">
      <div className=" m-auto self-center md:w-1/2 fixed">
        <Navbar />
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Navigation;
