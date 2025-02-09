import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

  const clearAllState = () => {
    // Clear all localStorage
    localStorage.clear();
    
    // Reset all state
    setUser(null);
    setAuthToken(null);
    setError(null);
    
    // Force a page refresh to clear any persisted state
    window.location.reload();
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!authToken) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        const cachedUser = localStorage.getItem('user');
        if (!cachedUser) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        try {
          const userData = JSON.parse(cachedUser);
          if (userData._id) {
            const response = await fetch(`http://localhost:8000/manyama/users/${userData._id}`, {
              headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
              }
            });

            if (!response.ok) {
              clearAllState();
              return;
            }

            const { data } = await response.json();
            if (isMounted) {
              const freshUserData = data.user || data;
              setUser(freshUserData);
              localStorage.setItem('user', JSON.stringify(freshUserData));
            }
          }
        } catch (e) {
          console.error('Error handling user data:', e);
          clearAllState();
        }
      } catch (err) {
        console.error('Error in user context:', err);
        clearAllState();
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUser();
    return () => {
      isMounted = false;
    };
  }, [authToken]);

  const contextValue = {
    user,
    setUser: (userData) => {
      if (userData) {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        clearAllState();
      }
    },
    logout: clearAllState,
    isLoading,
    error,
    checkAuth: () => !!authToken
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;