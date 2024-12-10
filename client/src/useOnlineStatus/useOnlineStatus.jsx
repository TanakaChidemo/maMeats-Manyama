import {useState, useEffect} from "react";

export const useOnlineStatus = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        function handleIsLoggedIn() {
            setIsLoggedIn(true);
        }
        function handleIsAdmin() {
            setIsAdmin(true);
        }
        
    }, []);
    return {isLoggedIn, isAdmin};
};