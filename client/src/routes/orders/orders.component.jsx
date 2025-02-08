import React, { useEffect, useState } from "react";
import ComposeIcon from "../../components/compose-icon/compose-icon.component";
import { Link } from "react-router-dom";
import useCountdown from "../../hooks/useCountdown";

const Orders = () => {
  const closingDate = React.useMemo(() => new Date("2025-02-07T10:21:59"), []);
const closingTime = closingDate.getHours() + ":" + closingDate.getMinutes().toString().padStart(2, "0");

const timeLeft = useCountdown(closingDate);
  
const formatDate = (date) => {
const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="p-2 text-gray-600 m-2"><h1>Orders</h1></div>
      <div className="flex flex-col items-center self-center p-4 my-4 bg-blue-500 text-white rounded-lg shadow-lg w-48">
        {/* Calendar Icon */}
        <div className="flex items-center justify-center w-12 h-12 bg-white text-blue-500 rounded-full mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 4h10M3 10h18M4 21h16a2 2 0 002-2V8a2 2 0 00-2-2H4a2 2 0 00-2 2v11a2 2 0 002 2z"></path>
          </svg>
        </div>
        
        {/* Closing Date */}
        <div className="text-xl font-bold">
          <>Closing Date:</> 
          <div id="closingDate">{formatDate(closingDate)}</div>
          <>@{closingTime}</>
        </div>
        
        {/* Countdown Timer */}
        <div className="text-lg mt-2" id="countdown">
          {timeLeft.isClosed ? (
            <h2 className="text-red-700 font-bold">Orders Closed</h2>
          ) : (
            <>
              {timeLeft.days > 0 && (
                <span id="days">{timeLeft.days}d </span>
              )}
              <span id="hours">{timeLeft.hours}h </span>
              <span id="minutes">{timeLeft.minutes}m </span>
              {timeLeft.days === 0 && (
                <span id="seconds" className={timeLeft.hours < 2 ? "animate-flash" : ""}>{timeLeft.seconds}s</span>
                /* <span id="seconds" className={timeLeft.hours < 2 ? "animate-flash" : ""}>{timeLeft.seconds}s</span> */
              )}
            </>
          )}
        </div>

        {/* Place Order Button */}
        {timeLeft.isClosed ? null :(<Link to='/orderSummary' className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">
          Place Order
        </Link>)}
        {timeLeft.isClosed? (<Link to='/orderSummary' className="mt-4 bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg" >
          View final Order
        </Link>): null}
      </div>
      <div className="flex flex-row justify-center">
      <Link to='/' className="mt-4 bg-green-600 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg" >
          Create new Order
        </Link>
        </div>
    </div>
  );
};

export default Orders;
