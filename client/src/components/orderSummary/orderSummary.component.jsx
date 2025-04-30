import React, { useState, useContext, useEffect } from "react";
import { OrderContext } from "../../OrderContext/OrderContext";
import { UserContext } from "../../UserContext/UserContext";
import ProductSelectionModal from "../productSelectionModal/productSelectionModal";

const OrderSummary = () => {
  const [expandedSharing, setExpandedSharing] = useState({});
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedProductOrders, setExpandedProductOrders] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedCategory, setSelectedCategory] = useState(null);
const [isUpdating, setIsUpdating] = useState(false);
const [updateError, setUpdateError] = useState(null);

  const { order, isLoading, error, getProductsByCategory, calculateCategoryTotals, calculateOrderTotals, categories, setOrder } = useContext(OrderContext);
  const { user } = useContext(UserContext);

  console.log('OrderSummary Component Render:', {
    order,
    isLoading,
    error,
    localStorageOrder: localStorage.getItem('order')
  });

  // Restructure order products from context to group by product within categories
  const categorizedProductGroups = React.useMemo(() => {
    if (!order?.products) {
      console.log("categorizedProductGroups useMemo - order.products is empty or null:", order);
      return {};
    }

    const groupedData = {};
    Object.values(categories).forEach(categoryName => {
      console.log("categorizedProductGroups useMemo - Processing category:", categoryName);
      const productsInCategory = getProductsByCategory(categoryName);
      console.log("categorizedProductGroups useMemo - Products in category:", categoryName, productsInCategory);

      if (productsInCategory && productsInCategory.length > 0) {
        const productsMap = new Map();
        productsInCategory.forEach(orderItem => {
          console.log("categorizedProductGroups useMemo - Processing orderItem:", orderItem);
          if (productsMap.has(orderItem.product)) {
            productsMap.get(orderItem.product).orders.push(orderItem);
          } else {
            productsMap.set(orderItem.product, {
              product: orderItem.product,
              brand: orderItem.brand,
              unitPrice: orderItem.unitPrice,
              standardPackaging: orderItem.standardPackaging,
              orders: [orderItem]
            });
          }
        });
        groupedData[categoryName] = Array.from(productsMap.values());
      } else {
        groupedData[categoryName] = []; // Ensure category exists even if empty
      }
    });
    console.log("categorizedProductGroups useMemo - Final groupedData:", groupedData);
    return groupedData;
  }, [order, getProductsByCategory, categories]);

  useEffect(() => {
    const cachedOrder = localStorage.getItem('order');
    if (cachedOrder) {
      try {
        const parsedOrder = JSON.parse(cachedOrder);
        if (!order && parsedOrder._id) {
          setOrder(parsedOrder);
        }
      } catch (err) {
        console.error('Error parsing cached order:', err);
      }
    }
  }, [order, setOrder]);

  const toggleSharing = (category, productName, orderIndex) => {
    setExpandedSharing(prev => ({
      ...prev,
      [`${category}-${productName}-${orderIndex}`]: !prev[`${category}-${productName}-${orderIndex}`]
    }));
  };

  const toggleProductOrders = (category, productName) => {
    setExpandedProductOrders(prev => ({
      ...prev,
      [`${category}-${productName}`]: !prev[`${category}-${productName}`]
    }));
  };

  const calculateAmounts = (unitPrice, quantity) => {
    const amount = unitPrice * quantity;
    const vat = amount * 0.05; // VAT_RATE is already in OrderContext, consider using it from there for consistency
    const total = amount + vat;
    return { amount, vat, total };
  };

  const formatCurrency = (value) => {
    return `AED ${value.toFixed(2)}`;
  };

  const calculateProductTotals = (productData) => {
    return productData.orders.reduce((acc, order) => {
      const { amount, vat, total } = calculateAmounts(productData.unitPrice, order.quantity);
      return {
        boxes: acc.boxes + order.quantity,
        amount: acc.amount + amount,
        vat: acc.vat + vat,
        total: acc.total + total
      };
    }, { boxes: 0, amount: 0, vat: 0, total: 0 });
  };

  const handleAddProduct = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const updateOrderProducts = async (productsToAdd) => {
    if (!order || !productsToAdd.length) return;
    
    setIsUpdating(true);
    setUpdateError(null);
    
    try {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      console.log("Products to add:", productsToAdd);
      
      // Simplified approach - send all products at once in a format matching your backend
      const response = await fetch(`http://localhost:8000/manyama/orders/${order._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          products: productsToAdd
        })
      });
      
      // Get the full response text for debugging
      const responseText = await response.text();
      console.log("Response status:", response.status);
      console.log("Response text:", responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error("Response is not valid JSON:", e);
      }
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} - ${responseText}`);
      }
      
      // After successful update, fetch the updated order
      const updatedOrderResponse = await fetch(`http://localhost:8000/manyama/orders/${order._id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!updatedOrderResponse.ok) {
        throw new Error(`Error fetching updated order: ${updatedOrderResponse.status}`);
      }
      
      const updatedOrderData = await updatedOrderResponse.json();
      console.log('Updated order response:', updatedOrderData);
      
      // Update the order in context/state
      if (updatedOrderData.data && updatedOrderData.data.order) {
        setOrder(updatedOrderData.data.order);
        
        // Update localStorage
        localStorage.setItem('order', JSON.stringify(updatedOrderData.data.order));
      }
    } catch (err) {
      console.error('Error updating order products:', err);
      setUpdateError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };



  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  // MobileProductCard component
  const MobileProductCard = ({ productData, category }) => {
    const productTotals = calculateProductTotals(productData);

    return (
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">

      {/* Show update error if exists * */}
      {updateError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error updating order: </strong>
          <span className="block sm:inline">{updateError}</span>
        </div>
      )}
      
      {/* Show updating indicator * */}
      {isUpdating && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded relative mb-4" role="alert">
          <div className="flex items-center">
            <div className="w-4 h-4 mr-2 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Updating order...</span>
          </div>
        </div>
      )}

        <div className="grid grid-cols-1 gap-3">
          <div>
            <p className="text-sm text-gray-500">Product</p>
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-900">{productData.product}</p>
              <button
                onClick={() => toggleProductOrders(category, productData.product)}
                className="text-blue-600 text-sm"
              >
                {expandedProductOrders[`${category}-${productData.product}`] ? 'Hide Orders' : 'Show Orders'}
              </button>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Brand</p>
            <p className="font-medium text-gray-900">{productData.brand}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Quantity</p>
            <p className="font-medium text-gray-900">{productTotals.boxes} boxes</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="font-medium text-gray-900">{formatCurrency(productTotals.total)}</p>
          </div>
          {expandedProductOrders[`${category}-${productData.product}`] && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Orders:</p>
              {productData.orders.map((order, orderIndex) => (
                <div key={orderIndex} className="bg-gray-50 p-2 rounded-md mt-1">
                  <p className="text-sm text-gray-700">Order {orderIndex + 1}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Quantity</p>
                      <p className="text-sm font-medium text-gray-900">{order.product.quantity} boxes</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Ordered By</p>
                      <div className="text-sm font-medium text-gray-900">
                        {order.isShared ? (
                          <div className="relative">
                            <button
                              onClick={() => toggleSharing(category, productData.product, orderIndex)}
                              className="text-blue-600 text-xs"
                            >
                              {order.orderedBy[0].user.userName}...
                            </button>
                            {expandedSharing[`${category}-${productData.product}-${orderIndex}`] && (
                              <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-sm">
                                {order.orderedBy.map((user, idx) => (
                                  <div key={idx} className="px-4 py-2 hover:bg-gray-100">
                                    {user.userName} ({user.ratio})
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          order.orderedBy[0].user.userName
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Calculate the grand total (moved before early returns)
  const grandTotal = calculateOrderTotals();

  if (isLoading) {
    return <div className="text-center p-4">Loading order summary...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  if (!order) {
    return <div className="text-center p-4">No order data available.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Order Summary</h1>
        <div className="w-full sm:w-auto bg-blue-50 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Grand Total</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Boxes</p>
              <p className="font-medium">{grandTotal.boxes}</p>
            </div>
            <div>
              <p className="text-gray-600">Amount</p>
              <p className="font-medium">{formatCurrency(grandTotal.amount)}</p>
            </div>
            <div>
              <p className="text-gray-600">VAT 5%</p>
              <p className="font-medium">{formatCurrency(grandTotal.vat)}</p>
            </div>
            <div>
              <p className="text-gray-600">Total</p>
              <p className="font-medium">{formatCurrency(grandTotal.total)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-6">
        {Object.entries(categorizedProductGroups).map(([category, products]) => {
          const categoryTotals = calculateCategoryTotals(products);

          return (
            <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Category Header */}
              <div
                className="p-4 bg-gray-50 cursor-pointer"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-700">{category}</h2>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {products.reduce((sum, product) => sum + calculateProductTotals(product).boxes, 0)} boxes
                    </span>
                    <svg
                      className={`w-5 h-5 transform transition-transform ${expandedCategory === category ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Category Content */}
              {expandedCategory === category && (
                <div className="p-4">
                  {products.length > 0 ? (
                    <>
                      {/* Mobile View */}
                      <div className="block sm:hidden">
                        {products.map((productData, index) => (
                          <MobileProductCard
                            key={index}
                            productData={productData}
                            category={category}
                          />
                        ))}
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-medium mb-2">Category Total</h3>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-gray-600">Boxes</p>
                              <p className="font-medium">{categoryTotals.boxes}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Total</p>
                              <p className="font-medium">{formatCurrency(categoryTotals.total)}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop View */}
                      <div className="hidden sm:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight/Box</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Boxes</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VAT 5%</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((productData, index) => {
                              const productTotals = calculateProductTotals(productData);
                              const { amount, vat, total } = productTotals;

                              return (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{productData.product}</td>
                                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{productData.brand}</td>
                                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(productData.unitPrice)}</td>
                                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{productData.standardPackaging} kg</td>
                                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{productTotals.boxes}</td>
                                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(amount)}</td>
                                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(vat)}</td>
                                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(total)}</td>
                                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button
                                      onClick={() => toggleProductOrders(category, productData.product)}
                                      className="text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                      {expandedProductOrders[`${category}-${productData.product}`] ? 'Hide' : 'Show'} Orders
                                    </button>
                                    {expandedProductOrders[`${category}-${productData.product}`] && (
                                      <div className="mt-2">
                                        {productData.orders.map((order, orderIndex) => (
                                          <div key={orderIndex} className="bg-gray-50 p-2 rounded-md mt-1 text-xs">
                                            <strong className="block">Order {orderIndex + 1}:</strong>
                                            <div>Quantity: {order.product.quantity} boxes</div>
                                            <div>Ordered By:
                                              {order.isShared ? (
                                                <div className="relative inline-block">
                                                  <button
                                                    onClick={() => toggleSharing(category, productData.product, orderIndex)}
                                                    className="text-blue-600 hover:text-blue-800 text-xs"
                                                  >
                                                    {order.orderedBy[0].user.userName}...
                                                  </button>
                                                  {expandedSharing[`${category}-${productData.product}-${orderIndex}`] && (
                                                    <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-sm">
                                                      {order.orderedBy.map((user, idx) => (
                                                        <div key={idx} className="px-4 py-2 hover:bg-gray-100">
                                                          {user.name} ({user.ratio})
                                                        </div>
                                                      ))}
                                                    </div>
                                                  )}
                                                </div>
                                              ) : (
                                                order.orderedBy[0].user.userName
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                            {/* Category Subtotal Row */}
                            <tr className="bg-gray-50 font-medium">
                              <td colSpan={4} className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">Category Total</td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{categoryTotals.boxes}</td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(categoryTotals.amount)}</td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(categoryTotals.vat)}</td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(categoryTotals.total)}</td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-500 text-sm mb-4">
                      No boxes in this category yet
                    </div>
                  )}

                  {/* Add Product Button */}
                  <div className="mt-4">
                    <button
                      onClick={() => handleAddProduct(category)}
                      className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add {category} Product
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ProductSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
        onAddProducts={updateOrderProducts}
      />
    </div>
  );
};

export default OrderSummary;