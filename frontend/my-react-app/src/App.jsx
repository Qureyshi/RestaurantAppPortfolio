import { useState } from 'react'
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
import Orders from './components/Orders.jsx';
 
 
 



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/reservation" element={<Reservation />} />
      <Route path="adminlogin" element={<Admin />} />
      <Route path="/loginform" element={<LoginForm />} />
      <Route path="/register" element={<Register />} />
      <Route path="/orders" element={<Orders />} />

      <Route path="admin" element={<Layout />}>
        <Route index element={<Navigate to="dashboard" />} /> {/* Redirect to dashboard */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="menu" element={<MenuManager />} />
        <Route path="orders" element={<Orderlist />} />   
        <Route path="reservations" element={<Reservationlist />} />    
        <Route path="inventory" element={<Inventory />} />
      </Route>
      
    </Route>
  )
);


function App() {
  return (
 
    <>
      <RouterProvider router={router} />

    </>
  );
}

export default App;