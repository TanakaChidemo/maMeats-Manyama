import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useCountdown from "../../hooks/useCountdown";
import { useOrder } from "../../OrderContext/OrderContext";

const Order = ({ orderData }) => {
  const { order: contextOrder, fetchOrder, isLoading, error } = useOrder();
  const [adminName, setAdminName] = useState("");
  
  // Use passed order data if available, otherwise use context
  const order = orderData || contextOrder;
  
  // Use closing date from order, fallback to current date if not available
  const closingDate = React.useMemo(() => 
    order ? new Date(order.closingDate) : new Date(), 
    [order?.closingDate]
  );
  
  const closingTime = order?.closingTime || "--:--";
  const timeLeft = useCountdown(closingDate);

  useEffect(() => {
    // Only fetch from context if we're not passed order data as props
    if (!orderData) {
      const cachedOrder = localStorage.getItem('order');
      if (cachedOrder) {
        const { _id } = JSON.parse(cachedOrder);
        if (_id) {
          fetchOrder(_id);
        }
      }
    }
  }, [fetchOrder, orderData]);

  useEffect(() => {
    const fetchAdminName = async () => {
      if (order?.admin?.[0]?._id) {
        try {
          const response = await fetch(`http://localhost:8000/manyama/users/${order.admin[0]._id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
              'Content-Type': 'application/json'
            }
          });
          if (!response.ok) throw new Error('Failed to fetch admin details');
          const data = await response.json();
          setAdminName(data.data.user.firstName || 'Unknown Admin');
        } catch (err) {
          console.error('Error fetching admin name:', err);
          setAdminName('Unknown Admin');
        }
      }
    };

    fetchAdminName();
  }, [order?.admin]);

  const formatDate = (date) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(date));
  };

  // Only show loading state when using context
  if (!orderData && isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Only show error state when using context
  if (!orderData && error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error loading order</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center max-w-2xl mx-auto p-6 border-2 border-blue-200 rounded-2xl bg-white shadow-lg hover:border-blue-300 transition-all">
      <div className="text-center mb-4">
        <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
          Order created by {adminName}
        </span>
      </div>
      
      <div className="flex flex-col items-center self-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-xl w-full transition-all hover:shadow-2xl">
        {/* Calendar Icon */}
        <div className="flex items-center justify-center w-16 h-16 bg-white text-blue-500 rounded-full mb-4 shadow-inner">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 4h10M3 10h18M4 21h16a2 2 0 002-2V8a2 2 0 00-2-2H4a2 2 0 00-2 2v11a2 2 0 002 2z"></path>
          </svg>
        </div>

        {/* Closing Date */}
        <div className="text-xl font-bold text-center border-b border-blue-400 pb-4 w-full">
          <div className="text-lg opacity-90">Closing Date:</div>
          <div id="closingDate" className="mb-1">{order ? formatDate(closingDate) : "--/--/----"}</div>
          <div className="text-lg">@{closingTime}</div>

          {/* Countdown Timer */}
        <div className="text-xl mt-4 font-mono" id="countdown">
          {!order ? (
            <div className="text-yellow-200">No active order</div>
          ) : timeLeft.isClosed ? (
            <h2 className="text-red-100 font-bold bg-red-500 px-4 py-2 rounded-lg">Orders Closed</h2>
          ) : (
            <div className="flex space-x-2 justify-center">
              {timeLeft.days > 0 && (
                <span id="days" className="bg-blue-400 px-2 py-1 rounded">{timeLeft.days}d</span>
              )}
              <span id="hours" className="bg-blue-400 px-2 py-1 rounded">{timeLeft.hours}h</span>
              <span id="minutes" className="bg-blue-400 px-2 py-1 rounded">{timeLeft.minutes}m</span>
              {timeLeft.days === 0 && (
                <span id="seconds" className={`bg-blue-400 px-2 py-1 rounded ${timeLeft.hours < 2 ? "animate-pulse" : ""}`}>
                  {timeLeft.seconds}s
                </span>
              )}
            </div>
          )}
        </div>

        </div>

        
        {/* Payment Deadline */}
        <div className="text-xl text-center border-b border-blue-400 py-4 w-full">
          <div className="text-lg opacity-90">Payment Deadline:</div>
          <div className="mb-1">{order ? formatDate(order.paymentDeadline) : "--/--/----"}</div>
          <div className="text-lg">@{order?.paymentDeadlineTime || "--:--"}</div>
        </div>

        {/* Delivery Date */}
        <div className="text-xl text-center py-4 w-full">
          <div className="text-lg opacity-90">Delivery Date:</div>
          <div className="mb-1">{order ? formatDate(order.deliveryDate) : "--/--/----"}</div>
        </div>

        {/* Payment Details */}
        {order?.paymentDetails1 && (
          <div className="mt-4 text-center text-sm bg-blue-400 px-4 py-2 rounded-lg">
            <div>Payment to: {order.paymentDetails1}</div>
            <h3 className="font-bold">or</h3>
            {order.paymentDetails2 && <div>{order.paymentDetails2}</div>}
          </div>
        )}

        {/* Action Buttons */}
        {!order ? null : timeLeft.isClosed ? (
          <Link 
            to={`/orderSummary/${order._id}`}
            className="mt-6 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 w-full text-center"
          >
            View Final Order
          </Link>
        ) : (
          <Link 
            to={`/orderSummary/${order._id}`}
            className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 w-full text-center"
          >
            Place Order
          </Link>
        )}
      </div>

      
    </div>
  );
};

export default Order;