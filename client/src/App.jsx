import { Route, Routes, Navigate } from "react-router-dom";
import React, { useContext } from "react";
import Home from "./components/home.component";
import Layout from "./components/layout/layout.component";
import Orders from "./routes/orders/orders.component";
import SignIn from "./components/sign-in/sign-in.component";
import SignUp from "./components/sign-up/sign-up.component";
import OrderSummary from "./components/orderSummary/orderSummary.component";
import CreateNewOrder from "./routes/orders/createNewOrder.component";
import { AuthProvider } from "./AuthContext/authContext";
import { UserProvider, UserContext } from "./UserContext/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useContext(UserContext);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route path="login" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            
            {/* Protected routes */}
            <Route index element={
              // <ProtectedRoute>
                <Home />
              // </ProtectedRoute>
            }/>
            <Route path="/orderSummary" element={
              <ProtectedRoute>
                <OrderSummary />
              </ProtectedRoute>
            } />
            <Route path="orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/createNewOrder" element={
              <ProtectedRoute>
                <CreateNewOrder />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </UserProvider>
    </AuthProvider>
  );
};

export default App;