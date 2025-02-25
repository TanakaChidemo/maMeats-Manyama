import React, { useState, useEffect, useContext } from 'react';
import Order from '../../routes/orders/order.component';
import { UserContext } from '../../UserContext/UserContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugMessage, setDebugMessage] = useState('Initializing...');
  const contextValues = useContext(UserContext);
  const { user, isLoading: userLoading } = contextValues;
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setDebugMessage('Starting fetch...');
        
        if (!authToken) {
          setDebugMessage('No auth token in localStorage');
          throw new Error('Authentication token not found. Please log in again.');
        }

        const response = await fetch('http://localhost:8000/manyama/orders', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Server Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Parsed response data:', data);

        // Handle the specific response structure
        if (!data.data?.allOrders) {
          throw new Error('Invalid response format: Expected data.data.allOrders');
        }

        const ordersArray = data.data.allOrders;
        console.log('Orders array:', ordersArray);

        const sortedOrders = ordersArray.sort((a, b) => {
          if (!a.deliveryDate || !b.deliveryDate) return 0;
          return new Date(b.deliveryDate) - new Date(a.deliveryDate);
        });

        setOrders(sortedOrders);
        setDebugMessage(`Loaded ${sortedOrders.length} orders`);
      } catch (err) {
        console.error('Error in fetch:', err);
        setDebugMessage(`Error: ${err.message}`);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (!userLoading) {
      fetchOrders();
    } else {
      setIsLoading(false);
      setDebugMessage('Waiting for user data to load...');
    }
  }, [userLoading, authToken]);

  if (userLoading || isLoading) {
    return (
      <div className="p-4">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"/>
          <p className="mt-2 text-gray-600">Loading orders...</p>
          <p className="mt-2 text-sm text-gray-500">{debugMessage}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <p className="mt-2 text-sm">{debugMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Orders</h1>
      {/* <p className="text-sm text-gray-500 text-center mb-4">{debugMessage}</p> */}
      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Order key={order._id} orderData={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;