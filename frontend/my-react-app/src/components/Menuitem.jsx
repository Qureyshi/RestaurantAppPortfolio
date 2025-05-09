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
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const mockMenuItem = {
      id: id,
      title: 'Grilled Chicken Salad',
      price: 12.99,
      image: '/images/burger1.jpg',
    };

    const mockReviews = [
      {
        user: { username: 'john_doe' },
        rating: 4,
        comment: 'Delicious and healthy!',
      },
      {
        user: { username: 'jane_smith' },
        rating: 5,
        comment: 'One of the best salads I’ve had.',
      },
    ];

    // Simulate loading delay
    setTimeout(() => {
      setMenuItem(mockMenuItem);
      setReviews(mockReviews);
      setLoading(false);
    }, 500); // Optional: mimic async call
  }, [id]);

  const updateQuantity = (action) => {
    setQuantity(prevQuantity => action === 'increase' ? prevQuantity + 1 : Math.max(1, prevQuantity - 1));
  };

  const handleAddToCart = () => {
    const authToken = getTokenFromCookies();
    if (!authToken) {
      console.error('No auth token found');
      return;
    }

    // Mock the add to cart action
    console.log(`Added ${quantity} of item ${menuItem.title} to cart`);
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

    // Mock the review submission
    console.log(`Submitted review:`, reviewData);

    setReviews(prevReviews => [
      ...prevReviews,
      { user: { username: 'current_user' }, rating, comment: message },
    ]);
    setMessage('');
    setRating(0);
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
        
        <div className="mt-5">  
          {menuItem && (
            <div className="row">
              <div className="offset-lg-1 col-lg-5 col-md-6 mb-4">
                <div
                  className="w-100 rounded"
                  style={{
                    height: '400px',
                    backgroundImage: `url(${menuItem.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  alt={menuItem.title}
                />
              </div>
              <div className="col-lg-5 col-md-6">
                <h3 className="fw-bold my-3">{menuItem.title.toUpperCase()}</h3>
                <p>There are many variations of passages of Lorem Ipsum available, but majority have suffered alteration in some form, by injected humour, or randomised</p>
                <h4 className="fw-bold text-danger">${menuItem.price}</h4>
                <div className="quantity-controls d-flex align-items-center my-3">
                  <span className="fw-bold me-2">Quantity:</span>
                  <span
                    onClick={() => updateQuantity('decrease')} 
                    style={{ cursor: 'pointer', padding: '0 10px', color: quantity <= 1 ? 'grey' : 'black' }}
                    disabled={quantity <= 1}
                  >-</span>
                  <span>{quantity}</span>
                  <span onClick={() => updateQuantity('increase')}
                    style={{ cursor: 'pointer', padding: '0 10px', color: quantity <= 1 ? 'grey' : 'black' }}
                  >+</span>
                </div>
                <button className="btn btn-danger my-3 w-100" onClick={handleAddToCart}>
                  Add to Cart
                </button>
              </div>
            </div>
          )}

          <div className='row'>
            <div className='offset-lg-1 col-lg-10'>
              <button className="btn btn-danger me-2" onClick={() => setActiveTab('description')}>
                Description
              </button>
              <button className="btn btn-danger" onClick={() => setActiveTab('review')}>
                Review
              </button>
            </div>
          </div>
        
          {activeTab === 'description' ? (
            <div>
              <div className="row">
                <div className="offset-lg-1 col-lg-10">
                  <div className='mt-3'>
                    <h3>Experience is over the world visit</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vulputate vestibulum. Phasellus rhoncus, dolor eget viverra pretium, dolor Numquam odit accusantium odit aut commodi et.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='row'>
              <div className='offset-lg-1 col-lg-10'>
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
                  <button type="submit" className="btn btn-danger mt-3">Submit Review</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <MyFooter />
    </>
  );
};

export default Menuitem;
