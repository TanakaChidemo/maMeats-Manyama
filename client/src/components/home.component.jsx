import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext/UserContext';

const Home = () => {
  const { user, isLoading, error } = useContext(UserContext);

  useEffect(() => {
    console.log('Home component user data:', {
      user,
      firstName: user?.firstName,
      isLoading,
      error
    });
  }, [user, isLoading, error]);

  // Handle loading state
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  // Debug log just before rendering
  console.log('Rendering Home with user:', user);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          {user ? (
            <>Welcome, {user.firstName}</>
          ) : (
            'Welcome'
          )}
        </h1>
        {/* Debug info - remove in production */}
        <div className="text-xs text-gray-500">
          {user ? `Logged in as: ${user.email}` : 'Not logged in'}
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Orders Card - Only shown to admins */}
        {user?.role === 'admin' && (
          <Link 
            to="/createNewOrder"
            className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="text-2xl mb-4">🗓️</div>
            <h2 className="text-xl font-semibold mb-2">Create an Order</h2>
          </Link>
        )}

        {/* View Summary Card - Shown to all users */}
        <Link 
          to="/orderSummary"
          className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="text-2xl mb-4">📋</div>
          <h2 className="text-xl font-semibold mb-2">View current/previous orders</h2>
        </Link>
      </div>

      {/* Additional Info */}
      <div className="mt-12 text-center text-gray-600">
        <p>Next delivery date: Friday</p>
        <p className="mt-2">Questions? Whatsapp: +971#######</p>
      </div>
    </div>
  );
};

export default Home;