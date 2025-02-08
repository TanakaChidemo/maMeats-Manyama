import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome</h1>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Orders Card */}
        <Link to="/createNewOrder" 
          className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-2xl mb-4">🗓️</div>
          <h2 className="text-xl font-semibold mb-2">Create an Order</h2>

        </Link>

        {/* View Summary Card */}
        <Link to="/orderSummary" 
          className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-2xl mb-4">📋</div>
          <h2 className="text-xl font-semibold mb-2">View current/ previous orders</h2>

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