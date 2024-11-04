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
  const { id } = useParams();  // Extracts the `id` from the URL
  const [menuItem, setMenuItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/menu-items/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch menu item');
        }
        const data = await response.json();
        setMenuItem(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItem();
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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add item to cart: ${errorText}`);
      }

      //alert('Item added to cart successfully!');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;



  const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <FaStar key={index} className={index < rating ? 'text-warning' : 'text-muted'} />
        ));
   };
   
   const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Rating:", rating);
    console.log("Message:", message);
    // Add logic to save or send the review
    alert("Review submitted!");
    setMessage('');
    setRating(0);
};




  return (
    <>
      <MyNavbar />
      <div className="container-fluid p-5 orders">
        <div className="p-5 text-center text-danger">
          <h1 className="font-weight-bold">SINGLE MENU</h1>
        </div>
      </div>
      
      <div className="container py-5 my-5">
        
        {menuItem ? (
        <div className="row">
          <div className='offset-lg-1 col-lg-5    col-md-6'>
           <img className='w-100' src={menuItem.image} alt="" />
          </div>
          <div className='col-lg-5  col-md-6'>
            <h3 className='fw-bold'>{menuItem.title.toUpperCase()}</h3>
            <p>There are many variations of passages of Lorem Ipsum available, but majority have suffered teration in some form, by injected humour, or randomised</p>
            <h4 className='fw-bold' >${menuItem.price}</h4>
            <div className="quantity-controls">
              <span className='fw-bold'>Quantity:</span>
              <button 
                className="btn btn-secondary mx-2" 
                onClick={() => updateQuantity('decrease')}
                disabled={quantity <= 1}
              >-</button>
              <span>{quantity}</span>
              <button 
                className="btn btn-secondary mx-2" 
                onClick={() => updateQuantity('increase')}
              >+</button>
            </div>
            <button 
              className="btn btn-success mt-3" 
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
        ) : (
          <p>Menu item not found.</p>
        )}
        <div className='mt-5'>
            <div>
                <button className="btn btn-success" onClick={() => setActiveTab('description')}>
                    Description
                </button>
                <button className="btn btn-success" onClick={() => setActiveTab('review')}>
                    Review
                </button>
            </div>
            <div>
                {activeTab === 'description' ? (
                    <div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div>
                                    <h3>Experience is over the world visit</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vulputate vestibulum Phasellus rhoncus, dolor eget viverra pretium, dolor Numquam odit accusantium odit aut commodi et. Nostrum est atque ut dolorum. Et sequi aut atque doloribus qui. Iure amet in voluptate reiciendis. Perspiciatis consequatur aperiam repellendus velit quia est minima. tellus aliquet nunc vitae ultricies erat elit eu lacus. Vestibulum non justo consectetur, cursus ante, tincidunt sapien. Nulla quis diam sit amet turpis interdum accumsan quis necenim. Vivamus faucibus ex sed nibh egestas elementum. Mauris et bibendum dui. Aenean consequat pulvinar luctus</p>
                                    <h3 className="mb-0 mt-5">More Details</h3>
                                    <div className="description-list-items d-flex">
                                        <ul className="description-list">
                                            <li><i className="fal fa-check"></i><span>Lorem Ipsum is simply dummy text of the printing and typesetting industry</span></li>
                                            <li><i className="fal fa-check"></i><span>Lorem Ipsum has been the 's standard dummy text. Lorem Ipsumum is simply dummy text.</span></li>
                                            <li><i className="fal fa-check"></i><span>Type here your detail one by one li more add</span></li>
                                            <li><i className="fal fa-check"></i><span>Has been the industry's standard dummy text ever since. Lorem Ips</span></li>
                                        </ul>
                                        <ul className="description-list">
                                            <li><i className="fal fa-check"></i><span>Lorem Ipsum generators on the tend to repeat.</span></li>
                                            <li><i className="fal fa-check"></i><span>If you are going to use a passage.</span></li>
                                            <li><i className="fal fa-check"></i><span>Lorem Ipsum generators on the tend to repeat.</span></li>
                                            <li><i className="fal fa-check"></i><span>Lorem Ipsum generators on the tend to repeat.</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (

                <div>    
                    <div className="my-4">
                        <div className="card mb-3">
                            <div className="card-body">
                                <h4 className="mb-3">John Doe</h4> 
                                <h6>27June 2024 at 5.44pm</h6>
                                <div className='mb-3'>{renderStars(2)}</div>
                                <p>This place is fantastic! The food was delicious and the service was excellent. Highly recommend!</p>
                            </div>
                        </div>
                    </div>
                    <div className="my-4">
                        <div className="card mb-3">
                            <div className="card-body">
                                <h4 className="mb-3">John Doe</h4> 
                                <h6>27June 2024 at 5.44pm</h6>
                                <div className='mb-3'>{renderStars(4)}</div>
                                <p>This place is fantastic! The food was delicious and the service was excellent. Highly recommend!</p>
                            </div>
                        </div>
                    </div>
                <div>
                     <h4>Add a review</h4>
                     <p className='d-inline'>Rate this product? *</p>
                     {[1, 2, 3, 4, 5].map((star) => (
                         <FaStar
                             key={star}
                             onClick={() => setRating(star)}
                             className={star <= rating ? 'text-warning' : 'text-muted'}
                             style={{ cursor: 'pointer', fontSize: '20px' }}
                         />
                     ))}
                    <form onSubmit={handleSubmit}>
                    <div className="form-group mt-3">
                        <label htmlFor="message">Your Review *</label>
                        <textarea
                            id="message"
                            className="form-control"
                            rows="3"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write your review here"
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">Submit Review</button>
                    </form>
                
                     
                    </div>
                </div>                         

                )}
            </div>
        </div>


      </div>
      <MyFooter />
    </>
  );
};

export default Menuitem;
