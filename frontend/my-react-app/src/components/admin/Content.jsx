import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
// import './Menu.css'; Make sure to include your CSS styles


const Content = () => {
  return (
    <>
        <div className='col-10 p-0 bg-light'>
            <Outlet />
        </div>
       
    </>
  );
};

export default Content;