import React, { useState, useEffect, useContext, useRef } from 'react';
import { OrderContext } from '../../OrderContext/OrderContext';
import { UserContext } from '../../UserContext/UserContext';

const ProductSelectionModal = ({ 
  isOpen, 
  onClose, 
  category,
  onAddProducts 
}) => {
  const { order, getProductsByCategory } = useContext(OrderContext);
  const { user } = useContext(UserContext);
  
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [isPortrait, setIsPortrait] = useState(false);
  const [showBlinkingNotice, setShowBlinkingNotice] = useState(false);
  const blinkIntervalRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch available products using an effect
  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
          throw new Error('Authentication token not found. Please log in again.');
        }
        
        const response = await fetch(`http://localhost:8000/manyama/products?category=${category}`, {
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
        console.log('Fetched products data:', data);
        
        // Handle the specific response structure from your API
        if (!data.data?.allProducts) {
          throw new Error('Invalid response format: Expected data.data.allProducts');
        }
        
        const productsArray = data.data.allProducts;
        console.log('Products array:', productsArray);
        
        setAvailableProducts(productsArray);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        // Set fallback empty array
        setAvailableProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen && category) {
      fetchProducts();
    }
  }, [isOpen, category]);
  
  // Get current user's existing order items in this category
  const existingOrderProducts = order?.products?.filter(item => 
    item.category === category && item.orderedBy.some(orderUser => orderUser.id === user.id)
  );
  
  // Get shared order items in this category (ordered by other users)
  const sharedOrderProducts = order?.products?.filter(item => 
    item.category === category && 
    item.isShared && 
    !item.orderedBy.some(orderUser => orderUser.id === user.id)
  );
  
  // Initialize with filtered products - real-time filtering
  useEffect(() => {
    if (!availableProducts || availableProducts.length === 0) {
      setFilteredProducts([]);
      return;
    }
    
    // Only filter if search term has content
    if (searchTerm.trim() === '') {
      setFilteredProducts(availableProducts);
      return;
    }
    
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    
    // Apply the filter
    const filtered = availableProducts.filter(product => 
      product.name.toLowerCase().includes(lowerCaseSearchTerm) || 
      (product.brandName && product.brandName.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (product.brand && product.brand.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (product.description && product.description.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (product.countryOfOrigin && product.countryOfOrigin.toLowerCase().includes(lowerCaseSearchTerm))
    );
    
    setFilteredProducts(filtered);
  }, [availableProducts, searchTerm]);
  
  // Initialize with user's current quantities
  useEffect(() => {
    if (existingOrderProducts && existingOrderProducts.length > 0) {
      const quantities = {};
      
      existingOrderProducts.forEach(orderItem => {
        // Find the user's specific quantity for shared products
        if (orderItem.isShared) {
          const userShare = orderItem.orderedBy.find(share => share.id === user.id);
          if (userShare) {
            // If this is a shared order, get this user's portion based on ratio
            const userQuantity = Math.round(orderItem.quantity * userShare.ratio / 100);
            quantities[orderItem.product] = userQuantity;
          }
        } else {
          // For non-shared orders, use the full quantity
          quantities[orderItem.product] = orderItem.quantity;
        }
      });
      
      setSelectedQuantities(quantities);
    }
  }, [existingOrderProducts, user.id]);
  
  // Check device orientation
  useEffect(() => {
    const checkOrientation = () => {
      // Check if we're on a mobile device with a small screen
      const isMobileSize = window.innerWidth < 768;
      const isInPortraitMode = window.innerHeight > window.innerWidth;
      
      // Only show the notice on mobile devices in portrait mode
      setIsPortrait(isMobileSize && isInPortraitMode);
    };

    // Check orientation initially and on resize
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    
    return () => {
      window.removeEventListener('resize', checkOrientation);
    };
  }, []);
  
  // Handle blinking effect for the landscape mode recommendation
  useEffect(() => {
    if (isPortrait && isOpen) {
      setShowBlinkingNotice(true);
      blinkIntervalRef.current = setInterval(() => {
        setShowBlinkingNotice(prev => !prev);
      }, 800); // Blink every 800ms
    } else {
      setShowBlinkingNotice(false);
      if (blinkIntervalRef.current) {
        clearInterval(blinkIntervalRef.current);
      }
    }
    
    return () => {
      if (blinkIntervalRef.current) {
        clearInterval(blinkIntervalRef.current);
      }
    };
  }, [isPortrait, isOpen]);
  
  const handleQuantityChange = (productId, quantity) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }));
  };
  
  const handleAddProducts = () => {
    // Filter out products with 0 quantity
    const productsToAdd = Object.entries(selectedQuantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([productId, quantity]) => {
        const product = availableProducts.find(p => p._id === productId || p.id === productId);
        if (!product) return null;
        
        return { 
          product: productId,
          brand: product.brandName || product.brand || '',
          unitPrice: product.price || 0,
          packageWeight: product.weight || 1, // Fallback weight if not provided
          quantity,
          category,
          isShared: false, // Default to not shared - sharing would be handled separately
          orderedBy: [{ id: user.id, name: user.name, ratio: 100 }]
        };
      })
      .filter(Boolean); // Remove null entries if product wasn't found
    
    onAddProducts(productsToAdd);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add {category} Products</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <span className="sr-only">Close</span>
            &times;
          </button>
        </div>
        
        {/* Landscape Mode Recommendation */}
        {isPortrait && (
          <div 
            className={`px-4 py-2 bg-yellow-100 border-b border-yellow-300 transition-all duration-300 ${
              showBlinkingNotice 
                ? 'bg-yellow-200 text-yellow-800 shadow-md' 
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            <div className="flex items-center justify-center text-sm font-medium">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2 animate-pulse" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
                />
              </svg>
              Rotate your device to landscape mode for a better view of the product table.
            </div>
          </div>
        )}
        
        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="overflow-y-auto flex-grow p-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Your Quantity</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map(product => {
                // Use _id for API products or fall back to id for compatibility
                const productId = product._id || product.id;
                const currentQuantity = selectedQuantities[productId] || 0;
                const isInUserOrder = currentQuantity > 0;
                
                // Check if this product is in shared orders
                const sharedProduct = sharedOrderProducts?.find(item => item.product === productId);
                const isInSharedOrder = !!sharedProduct;
                
                return (
                  <tr key={productId} className={isInUserOrder ? "bg-blue-50" : ""}>
                    <td className="px-3 py-4 whitespace-nowrap">{product.name}</td>
                    <td className="px-3 py-4 whitespace-nowrap">{product.brandName || product.brand || '-'}</td>
                    <td className="px-3 py-4 whitespace-nowrap">AED {(product.price || 0).toFixed(2)}</td>
                    <td className="px-3 py-4 whitespace-nowrap">{product.weight || '1'} kg</td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          className="px-2 py-1 border rounded-l bg-gray-100"
                          onClick={() => handleQuantityChange(productId, Math.max(0, currentQuantity - 1))}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={currentQuantity}
                          onChange={e => handleQuantityChange(productId, parseInt(e.target.value) || 0)}
                          className="w-16 text-center border-t border-b"
                        />
                        <button
                          className="px-2 py-1 border rounded-r bg-gray-100"
                          onClick={() => handleQuantityChange(productId, currentQuantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {isInUserOrder && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          In your order
                        </span>
                      )}
                      {isInSharedOrder && (
                        <div className="mt-1">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Shared order ({sharedProduct.orderedBy.map(u => u.name).join(', ')})
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-3 py-4 text-center text-gray-500">
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAddProducts}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSelectionModal;