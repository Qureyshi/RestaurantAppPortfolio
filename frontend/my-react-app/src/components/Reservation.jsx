import React, { useState } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import MyFooter from './MyFooter';
import MyNavbar from './MyNavbar';

const Reservation = () => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    people: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    comments: '',
    subscribe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('authToken='))
      ?.split('=')[1];

    if (!authToken) {
      console.error('Authorization token is missing.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/reservations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${authToken}`, // Use `Bearer` if that's the required format
        },
        body: JSON.stringify({
          date: formData.date,
          time: formData.time,
          phone_number: formData.phone,
          number_of_guests: formData.people,
          message: formData.comments,
        }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result);
      // Handle success, e.g., show a success message or redirect

    } catch (error) {
      console.error('Error:', error);
      // Handle error, e.g., show an error message to the user
    }
  };

  return (
    <>
      <MyNavbar />
      <div className='container-fluid p-5 orders'>
        <div className='p-5 text-center text-danger'>
          <h1>Reservation</h1>
        </div>
      </div>
      <div className='container py-5'>
        <div className="row gy-5">
          <div className="col-xl-6 d-flex align-items-center">
            <div className="get-in-touch">
              <h1 className='fw-bold'>GET IN TOUCH</h1>
              <p className="my-4">Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore of magna aliqua. Ut enim ad minim veniam, made</p>
              <div className="d-flex align-items-center">
                <div className="p-3">
                  <h3 className='fw-bold'>Contact</h3>
                  <p>+012 3455 862 69</p>
                </div>
                <div className="p-3">
                  <h3 className='fw-bold'>Email</h3>
                  <p>companyInfo@gmail.com</p>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="p-3">
                  <h3 className='fw-bold'>Address</h3>
                  <p>Jackpark, Ghana</p>
                </div>
                <div className="p-3">
                  <h3 className='fw-bold'>Follow</h3>
                  <ul className="list-inline">
                    <li className="list-inline-item"><a href="#"><FaFacebookF /></a></li>
                    <li className="list-inline-item"><a href="#"><FaTwitter /></a></li>
                    <li className="list-inline-item"><a href="#"><FaInstagram /></a></li>
                    <li className="list-inline-item"><a href="#"><FaYoutube /></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6 bg-light p-5 rounded">
            <div className="reservation-form">
              <div className="contact-form style2">
                <h2 className='my-5'>Create An <span className="text-danger">Reservation</span> </h2>
                <form className="row" onSubmit={handleSubmit}>
                  <div className="col-md-6 mb-4">
                    <label className="mb-2 d-block" htmlFor="date">Select Date*</label>
                    <input className='form-control' id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-4">
                    <label className="mb-2 d-block" htmlFor="time">Select Time*</label>
                    <input className='form-control' id="time" name="time" type="time" value={formData.time} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-4">
                    <label className="mb-2 d-block" htmlFor="phone">Give Phone Number*</label>
                    <input className='form-control' id="phone" name="phone" type="number" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-4">
                    <label className="mb-2 d-block" htmlFor="people">Number of Guests*</label>
                    <input className='form-control' id="people" name="people" type="number" placeholder="Guests" value={formData.people} onChange={handleChange} required />
                  </div>
                  <div className="col-12 mb-4">
                    <textarea id="comments" name="comments" className="form-control" placeholder="Write your message here..." rows="5" value={formData.comments} onChange={handleChange}></textarea>
                  </div>
                  <div className="col-12 form-group mb-5">
                    <button className="btn btn-danger btn-md btn-block" type="submit">BOOK A TABLE</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MyFooter />
    </>
  );
};

export default Reservation;
