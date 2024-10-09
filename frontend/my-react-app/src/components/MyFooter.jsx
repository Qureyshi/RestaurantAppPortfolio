import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const MyFooter = () => {
  return (
    <footer class="bg-dark text-white py-4">
      <div class="container">
        <div class="row">
          <div class="col-md-3">
            <h5>About Us</h5>
            <p>
              We are a leading company providing the best solutions to our clients.
            </p>
          </div>
          <div class="col-md-3">
            <h5>Quick Links</h5>
            <ul class="list-unstyled">
              <li><a href="#home" class="text-white">Home</a></li>
              <li><a href="#about" class="text-white">About</a></li>
              <li><a href="#services" class="text-white">Services</a></li>
              <li><a href="#contact" class="text-white">Contact</a></li>
            </ul>
          </div>
          <div class="col-md-3">
            <h5>Our Menu</h5>
            <ul class="list-unstyled">
              <li><a href="#burger-king" class="text-white">BurgerKing</a></li>
              <li><a href="#pizza" class="text-white">Pizza</a></li>
              <li><a href="#fresh-food" class="text-white">Fresh Food</a></li>
              <li><a href="#vegetable" class="text-white">Vegetable</a></li>
            </ul>
          </div>
          <div class="col-md-3">
            <h5>Contact Us</h5>
            <p>Email: info@myapp.com</p>
            <p>Phone: +123 456 7890</p>
            <p>Address: 1234 Street Name, City, Country</p>
          </div>
        </div>
        <div class="text-center mt-3">
          <p>&copy; 2024 MyApp. All Rights Reserved.</p>
        </div>
      </div>
    </footer>

  );
};

export default MyFooter;
