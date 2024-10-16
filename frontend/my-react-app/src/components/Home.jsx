import React from 'react';
import MyFooter from './MyFooter';
import MyNavbar from './MyNavbar';

const Home = () => {
  return (
    <>
      <MyNavbar />
      
      <header className="bg-dark  text-white text-center py-5" style={{backgroundImage: 'url("https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")', backgroundSize: 'cover'}}>
        <div className="container py-5">
          <h1 className="display-4 mt-5">Welcome to Our Restaurant</h1>
          <p className="lead">Experience the finest dining in the city</p>
          <a href="#menu" className="btn btn-danger m-4">View Our Menu</a>
        </div>
      </header>

  

      <section className="py-5 bg-dark text-white text-center">
      <div className="container">
        <h2 className="mb-5">Discover Our Menu</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="card bg-dark text-white">
              <img src="https://images.pexels.com/photos/660282/pexels-photo-660282.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="card-img-top" alt="Breakfast" />
              <div className="card-body">
                <h5>Breakfast</h5>
                <ul className="list-unstyled">
                  <li>Breakfast Casserole - $20</li>
                  <li>Greek Yogurt - $15</li>
                  <li>Cottage Cheese - $18</li>
                </ul>
                <a href="#" className="btn btn-danger mt-3">Make Order</a>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-dark text-white">
              <img src="https://images.pexels.com/photos/660282/pexels-photo-660282.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="card-img-top" alt="Lunch" />
              <div className="card-body">
                <h5>Lunch</h5>
                <ul className="list-unstyled">
                  <li>Buffalo Chicken Grain - $20</li>
                  <li>Creamy Rotisserie - $15</li>
                  <li>Veggie Mason - $18</li>
                </ul>
                <a href="#" className="btn btn-danger mt-3">Make Order</a>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-dark text-white">
              <img src="https://images.pexels.com/photos/660282/pexels-photo-660282.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="card-img-top" alt="Dinner" />
              <div className="card-body">
                <h5>Dinner</h5>
                <ul className="list-unstyled">
                  <li>Fried Chicken - $20</li>
                  <li>Pizza - $15</li>
                  <li>Tossed Salad - $18</li>
                </ul>
                <a href="#" className="btn btn-danger mt-3">Make Order</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>








    <section className="py-5 text-center">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <div className="feature-item">
              <img src="https://validthemes.net/site-template/foodu/assets/img/icon/6.png" alt="Best Quality Food" />
              <h5 className="mt-3">Best Quality Food</h5>
              <p>We serve only the best quality ingredients, freshly made every day.</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="feature-item">
              <img src="https://validthemes.net/site-template/foodu/assets/img/icon/7.png" alt="Home Delivery" />
              <h5 className="mt-3">Home Delivery</h5>
              <p>Enjoy your meals from the comfort of your home with our fast delivery.</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="feature-item">
              <img src="https://validthemes.net/site-template/foodu/assets/img/icon/8.png" alt="Real Taste" />
              <h5 className="mt-3">Real Taste</h5>
              <p>Our dishes offer the true taste of gourmet flavors you'll love.</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="feature-item">
              <img src="https://validthemes.net/site-template/foodu/assets/img/icon/9.png" alt="Traditional Food" />
              <h5 className="mt-3">Traditional Food</h5>
              <p>We bring authentic recipes from around the world straight to your table.</p>
            </div>
          </div>
        </div>
      </div>
    </section>








    <section className="py-5 bg-light d-flex align-items-center" style={{ minHeight: '300px' }}>
      <div className="container d-flex justify-content-between align-items-center">
        <div>
          <h1 className="display-4">Experience of Real Recipes Taste</h1>
          <div className="d-flex mt-4">
            <div className="me-5">
              <h2>98K</h2>
              <p>Daily Orders</p>
            </div>
            <div>
              <h2>5+</h2>
              <p>Menu & Dish</p>
            </div>
          </div>
        </div>
        <div>
          <img src="https://images.pexels.com/photos/2159065/pexels-photo-2159065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Salmon Dish" className="img-fluid" />
        </div>
      </div>
    </section>







      <MyFooter />
    </>
  );
};

export default Home;
