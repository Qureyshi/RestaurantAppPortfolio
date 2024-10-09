import React from 'react';
// import './Menu.css'; Make sure to include your CSS styles



const reservations = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    date: "2024-10-10",
    time: "7:00 PM",
    guests: 4,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    date: "2024-10-12",
    time: "8:00 PM",
    guests: 2,
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    date: "2024-10-15",
    time: "6:30 PM",
    guests: 3,
  },
  {
    id: 4,
    name: "Bob Brown",
    email: "bob.brown@example.com",
    date: "2024-10-16",
    time: "5:00 PM",
    guests: 5,
  },
  {
    id: 5,
    name: "Charlie Davis",
    email: "charlie.davis@example.com",
    date: "2024-10-18",
    time: "9:00 PM",
    guests: 2,
  },
  {
    id: 6,
    name: "Diana Evans",
    email: "diana.evans@example.com",
    date: "2024-10-20",
    time: "7:30 PM",
    guests: 4,
  },
  {
    id: 7,
    name: "Ethan Foster",
    email: "ethan.foster@example.com",
    date: "2024-10-22",
    time: "8:15 PM",
    guests: 6,
  },
  {
    id: 8,
    name: "Fiona Garcia",
    email: "fiona.garcia@example.com",
    date: "2024-10-25",
    time: "5:45 PM",
    guests: 3,
  },
  {
    id: 9,
    name: "George Harris",
    email: "george.harris@example.com",
    date: "2024-10-27",
    time: "6:00 PM",
    guests: 2,
  },
  {
    id: 10,
    name: "Hannah Ivers",
    email: "hannah.ivers@example.com",
    date: "2024-10-30",
    time: "7:15 PM",
    guests: 5,
  },
];




const Reservationlist = () => {
  // Example reservations JSON data


  return (
    <>
    <div className='bg-light shadow-lg p-4'> 
      <h1>Reservations</h1>
    </div>
    <div className="container mt-5">
      <table className='table rounded-3'>
        <thead>
          <tr>
            <th className='p-4'>#</th>
            <th className='p-4'>Name</th>
            <th className='p-4'>Email</th>
            <th className='p-4'>Date</th>
            <th className='p-4'>Time</th>
            <th className='p-4'>Guests</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length > 0 ? (
            reservations.map((reservation, index) => (
              <tr key={reservation.id}>
                <td className='p-4'>{index + 1}</td>
                <td className='p-4'>{reservation.name}</td>
                <td className='p-4'>{reservation.email}</td>
                <td className='p-4'>{reservation.date}</td>
                <td className='p-4'>{reservation.time}</td>
                <td className='p-4'>{reservation.guests}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No reservations found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default Reservationlist;