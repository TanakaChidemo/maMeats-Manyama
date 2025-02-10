import React, { useContext, useState } from 'react';
import {useAuth } from '../../AuthContext/authContext';
import { UserContext } from '../../UserContext/UserContext';



const CreateNewOrder = () => {
  
  const {getToken} = useAuth();
  const userContext = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    deliveryDate: '',
    closingDate: '',
    closingTime: '',
    paymentDeadline: '',
    paymentDeadlineTime: '',
    paymentDetails1: '',
    paymentDetails2: ''
  });
  
  // If context is not available, show loading or error state
  if (!userContext) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <p className="text-gray-600">Loading user context...</p>
      </div>
    );
  }

  const { user, isLoading } = userContext;

  // Show loading state while user data is being fetched
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <p className="text-gray-600">Loading user data...</p>
      </div>
    );
  }

  // Show error if user is not authenticated
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <p className="text-red-600">Please login to create an order.</p>
      </div>
    );
  }


  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    setError('');
    setSuccessMessage('');
  };

  const validateForm = () => {
    const errors = [];
    const currentDate = new Date();

    // Convert form dates to Date objects for comparison
    const deliveryDate = new Date(formData.deliveryDate);
    const closingDate = new Date(`${formData.closingDate} ${formData.closingTime}`);
    const paymentDeadline = new Date(
      `${formData.paymentDeadline} ${formData.paymentDeadlineTime}`
    );

    if (!formData.deliveryDate) errors.push('Delivery date is required');
    if (!formData.closingDate) errors.push('Closing date is required');
    if (!formData.closingTime) errors.push('Closing time is required');
    if (!formData.paymentDeadline) errors.push('Payment deadline date is required');
    if (!formData.paymentDeadlineTime) errors.push('Payment deadline time is required');
    if (!formData.paymentDetails1) errors.push('Payment details are required');

    // Logical date validations
    if (deliveryDate < currentDate) {
      errors.push('Delivery date cannot be in the past');
    }
    if (closingDate >= deliveryDate) {
      errors.push('Closing date must be before delivery date');
    }
    if (paymentDeadline >= deliveryDate) {
      errors.push('Payment deadline must be before delivery date');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
  
    
    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join('. '));
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');

      if(!token){
        throw new Error('Authentication token not found');
      }
      // Combine date and time fields
      const orderData = {
        admin: [user._id], // Assuming user._id is available from UserContext
        deliveryDate: new Date(formData.deliveryDate).toISOString(),
        closingDate: new Date(formData.closingDate).toISOString(),
        closingTime: formData.closingTime, // String format (e.g., "14:30")
        paymentDeadline: new Date(formData.paymentDeadline).toISOString(),
        paymentDeadlineTime: formData.paymentDeadlineTime, // String format (e.g., "14:30")
        paymentDetails1: formData.paymentDetails1,
        paymentDetails2: formData.paymentDetails2,
        orderStatus: true, // Default value
        products: [] // Initialize empty products array - this will be populated later
      };

      const response = await fetch('http://localhost:8000/manyama/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      setSuccessMessage('Order created successfully!');

      // Reset form after successful submission
      setFormData({
        deliveryDate: '',
        closingDate: '',
        closingTime: '',
        paymentDeadline: '',
        paymentDeadlineTime: '',
        paymentDetails1: '',
        paymentDetails2: ''
      });

      // You might want to add a success message or redirect here
    } catch (err) {
      setError(err.message);
      if(err.message.includes('token')){
        setError('Please login again to create an order');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Create new order</h1>
      <h2 className="text-xl font-semibold text-gray-600 mb-6">
        Order Admin: {user.firstName}
      </h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}

      {successMessage && (
  <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-600 rounded-md">
    {successMessage}
  </div>
)}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Form fields remain the same */}
          {/* Delivery Date */}
          <div className="flex flex-col">
            <label htmlFor="deliveryDate" className="text-sm font-medium text-gray-700 mb-1">
              Delivery Date
            </label>
            <input
              type="date"
              id="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Rest of your form fields... */}
          {/* Closing Date */}
          <div className="flex flex-col">
            <label htmlFor="closingDate" className="text-sm font-medium text-gray-700 mb-1">
              Closing Date
            </label>
            <input
              type="date"
              id="closingDate"
              value={formData.closingDate}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Closing Time */}
          <div className="flex flex-col">
            <label htmlFor="closingTime" className="text-sm font-medium text-gray-700 mb-1">
              Closing Time
            </label>
            <input
              type="time"
              id="closingTime"
              value={formData.closingTime}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Payment Deadline Date */}
          <div className="flex flex-col">
            <label htmlFor="paymentDeadline" className="text-sm font-medium text-gray-700 mb-1">
              Payment Deadline
            </label>
            <input
              type="date"
              id="paymentDeadline"
              value={formData.paymentDeadline}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Payment Deadline Time */}
          <div className="flex flex-col">
            <label htmlFor="paymentDeadlineTime" className="text-sm font-medium text-gray-700 mb-1">
              Payment Deadline Time
            </label>
            <input
              type="time"
              id="paymentDeadlineTime"
              value={formData.paymentDeadlineTime}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <br />

          {/* Payment Details */}
          <div className="flex flex-col md:col-span-2">
            <label htmlFor="paymentDetails1" className="text-sm font-medium text-gray-700 mb-1">
              Payment Details
            </label>
            <input
              type="text"
              id="paymentDetails1"
              value={formData.paymentDetails1}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Alternative Payment Method */}
          <div className="flex flex-col md:col-span-2">
            <label htmlFor="paymentDetails2" className="text-sm font-medium text-gray-700 mb-1">
              Alternative Payment Method
            </label>
            <input
              type="text"
              id="paymentDetails2"
              value={formData.paymentDetails2}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Order...' : 'Create Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNewOrder;