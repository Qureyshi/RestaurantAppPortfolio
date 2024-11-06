import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import MyNavbar from './MyNavbar';
import MyFooter from './MyFooter';

// Helper function to retrieve the token from cookies
const getTokenFromCookies = () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('authToken='));
    return token ? token.split('=')[1].trim() : null;
};

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingItems, setLoadingItems] = useState({});
    const [orderError, setOrderError] = useState(null);

    useEffect(() => {
        const fetchCartItems = async () => {
            const authToken = getTokenFromCookies();
            if (!authToken) {
                console.error('No auth token found');
                setLoading(false);
                return;
            }
            try {
                const response = await fetch('http://localhost:8000/api/cart/menu-items', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const cartData = await response.json();
                setCartItems(cartData.results);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCartItems();
    }, []);

    const handleRemoveItem = async (menuItemId) => {
        const authToken = getTokenFromCookies();
        if (!authToken) {
            console.error('No auth token found');
            return;
        }
        try {
            const response = await fetch(`http://localhost:8000/api/cart/menu-items/${menuItemId}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Token ${authToken}` },
            });
            if (!response.ok) throw new Error(`Failed to delete item`);
            setCartItems(prevItems => prevItems.filter(item => item.menuitem.id !== menuItemId));
        } catch (error) {
            console.error('Error deleting item:', error);
            alert("Failed to remove item");
        }
    };

    const updateQuantity = async (menuItemId, newQuantity, action) => {
        if (loadingItems[menuItemId] || newQuantity < 1) return;

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.menuitem.id === menuItemId ? { ...item, quantity: newQuantity } : item
            )
        );

        setLoadingItems(prev => ({ ...prev, [menuItemId]: true }));

        const authToken = getTokenFromCookies();
        if (!authToken) {
            console.error('No auth token found');
            return;
        }

        const updatedQuantity = action === 'increase' ? 1 : -1;
        try {
            const response = await fetch('http://localhost:8000/api/cart/menu-items', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    menuitem_id: menuItemId,
                    quantity: updatedQuantity,
                }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error updating item quantity:', errorText);
                setCartItems(prevItems =>
                    prevItems.map(item =>
                        item.menuitem.id === menuItemId ? { ...item, quantity: newQuantity === item.quantity ? 1 : item.quantity } : item
                    )
                );
            }
        } catch (error) {
            console.error('Error updating item quantity:', error);
        } finally {
            setLoadingItems(prev => ({ ...prev, [menuItemId]: false }));
        }
    };

    const handleOrder = async () => {
        setOrderError(null);
        const authToken = getTokenFromCookies();
        if (!authToken) {
            console.error('No auth token found');
            return;
        }
        try {
            const response = await fetch('http://localhost:8000/api/orders', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            const orderData = await response.json();
            setCartItems([]);
        } catch (error) {
            setOrderError(error.message);
            console.error('Error creating order:', error);
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);

    return (
        <>
            <MyNavbar />
            <div className='container-fluid p-5 orders'>
                <div className='p-5 text-center text-danger'>
                    <h1 className='font-weight-bold'>CART LIST</h1>
                </div>
            </div>
            <div className="container my-5">
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <div className="row" style={{ overflowY: "auto" }}>
                        <div className="col-12">
                            <table className="table text-center">
                                <tbody>
                                    {cartItems.map(item => {
                                        const unitPrice = parseFloat(item.unit_price) || 0;
                                        return (
                                            <tr key={item.menuitem.id}>
                                                <td className='p-5'>
                                                    <img src={item.menuitem.image} alt={item.menuitem.title} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                                                </td>
                                                <td className='p-5'>{item.menuitem.title}</td>
                                                <td className='p-5'>${unitPrice.toFixed(2)}</td>
                                                <td className='p-5'>
                                                    <span 
                                                        onClick={() => updateQuantity(item.menuitem.id, item.quantity - 1, 'decrease')} 
                                                        style={{ cursor: 'pointer', padding: '0 10px', color: loadingItems[item.menuitem.id] || item.quantity <= 1 ? 'grey' : 'black' }}
                                                        disabled={loadingItems[item.menuitem.id] || item.quantity <= 1}
                                                    >-</span>
                                                    {item.quantity}
                                                    <span 
                                                        onClick={() => updateQuantity(item.menuitem.id, item.quantity + 1, 'increase')} 
                                                        style={{ cursor: 'pointer', padding: '0 10px', color: loadingItems[item.menuitem.id] ? 'grey' : 'black' }}
                                                        disabled={loadingItems[item.menuitem.id]}
                                                    >+</span>
                                                </td>
                                                <td className='p-5'>${(unitPrice * item.quantity).toFixed(2)}</td>
                                                <td className='p-5'>
                                                    <button className="btn btn-danger" onClick={() => handleRemoveItem(item.menuitem.id)}>
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                <div className="row">
                    <div className="col-md-3 offset-md-9">
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td>Cart Subtotal</td>
                                    <td>${subtotal.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Order Total</td>
                                    <td>${subtotal.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                        <button className="btn btn-danger w-100" onClick={handleOrder}>Order</button>
                        {orderError && <div className="text-danger mt-2">{orderError}</div>}
                    </div>
                </div>
            </div>
            <MyFooter />
        </>
    );
};

export default Cart;
