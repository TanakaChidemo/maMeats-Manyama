import { Route, Routes } from "react-router-dom";
import React from "react";
import Layout from "./components/layout/layout.component";
import Orders from "./routes/orders/orders.component";
import PlaceOrder from "./routes/orderPlacementPage/order-placement-page.component";
import SignIn from "./components/sign-in/sign-in.component";
import OrderSummary from "./components/orderSummary/orderSummary.component";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/orders" element={<OrderSummary />} />
        <Route path="login" element={<SignIn />} />
        <Route path="orders" element={<Orders />} />
        <Route path="placeOrder" element={<PlaceOrder />} />
      </Route>
    </Routes>
  );
};

export default App;
