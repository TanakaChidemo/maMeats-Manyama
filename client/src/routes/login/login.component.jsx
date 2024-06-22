import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    // Perform login logic here
  };

  const handleSignUp = () => {
    // Redirect to sign up page
  };

  const handleForgotPassword = () => {
    // Redirect to forgot password page
  };

  return (
    <div className="m-auto md: w-1/2 py-10">
      <form className="max-w-sm">
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange}
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
        <label className="block mb-2 text-sm">Username or Mobile Number:</label>
        <br />
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
        <label className="block mb-2">Password:</label>
        <br />
        <Link to="">
          <button
            type="button"
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Login
          </button>
        </Link>
      </form>
      <br />
      <Link to="">Sign Up</Link>
      <br />
      <Link to="">Forgot Password</Link>
    </div>
  );
};

export default Login;
