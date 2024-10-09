import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Content from './Content';
import { Outlet } from 'react-router-dom';
// import './Menu.css'; Make sure to include your CSS styles


const Layout = () => {
  return (
    <>
        <div className='row vh-100'>
            <Sidebar />
            <Content />    
        </div> 
    </>
  );
};

export default Layout;