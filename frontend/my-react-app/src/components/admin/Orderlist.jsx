import React, { useState } from 'react';
import './Admin.css'; 

const orderData = [
  {
    "orderId": "#7771121",
    "date": "15 April 2023 09:15 AM",
    "customerName": "Marry Turner",
    "location": "101 Ocean Drive Miami",
    "amount": "$95.30",
    "statusOrder": "DELIVERED"
  },
  {
    "orderId": "#7771122",
    "date": "15 April 2023 09:45 AM",
    "customerName": "Henry Watson",
    "location": "202 Sunset Boulevard Los Angeles",
    "amount": "$58.25",
    "statusOrder": "PENDING"
  },
  {
    "orderId": "#7771123",
    "date": "15 April 2023 10:00 AM",
    "customerName": "Isabella Rossi",
    "location": "305 Central Park NY",
    "amount": "$73.85",
    "statusOrder": "CANCELED"
  },
  {
    "orderId": "#7771124",
    "date": "15 April 2023 10:30 AM",
    "customerName": "Michael Johnson",
    "location": "456 Elm Street Chicago",
    "amount": "$88.70",
    "statusOrder": "PENDING"
  },
  {
    "orderId": "#7771122",
    "date": "15 April 2023 09:45 AM",
    "customerName": "Henry Watson",
    "location": "202 Sunset Boulevard Los Angeles",
    "amount": "$58.25",
    "statusOrder": "PENDING"
  },
  {
    "orderId": "#7771123",
    "date": "15 April 2023 10:00 AM",
    "customerName": "Isabella Rossi",
    "location": "305 Central Park NY",
    "amount": "$73.85",
    "statusOrder": "CANCELED"
  },
  {
    "orderId": "#7771124",
    "date": "15 April 2023 10:30 AM",
    "customerName": "Michael Johnson",
    "location": "456 Elm Street Chicago",
    "amount": "$88.70",
    "statusOrder": "PENDING"
  },
    {
    "orderId": "#7771122",
    "date": "15 April 2023 09:45 AM",
    "customerName": "Henry Watson",
    "location": "202 Sunset Boulevard Los Angeles",
    "amount": "$58.25",
    "statusOrder": "PENDING"
  },
  {
    "orderId": "#7771123",
    "date": "15 April 2023 10:00 AM",
    "customerName": "Isabella Rossi",
    "location": "305 Central Park NY",
    "amount": "$73.85",
    "statusOrder": "CANCELED"
  },
  {
    "orderId": "#7771124",
    "date": "15 April 2023 10:30 AM",
    "customerName": "Michael Johnson",
    "location": "456 Elm Street Chicago",
    "amount": "$88.70",
    "statusOrder": "PENDING"
  },
  {
    "orderId": "#7771125",
    "date": "15 April 2023 11:00 AM",
    "customerName": "Sophie Bennett",
    "location": "789 River Road Boston",
    "amount": "$122.40",
    "statusOrder": "DELIVERED"
  },
  {
    "orderId": "#7771126",
    "date": "15 April 2023 11:15 AM",
    "customerName": "Oliver Thompson",
    "location": "987 Maple Avenue Seattle",
    "amount": "$63.90",
    "statusOrder": "PENDING"
  }
]


const Orderlist = () => {
  return (
    <>

    <div className='bg-light shadow-lg p-4'> 
      <h1>Order List</h1>
    </div>
    
    <div class="container mt-5">

        

        <div class="table-responsive">
            <table class="table rounded-3">
                <thead>
                    <tr>
                        <th className='p-4' scope="col">Order ID</th>
                        <th className='p-4' scope="col">Date</th>
                        <th className='p-4' scope="col">Customer Name</th>
                        <th className='p-4' scope="col">Location</th>
                        <th className='p-4' scope="col">Amount</th>
                        <th className='p-4' scope="col">Status Order</th>
                        <th className='p-4' scope="col">Edit</th>
                    </tr>
                </thead>
                <tbody>

                {orderData.map((order)=> (
                  <tr>
                    <td className='p-4'>{order.orderId}</td>
                    <td className='p-4'>{order.date}</td>
                    <td className='p-4'>{order.customerName}</td>
                    <td className='p-4'>{order.location}</td>
                    <td className='p-4'>{order.amount}</td>
                    <td className='p-4'><span className={`status-badge status-${order.statusOrder.toLowerCase()}`}>{order.statusOrder}</span></td>
                    <td className='p-4'>...</td>
                  </tr>
                ))}

                </tbody>
            </table>
        </div>
    </div>
    </>
  );
};

export default Orderlist;