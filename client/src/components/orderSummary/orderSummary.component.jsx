import React, { useState } from "react";

const OrderSummary = () => {
  const [expandedSharing, setExpandedSharing] = useState({});
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Dummy data
  const dummyData = {
    "Pork": [
      {
        product: "Pork Loin Ribs",
        brand: "Alibem",
        unitPrice: 160.56,
        packageWeight: 10,
        orderedBy: [
          { name: "Tanaka", ratio: "1/2" },
          { name: "Zuva", ratio: "1/4" },
          { name: "Luna", ratio: "1/4" }
        ],
        quantity: 1,
        isShared: true
      },
      {
        product: "Pork Belly",
        brand: "Seara",
        unitPrice: 145.20,
        packageWeight: 8,
        orderedBy: [{ name: "Mike", ratio: "1" }],
        quantity: 2,
        isShared: false
      }
    ],
    "Beef": [
      {
        product: "Beef Ribeye",
        brand: "Swift",
        unitPrice: 280.35,
        packageWeight: 12,
        orderedBy: [
          { name: "Sarah", ratio: "1/3" },
          { name: "John", ratio: "2/3" }
        ],
        quantity: 3,
        isShared: true
      }
    ],
    "Poultry": [],
    "Seafood": [],
    "Lamb": [],
    "Vegetables": []
  };

  const toggleSharing = (category, index) => {
    setExpandedSharing(prev => ({
      ...prev,
      [`${category}-${index}`]: !prev[`${category}-${index}`]
    }));
  };

  const calculateAmounts = (unitPrice, quantity) => {
    const amount = unitPrice * quantity;
    const vat = amount * 0.05;
    const total = amount + vat;
    return { amount, vat, total };
  };

  const formatCurrency = (value) => {
    return `AED ${value.toFixed(2)}`;
  };

  const calculateCategoryTotals = (products) => {
    return products.reduce((acc, item) => {
      const { amount, vat, total } = calculateAmounts(item.unitPrice, item.quantity);
      return {
        boxes: acc.boxes + item.quantity,
        amount: acc.amount + amount,
        vat: acc.vat + vat,
        total: acc.total + total
      };
    }, { boxes: 0, amount: 0, vat: 0, total: 0 });
  };

  const calculateGrandTotal = () => {
    return Object.values(dummyData).reduce((acc, products) => {
      const categoryTotals = calculateCategoryTotals(products);
      return {
        boxes: acc.boxes + categoryTotals.boxes,
        amount: acc.amount + categoryTotals.amount,
        vat: acc.vat + categoryTotals.vat,
        total: acc.total + categoryTotals.total
      };
    }, { boxes: 0, amount: 0, vat: 0, total: 0 });
  };

  const handleAddProduct = (category) => {
    console.log(`Adding product to ${category}`);
  };

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const grandTotal = calculateGrandTotal();

  // MobileProductCard component modification
const MobileProductCard = ({ item, category, index }) => {
    const { total } = calculateAmounts(item.unitPrice, item.quantity);
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-sm text-gray-500">Product</p>
            <p className="font-medium text-gray-900">{item.product}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Brand</p>
            <p className="font-medium text-gray-900">{item.brand}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Quantity</p>
            <p className="font-medium text-gray-900">{item.quantity} boxes</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ordered By</p>
            <div className="font-medium text-gray-900">
              {item.isShared ? (
                <div className="relative">
                  <button
                    onClick={() => toggleSharing(category, index)}
                    className="text-blue-600"
                  >
                    {item.orderedBy[0].name}...
                  </button>
                  {expandedSharing[`${category}-${index}`] && (
                    <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-sm">
                      {item.orderedBy.map((user, idx) => (
                        <div key={idx} className="px-4 py-2 hover:bg-gray-100">
                          {user.name} ({user.ratio})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                item.orderedBy[0].name
              )}
            </div>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Total</p>
            <p className="font-medium text-gray-900">{formatCurrency(total)}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header with Grand Total */}
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
        {Object.entries(dummyData).map(([category, products]) => {
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
                      {products.length} boxes
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
                        {products.map((item, index) => (
                          <MobileProductCard 
                            key={index}
                            item={item}
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
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ordered By</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Boxes</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VAT 5%</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((item, index) => {
                              const { amount, vat, total } = calculateAmounts(item.unitPrice, item.quantity);
                              return (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{item.product}</td>
                                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{item.brand}</td>
                                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.unitPrice)}</td>
                                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{item.packageWeight} kg</td>
                                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.isShared ? (
                                      <div className="relative">
                                        <button
                                          onClick={() => toggleSharing(category, index)}
                                          className="text-blue-600 hover:text-blue-800"
                                        >
                                          {item.orderedBy[0].name}...
                                        </button>
                                        {expandedSharing[`${category}-${index}`] && (
                                          <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-sm">
                                            {item.orderedBy.map((user, idx) => (
                                              <div key={idx} className="px-4 py-2 hover:bg-gray-100">
                                                {user.name} ({user.ratio})
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      item.orderedBy[0].name
                                    )}
                                  </td>
                                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(amount)}</td>
                                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(vat)}</td>
                                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(total)}</td>
                                </tr>
                              );
                            })}
                            {/* Category Subtotal Row */}
                            <tr className="bg-gray-50 font-medium">
                              <td colSpan={5} className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">Category Total</td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{categoryTotals.boxes}</td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(categoryTotals.amount)}</td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(categoryTotals.vat)}</td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(categoryTotals.total)}</td>
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
    </div>
  );
};

export default OrderSummary;