import React, { useEffect } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Routes,
  Navigate
} from "react-router-dom";


import AOS from 'aos';
import 'aos/dist/aos.css';

import Menu from './components/Menu.jsx'
import Layout from './components/admin/Layout.jsx'
import Dashboard from './components/admin/Dashboard.jsx'
import MenuManager from './components/admin/MenuManager.jsx';
import Orderlist from './components/admin/Orderlist.jsx';
import Cart from './components/Cart.jsx';
import Reservation from './components/Reservation.jsx';
import Reservationlist from './components/admin/ReservationList.jsx';
import Inventory from './components/admin/Inventory.jsx';
import Admin from './components/admin/Admin.jsx';
import LoginForm from './components/LoginForm.jsx';
import Register from './components/Register.jsx';
import Home from './components/Home.jsx';
import OrderandReservation from './components/Ordersandreservations.jsx';
import Menuitem from './components/Menuitem.jsx';
import MyNavbar from './components/MyNavbar.jsx';
import MyFooter from './components/MyFooter.jsx';
 



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/menuitem/:id" element={<Menuitem />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/reservation" element={<Reservation />} />
      <Route path="adminlogin" element={<Admin />} />
      <Route path="/loginform" element={<LoginForm />} />
      <Route path="/register" element={<Register />} />
      <Route path="/orders" element={<OrderandReservation />} />

      <Route path="admin" element={<Layout />}>
        <Route index element={<Navigate to="dashboard" />} /> {/* Redirect to dashboard */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="menu" element={<MenuManager />} />
        <Route path="orderlist" element={<Orderlist />} />   
        <Route path="reservations" element={<Reservationlist />} />    
        <Route path="inventory" element={<Inventory />} />
      </Route>
      
    </Route>
  )
);


function App() {

    useEffect(() => {
      AOS.init({ duration: 1000 }); // 1000ms = 1s
    }, []);
  



  return (
 
    <>
        
      <RouterProvider router={router} />

    </>
  );
}

export default App;