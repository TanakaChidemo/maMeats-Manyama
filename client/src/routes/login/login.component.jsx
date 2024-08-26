import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../../../src/context/context";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ firstName, setFirstName] = useState("");
  const [Username, setUserName]= useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();
  const {login} = useAuth();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  }

  const handleUsernameChange = (e) => {
    setUserName(e.target.value);
  }

  const handlePasswordConfirm = (e) => {
    setPasswordConfirm(e.target.value);
  }

  const handleLogin = async () => {
    const userCredentials = {
      email,
      password,
    };

    try {
      const response = await fetch(
        "http://localhost:8000/manyama/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userCredentials),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("login successful", data);
        login();
        navigate("/orders");
      } else {
        console.log("login failed");
      }
    } catch (error) {
      console.error("login error", error);
    }
  };

  const handleSignUp = async () => {
    const userCredentials = {
      firstName,
      Username,
      email,
      password,
      passwordConfirm
    };

    try{
      const response = await fetch(
        "http://localhost:8000/manyama/users/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userCredentials),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Sign up successful", data);
        login();
        navigate("/orders");
      } else{
        console.log("Sign up failed");
      }
    } catch (error) {
      console.log("Login Error:", error);
    }
  }
 
  return (
    <div className="m-auto md: w-1/2 py-10">
    {!showSignUp && (
      <>
      <form className="max-w-sm">
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          required
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
          placeholder="email"
        />
        <br />
        <br />
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          required
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
          placeholder="password"
        />
        <br />
        <br />
      </form>
    <br/>
  
          <button
            type="button"
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2 m-2 rounded-md"
          >
            Login
          </button>
          <br/>
      <br />
      </>)}

    {showSignUp && (
      <form className="max-w-sm">
      <input
        type="text"
        value={firstName}
        onChange={handleFirstNameChange}
        required
        className="border border-gray-300 rounded-md px-3 py-2 m-2 w-full"
        placeholder="first name"
      />
      <br/>
      <input
        type="text"
        value={Username}
        onChange={handleUsernameChange}
        required
        className="border border-gray-300 rounded-md px-3 py-2 m-2 w-full"
        placeholder="username"
      />
      <br/>
      <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          required
          className="border border-gray-300 rounded-md px-3 py-2 m-2 w-full"
          placeholder="email"
        />
        <br />
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          required
          className="border border-gray-300 rounded-md px-3 py-2 m-2 w-full"
          placeholder="password"
        />
        <br />
        <input
          type="password"
          value={passwordConfirm}
          onChange={handlePasswordConfirm}
          required
          className="border border-gray-300 rounded-md px-3 py-2 m-2 w-full"
          placeholder="re-enter password"
        />
        <button
            type="button"
            onClick={handleSignUp}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Sign Up
          </button>
      </form>
    )}

    <button
        type="button"
        onClick={() => setShowSignUp(!showSignUp)} // Toggle between login and signup forms
        className={`bg-${showSignUp ? 'blue-300' : 'blue-500'} text-white px-4 py-2 rounded-md`}
      >
        {showSignUp ? "Go Back to Login" : "Sign Up"}
      </button>
      <br />
      <br />
      
      <Link to="" className="bg-red-300 text-white px-4 py-2 rounded-md">
        Forgot Password
      </Link>
    </div>
  );
};

export default Login;
