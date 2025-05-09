import React from 'react';
import MyFooter from './MyFooter';
import MyNavbar from './MyNavbar';

const Home = () => {
  return (
    <>
      <MyNavbar />
      
      <header className="bg-dark  text-white  py-5  d-flex justify-content-center align-items-center " 
      style={{
        backgroundImage: `url('images/hero-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh', // Adjust as needed
        
      }}
      
      
      >

        
<div className="container">
  <div className="row">
    <div className="col-12 col-md-6 d-flex flex-column justify-content-center align-items-center text-center text-md-start">
      <div data-aos="fade-left">
        <h4 className="text-danger fw-bold">Serving happiness on a plate</h4>
        <h1 className="fs-1 fs-md-1  fw-bold">Welcome to Our Restaurant</h1>
        <a href="/menu" className="btn btn-danger mt-4">View Our Menu</a>
      </div>
    </div>
    <div className="d-none d-md-block col-md-6 mt-4 mt-md-0 overflow-hidden d-flex justify-content-center align-items-center" data-aos="fade-up">
      <img src="images/chiken.png" alt="Delicious chicken dish" className="img-fluid" />
    </div>
  </div>
</div>

        
      </header>

  
  <div className="container py-5">
    <div className='row g-3'>
      <div className="col-lg-4">
        <div className="bg-success d-flex align-items-center justify-content-center  h-100 py-3" data-aos="zoom-in">
          <div>
            <h4 className='text-center text-white fw-bold'>FRIDAY SPECIAL</h4>
            <h1 className='text-center text-warning fw-bold'> TASTY BURGER</h1>
            <img src="https://foodking-react.vercel.app/assets/img/food/main-food.png" alt="Tasty Burger" className="img-fluid" />
          </div>
        </div>
      </div>
      <div className="col-lg-8">
        <div className='row g-3'>
          <div className="col-lg-6 ">
            <div className="bg-danger h-100 d-flex align-items-center overflow-hidden" data-aos="zoom-in" >
              <img src="https://swigo.dexignzone.com/xhtml/assets/images/adv/pic3.png" alt="" />
              <div>
                <h3 className='text-white fw-bold'>TODAY SPECIAL</h3>
                <h1 className='text-white fw-bold'>NODELS</h1>
                <h2 className='text-warning fw-bold'>60% OFF</h2>
                <a href="" className='btn btn-light'>Add To Cart</a>
              </div>
            </div>
          </div>
          <div className="col-lg-6 ">
            <div className="bg-warning h-100 d-flex align-items-center overflow-hidden" data-aos="zoom-in">
              <img src="images/burger-2.png" alt="" />
              <div>
                <h3 className='text-white fw-bold'>MUSHROOM</h3>
                <h1 className='text-white fw-bold'>BURGER</h1>
                <a href="" className='btn btn-light'>Add To Cart</a>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div>
              <div className="bg-dark position-relative p-5 overflow-hidden" data-aos="zoom-in">

                <h1 className='text-white fw-bold'>35% Offer</h1>
                <h6 className='text-white fw-bold'>FOR LIMITED TIME ONLY</h6>

               <img src="images/pic4.png" alt=""  className='banner-img-4'/>
              </div>
      
            </div>
          </div>
        </div>
      </div>
      


    </div>

  </div>

  <section>
      <div className="">
        <div className="row">
          <div className="col-lg-4 p-5"     style={{ backgroundImage: `url('images/food-bg.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center'}} >
            <p className='text-warning fw-bold'>START PRICE 25$</p>
            <h1 className='text-white fw-bold'>DELICIOUS <br/> HAMBURGER <br/> FRIES</h1>
            <a href="" className='btn btn-danger'>ORDER NOW</a>
          </div>
          <div className="col-lg-4 p-5"     style={{ backgroundImage: `url('images/food-bg-2.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center'}} >
            <p className='text-warning fw-bold'>START PRICE 25$</p>
            <h1 className='text-white fw-bold'>DELICIOUS <br/> HAMBURGER <br/> FRIES</h1>
            <a href="" className='btn btn-danger'>ORDER NOW</a>
          </div>
          <div className="col-lg-4 p-5"     style={{ backgroundImage: `url('images/food-bg-3.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center'}} >
            <p className='text-warning fw-bold'>START PRICE 25$</p>
            <h1 className='text-white fw-bold'>DELICIOUS <br/> HAMBURGER <br/> FRIES</h1>
            <a href="" className='btn btn-danger'>ORDER NOW</a>
          </div>
        
        </div>
      </div>



  </section>





  
  <section className="py-5 bg-light d-flex align-items-center" style={{ minHeight: '300px' }}>
      <div className="container d-flex justify-content-between align-items-center">
        <div data-aos="fade-right">
          <h1 className="display-4">Experience of Real Recipes Taste</h1>
          <div className="d-flex mt-4">
            <div className="me-5">
              <h2>98K</h2>
              <p>Daily Orders</p>
            </div>
            <div>
              <h2>50+</h2>
              <p>Menu & Dish</p>
            </div>
          </div>
        </div>
        <div data-aos="fade-left">
          <img src="https://images.pexels.com/photos/2159065/pexels-photo-2159065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Salmon Dish" className="img-fluid" />
        </div>
      </div>
    </section>


    <div className="bg-dark  text-white  py-5  d-flex justify-content-center align-items-center " 
      style={{
        backgroundImage: `url('images/main-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
       
      }}
        
      
      >
        <div className="container">
          <div className="row">
            <div className="col-6 d-flex justify-content-center align-items-center">
              <div>
              <h4>SAVE 20 %</h4>
              <h2>TODAY'S ASTACKIN DAY</h2>
              <h3 className='mb-4'>grilled chiken$59,00</h3>
              <a href="#menu" className="btn btn-danger">ORDER NOW</a>
              </div>
            </div>
            <div className="col-6">
            <img src="images/grilled.png" alt="" style={{ width: '100%' }} />

            </div>
          </div>
        </div>


      </div>




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

      <MyFooter />
    </>
  );
};

export default Home;
