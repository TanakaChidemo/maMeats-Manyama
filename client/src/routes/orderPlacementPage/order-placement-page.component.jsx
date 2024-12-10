import React,{useState, useEffect}  from "react";

const PlaceOrder = () => {
    return(
        <div>
           <div>
           </div>
           <div className="flex justify-center">
             <table className="border-separate border-slate-500">
              <thead>
                <tr className="text-gray-600">
                    <th className="border border-slate-300 bg-slate-200">Closing Date</th>
                    <th className="border border-slate-300 bg-slate-200">Closing Time</th>
                    <th className="border border-slate-300 bg-slate-200">Payment Deadline</th>
                    <th className="border border-slate-300 bg-slate-200">Delivery Date</th>
                    <th className="border border-slate-300 bg-slate-200">Admin</th>
                </tr>
              </thead>
             </table>
            </div>
       </div>)
};

export default PlaceOrder;