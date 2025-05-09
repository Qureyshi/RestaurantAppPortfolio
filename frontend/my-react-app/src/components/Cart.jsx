import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import MyNavbar from './MyNavbar';
import MyFooter from './MyFooter';

const getTokenFromCookies = () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('authToken='));
    return token ? token.split('=')[1].trim() : null;
};

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingItems, setLoadingItems] = useState({});
    const [orderError, setOrderError] = useState(null);
    const [bonusUsed, setBonusUsed] = useState(0);
    const [tip, setTip] = useState(0);
    const [bonusEarned, setBonusEarned] = useState(0);
    const [demoMode, setDemoMode] = useState(false);

    useEffect(() => {
        const fetchCartItems = async () => {
            const authToken = getTokenFromCookies();

            const dummyCartItems = [
                {
                    menuitem: {
                        id: 1,
                        title: "Chicken Pizza",
                        image: "/images/burger1.jpg",
                    },
                    unit_price: 10.99,
                    quantity: 2,
                },
                {
                    menuitem: {
                        id: 2,
                        title: "Veggie Burger",
                        image: "/images/burger2.jpg",
                    },
                    unit_price: 8.49,
                    quantity: 1,
                },
                {
                    menuitem: {
                        id: 3,
                        title: "Classic Burger",
                        image: "/images/burger3.jpg",
                    },
                    unit_price: 6.25,
                    quantity: 3,
                },
            ];

            try {
                if (!authToken) {
                    console.warn('No token found. Using demo data.');
                    setCartItems(dummyCartItems);
                    setBonusEarned(5);
                    setDemoMode(true);
                    return;
                }

                const userResponse = await fetch('http://localhost:8000/auth/users/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setBonusEarned(userData.bonus_earned || 0);
                }

                const cartResponse = await fetch('http://localhost:8000/api/cart/menu-items', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (cartResponse.ok) {
                    const cartData = await cartResponse.json();
                    setCartItems(cartData.results);
                } else {
                    throw new Error("Cart fetch failed");
                }
            } catch (error) {
                console.error('Using dummy data due to error:', error);
                setCartItems(dummyCartItems);
                setBonusEarned(5);
                setDemoMode(true);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    const handleRemoveItem = (menuItemId) => {
        if (demoMode) {
            setCartItems(prevItems => prevItems.filter(item => item.menuitem.id !== menuItemId));
            return;
        }
        // Real API logic here if not demo
    };

    const updateQuantity = (menuItemId, newQuantity, action) => {
        if (loadingItems[menuItemId] || newQuantity < 1) return;

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.menuitem.id === menuItemId ? { ...item, quantity: newQuantity } : item
            )
        );

        if (demoMode) return;

        setLoadingItems(prev => ({ ...prev, [menuItemId]: true }));
        const authToken = getTokenFromCookies();
        const updatedQuantity = action === 'increase' ? 1 : -1;

        fetch('http://localhost:8000/api/cart/menu-items', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${authToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                menuitem_id: menuItemId,
                quantity: updatedQuantity,
            }),
        }).catch(console.error)
          .finally(() => setLoadingItems(prev => ({ ...prev, [menuItemId]: false })));
    };

    const handleOrder = async () => {
        setOrderError(null);

        if (demoMode) {
            alert("Order placed successfully (demo mode)");
            setCartItems([]);
            navigate('/orders');
            return;
        }

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
                body: JSON.stringify({
                    bonus_used: bonusUsed,
                    tip: tip,
                }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            setCartItems([]);
            navigate('/orders');
        } catch (error) {
            setOrderError(error.message);
            console.error('Error creating order:', error);
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);
    const total = Math.max(0, subtotal + Number(tip) - Number(bonusUsed));

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
                                                    >-</span>
                                                    {item.quantity}
                                                    <span 
                                                        onClick={() => updateQuantity(item.menuitem.id, item.quantity + 1, 'increase')} 
                                                        style={{ cursor: 'pointer', padding: '0 10px', color: loadingItems[item.menuitem.id] ? 'grey' : 'black' }}
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
                    <div className="col-md-4 offset-md-8">
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td>Bonus: <p>{(bonusEarned - bonusUsed).toFixed(2)}</p></td>
                                    <td>
                                        <input 
                                            type="number" 
                                            value={bonusUsed || ''} 
                                            onChange={e => {
                                                const inputBonus = e.target.value === '' 
                                                    ? '' 
                                                    : Math.min(Number(e.target.value), bonusEarned, subtotal);
                                                setBonusUsed(inputBonus);
                                            }} 
                                            min="0" 
                                            max={Math.min(bonusEarned, subtotal)} 
                                            className="form-control" 
                                        />
                                        <label>
                                            <input 
                                                type="checkbox" 
                                                checked={bonusUsed === Math.min(bonusEarned, subtotal)} 
                                                onChange={() => {
                                                    const maxBonusAllowed = Math.min(bonusEarned, subtotal);
                                                    setBonusUsed(bonusUsed === maxBonusAllowed ? 0 : maxBonusAllowed);
                                                }} 
                                            /> Use all bonus
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Tip</td>
                                    <td>
                                        <input 
                                            type="number" 
                                            value={tip || ''} 
                                            onChange={e => setTip(Math.max(0, Number(e.target.value)))} 
                                            min="0" 
                                            className="form-control" 
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Order Total</td>
                                    <td>${total.toFixed(2)}</td>
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
