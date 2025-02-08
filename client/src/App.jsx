import { Route, Routes } from "react-router-dom";
import React from "react";
import Home from "./components/home.component";
import Layout from "./components/layout/layout.component";
import Orders from "./routes/orders/orders.component";
import SignIn from "./components/sign-in/sign-in.component";
import SignUp from "./components/sign-up/sign-up.component";
import OrderSummary from "./components/orderSummary/orderSummary.component";
import CreateNewOrder from "./routes/orders/createNewOrder.component";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
      <Route index element={<Home/>}/>
        <Route path="/orderSummary" element={<OrderSummary />} />
        <Route path="login" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="orders" element={<Orders />} />
        <Route path="/createNewOrder" element={<CreateNewOrder />} />
      </Route>
    </Routes>
  );
};

export default App;
