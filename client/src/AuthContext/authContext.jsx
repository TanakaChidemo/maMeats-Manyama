import React, { createContext, useState, useContext } from "react";
import { UserContext } from "../UserContext/UserContext";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [loginStatus, setLoginStatus] = useState(false);
    
    const login = () => {
        setLoginStatus(true);
    };

    const logout = () => {
        setLoginStatus(false);
    };

    return (
        <AuthContext.Provider value={{
            loginStatus, 
            login, 
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);