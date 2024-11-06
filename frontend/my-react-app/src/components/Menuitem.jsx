import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MyNavbar from './MyNavbar';
import MyFooter from './MyFooter';
import { FaStar } from "react-icons/fa";


// Helper function to retrieve the token from cookies
const getTokenFromCookies = () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('authToken='));
    return token ? token.split('=')[1].trim() : null;
};

const Menuitem = () => {
  const { id } = useParams();
  const [menuItem, setMenuItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchMenuItemAndReviews = async () => {
      try {
        const menuItemResponse = await fetch(`http://localhost:8000/api/menu-items/${id}`);
        if (!menuItemResponse.ok) throw new Error('Failed to fetch menu item');
        const menuItemData = await menuItemResponse.json();

        const reviewsResponse = await fetch(`http://localhost:8000/api/menu-items/${id}/reviews`);
        if (!reviewsResponse.ok) throw new Error('Failed to fetch reviews');
        const reviewsData = await reviewsResponse.json();

        setMenuItem(menuItemData);
        setReviews(reviewsData.results);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItemAndReviews();
  }, [id]);

  const updateQuantity = (action) => {
    setQuantity(prevQuantity => action === 'increase' ? prevQuantity + 1 : Math.max(1, prevQuantity - 1));
  };

  const handleAddToCart = async () => {
    const authToken = getTokenFromCookies();
    if (!authToken) {
      console.error('No auth token found');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/cart/menu-items', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          menuitem_id: menuItem.id,
          quantity: quantity,
        }),
      });

      if (!response.ok) throw new Error(`Failed to add item to cart: ${await response.text()}`);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar key={index} className={index < rating ? 'text-warning' : 'text-muted'} />
    ));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const authToken = getTokenFromCookies();
    if (!authToken) {
      console.error('No auth token found');
      return;
    }

    const reviewData = {
        rating: rating,
        comment: message,
        menu_item: id,
    };

    try {
      const response = await fetch(`http://localhost:8000/api/menu-items/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) throw new Error('Failed to submit review');

      const newReview = await response.json();
      setReviews(prevReviews => [...prevReviews, newReview]);
      setMessage('');
      setRating(0);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <MyNavbar />
      <div className="container-fluid p-5  orders">
        <h1 className="p-5 text-center text-danger">SINGLE MENU ITEM</h1>
      </div>
      
      <div className="container py-5 my-5">
        {menuItem && (
          <div className="row">
            <div className="offset-lg-1 col-lg-5 col-md-6 mb-4">
              <img className="w-100 rounded" src={menuItem.image} alt={menuItem.title} />
            </div>
            <div className="col-lg-5 col-md-6">
              <h3 className="fw-bold mb-3">{menuItem.title.toUpperCase()}</h3>
              <p>{menuItem.description}</p>
              <h4 className="fw-bold text-success">${menuItem.price}</h4>
              <div className="quantity-controls d-flex align-items-center my-3">
                <span className="fw-bold me-2">Quantity:</span>
                <span
                    onClick={() => updateQuantity('decrease')} 
                    style={{ cursor: 'pointer', padding: '0 10px', color: menuItem.quantity <= 1 ? 'grey' : 'black' }}
                    disabled={quantity <= 1}
                >-</span>
                <span>{quantity}</span>
                <span onClick={() => updateQuantity('increase')}
                  style={{ cursor: 'pointer', padding: '0 10px', color: menuItem.quantity <= 1 ? 'grey' : 'black' }}
                >+</span>
              </div>
              <button className="btn btn-primary mt-3 w-100" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          </div>
        )}

        <div className="mt-5">
          <h3 className="mb-4">Product Description</h3>
          <p className="text-muted">{menuItem?.description || "No description available."}</p>
          
          <h3 className="my-4">Customer Reviews</h3>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="card mb-3">
                <div className="card-body">
                  <h4 className="mb-2">{review.user.username}</h4>
                  <div className="mb-3">{renderStars(review.rating)}</div>
                  <p>{review.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
          
          <h4 className="mt-5">Add a Review</h4>
          <p className="d-inline">Rate this product *</p>
          {[1, 2, 3, 4, 5].map(star => (
            <FaStar
              key={star}
              onClick={() => setRating(star)}
              className={star <= rating ? 'text-warning' : 'text-muted'}
              style={{ cursor: 'pointer', fontSize: '20px' }}
            />
          ))}
          <form onSubmit={handleReviewSubmit}>
            <div className="form-group mt-3">
              <label htmlFor="message">Your Review *</label>
              <textarea
                id="message"
                className="form-control"
                rows="3"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Write your review here"                
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary mt-3">Submit Review</button>
          </form>
        </div>
      </div>
      <MyFooter />
    </>
  );
};

export default Menuitem;
