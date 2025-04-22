import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from "react";
import { UserContext } from "../UserContext/UserContext";

export const OrderContext = createContext(null);

const VAT_RATE = 0.05;

export const OrderProvider = ({ children }) => {
    const CATEGORIES = {
        PORK: "Pork",
        BEEF: "Beef",
        POULTRY: "Poultry",
        SEAFOOD: "Seafood",
        LAMB: "Lamb",
        VEGETABLES: "Vegetables"
    };

    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useContext(UserContext);

    const calculateAmounts = useCallback((unitPrice, quantity) => {
        const amount = unitPrice * quantity;
        const vat = amount * VAT_RATE;
        const total = amount + vat;
        return { amount, vat, total };
    }, []);

    const calculateCategoryTotals = useCallback((products) => {
        return products.reduce((acc, item) => {
            const { amount, vat, total } = calculateAmounts(item.unitPrice, item.quantity);
            return {
                boxes: acc.boxes + item.quantity,
                amount: acc.amount + amount,
                vat: acc.vat + vat,
                total: acc.total + total
            };
        }, { boxes: 0, amount: 0, vat: 0, total: 0 });
    }, [calculateAmounts]);

    // Define categorizeProducts BEFORE calculateOrderTotals
    const categorizeProducts = useCallback((products) => {
        return products.reduce((acc, product) => {
            const category = product.category || "Uncategorized";
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(product);
            return acc;
        }, Object.keys(CATEGORIES).reduce((obj, key) => ({ ...obj, [CATEGORIES[key]]: [] }), {}));
    }, [CATEGORIES]);

    const calculateOrderTotals = useCallback(() => {
        if (!order?.products) return { boxes: 0, amount: 0, vat: 0, total: 0 };
        const categorizedProducts = categorizeProducts(order.products);
        return Object.values(categorizedProducts).reduce((acc, products) => {
            const categoryTotals = calculateCategoryTotals(products);
            return {
                boxes: acc.boxes + categoryTotals.boxes,
                amount: acc.amount + categoryTotals.amount,
                vat: acc.vat + categoryTotals.vat,
                total: acc.total + categoryTotals.total
            };
        }, { boxes: 0, amount: 0, vat: 0, total: 0 });
    }, [order?.products, calculateCategoryTotals, categorizeProducts]);

    const clearOrder = useCallback(() => {
        localStorage.removeItem('order');
        setOrder(null);
        setError(null);
        setIsLoading(false);
    }, []);

    const fetchOrder = useCallback(async (orderId) => {
        try {
            setIsLoading(true);
            setError(null);
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication token not found');
            }
            const response = await fetch(`http://localhost:8000/manyama/orders/${orderId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to fetch order');
            }
            const responseData = await response.json();
            const orderData = responseData.data?.order || responseData;
            console.log('Fetched order data:', orderData);
            setOrder(orderData);
            localStorage.setItem('order', JSON.stringify(orderData));
        } catch (err) {
            setError(err.message || 'Failed to fetch order');
            localStorage.removeItem('order');
        } finally {
            setIsLoading(false);
        }
    }, [setOrder, setError, setIsLoading]);

    useEffect(() => {
        const initializeOrder = async () => {
            try {
                const cachedOrder = localStorage.getItem('order');
                if (!cachedOrder) {
                    setOrder(null);
                    setIsLoading(false);
                    return;
                }
                const orderData = JSON.parse(cachedOrder);
                if (orderData?._id) {
                    await fetchOrder(orderData._id);
                } else {
                    setOrder(orderData);
                    setIsLoading(false);
                }
            } catch (err) {
                setError(err.message || 'Failed to initialize order');
                localStorage.removeItem('order');
                setIsLoading(false);
            }
        };
        initializeOrder();
    }, [user, fetchOrder, setOrder, setIsLoading, setError]);

    const updateOrder = useCallback(async (orderId, updateData) => {
        try {
            setIsLoading(true);
            setError(null);
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication token not found');
            }
            const response = await fetch(`http://localhost:8000/manyama/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify(updateData)
            });
            if (!response.ok) {
                throw new Error('Failed to update order');
            }
            const data = await response.json();
            setOrder(data);
            localStorage.setItem('order', JSON.stringify(data));
        } catch (err) {
            setError(err.message || 'Failed to update order');
            if (err.message.includes('token')) {
                setError('Please login again to update the order');
            }
        } finally {
            setIsLoading(false);
        }
    }, [setOrder, setError, setIsLoading]);

    const addProduct = useCallback(async (productData) => {
        if (!order?._id) {
            setError('No active order found');
            return;
        }
        if (!productData.category || !CATEGORIES[productData.category.toUpperCase()]) {
            setError('Invalid product category');
            return;
        }
        const updatedProducts = [...(order.products || []), {
            ...productData,
            orderedBy: productData.orderedBy || [{ name: user?.firstName, ratio: "1" }]
        }];
        await updateOrder(order._id, { products: updatedProducts });
    }, [order?._id, setError, updateOrder, user?.firstName]);

    const removeProduct = useCallback(async (productId) => {
        if (!order?._id) {
            setError('No active order found');
            return;
        }
        const updatedProducts = order.products.filter(p => p._id !== productId);
        await updateOrder(order._id, { products: updatedProducts });
    }, [order?._id, setError, updateOrder]);

    const updateOrderStatus = useCallback(async (status) => {
        if (!order?._id) {
            setError('No active order found');
            return;
        }
        await updateOrder(order._id, { orderStatus: status });
    }, [order?._id, setError, updateOrder]);

    const getProductsByCategory = useCallback((category) => {
        if (!order?.products) return [];
        return categorizeProducts(order.products)[category] || [];
    }, [order?.products, categorizeProducts]);

    const value = useMemo(() => ({
        order,
        setOrder,
        isLoading,
        error,
        clearOrder,
        updateOrder,
        fetchOrder,
        addProduct,
        removeProduct,
        updateOrderStatus,
        getProductsByCategory,
        calculateAmounts,
        calculateCategoryTotals,
        calculateOrderTotals,
        categories: CATEGORIES
    }), [
        order,
        setOrder,
        isLoading,
        error,
        clearOrder,
        updateOrder,
        fetchOrder,
        addProduct,
        removeProduct,
        updateOrderStatus,
        getProductsByCategory,
        calculateAmounts,
        calculateCategoryTotals,
        calculateOrderTotals,
        CATEGORIES
    ]);

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
};