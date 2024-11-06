import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const MyFooter = () => {
  return (
    <footer className="bg-dark text-white py-4 ">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <h5>About Us</h5>
            <p>
              We are a leading company providing the best solutions to our clients.
            </p>
          </div>
          <div className="col-md-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#home" className="text-white">Home</a></li>
              <li><a href="#about" className="text-white">About</a></li>
              <li><a href="#services" className="text-white">Services</a></li>
              <li><a href="#contact" className="text-white">Contact</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Our Menu</h5>
            <ul className="list-unstyled">
              <li><a href="#burger-king" className="text-white">BurgerKing</a></li>
              <li><a href="#pizza" className="text-white">Pizza</a></li>
              <li><a href="#fresh-food" className="text-white">Fresh Food</a></li>
              <li><a href="#vegetable" className="text-white">Vegetable</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Contact Us</h5>
            <p>Email: info@myapp.com</p>
            <p>Phone: +123 456 7890</p>
            <p>Address: 1234 Street Name, City, Country</p>
          </div>
        </div>
        <div className="text-center mt-3">
          <p>&copy; 2024 MyApp. All Rights Reserved.</p>
        </div>
      </div>
    </footer>

  );
};

export default MyFooter;
