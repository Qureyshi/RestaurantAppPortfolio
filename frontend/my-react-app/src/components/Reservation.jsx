import React, { useEffect, useState } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import MyFooter from './MyFooter';
import MyNavbar from './MyNavbar';
import './Reservation.css'; // Optional: Import custom CSS for additional styling

const Reservation = () => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    people: '',
    phone: '',
    comments: '',
  });
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const response = await fetch('http://localhost:8000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${authToken}`,
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
      window.location.href = '/'; // Redirect to home page on success

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchReservations = async () => {
    const authToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('authToken='))
      ?.split('=')[1];

    if (!authToken) {
      console.error('Authorization token is missing.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/reservations', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();      
      setReservations(data.results || []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <>
      <MyNavbar />
      <div className='container-fluid p-5 reservation-header text-center text-white bg-danger'>
        <h1>Make a Reservation</h1>
      </div>
      <div className='container py-5'>
        <div className="row gy-5">
          <div className="col-lg-6 bg-light p-5 rounded">
            <h2 className='my-5'>Create a <span className="text-danger">Reservation</span></h2>
            <form className="reservation-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="date">Select Date*</label>
                  <input className='form-control' id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="time">Select Time*</label>
                  <input className='form-control' id="time" name="time" type="time" value={formData.time} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="phone">Phone Number*</label>
                  <input className='form-control' id="phone" name="phone" type="tel" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="people">Number of Guests*</label>
                  <input className='form-control' id="people" name="people" type="number" placeholder="Guests" value={formData.people} onChange={handleChange} required />
                </div>
                <div className="form-group col-12">
                  <label htmlFor="comments">Comments</label>
                  <textarea id="comments" name="comments" className="form-control" placeholder="Write your message here..." rows="5" value={formData.comments} onChange={handleChange}></textarea>
                </div>
                <div className="form-group col-12">
                  <button className="btn btn-danger btn-md btn-block" type="submit">Book a Table</button>
                </div>
              </div>
            </form>
          </div>

          {/* Add margin-bottom for spacing between sections */}
          <div className="col-lg-6 mt-5">
            <h2 className='fw-bold'>Your Reservations</h2>
            {loading ? (
              <div>Loading your reservations...</div>
            ) : (
              reservations.length > 0 ? (
                <ul className="reservation-list">
                  {reservations.map((reservation, index) => (
                    <li key={index} className="reservation-item">
                      <p><strong>Date:</strong> {reservation.date}</p>
                      <p><strong>Time:</strong> {reservation.time}</p>
                      <p><strong>Guests:</strong> {reservation.number_of_guests}</p>
                      <p><strong>Phone:</strong> {reservation.phone_number}</p>
                      <p><strong>Comments:</strong> {reservation.message}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>You have no reservations.</p>
              )
            )}
          </div>
        </div>
      </div>

      <MyFooter />
    </>
  );
};

export default Reservation;
