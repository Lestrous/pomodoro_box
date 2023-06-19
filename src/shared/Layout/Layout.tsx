import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../Header';
import { Flip, ToastContainer } from 'react-toastify';

export function Layout() {
  return (
    <div>
      <ToastContainer
        position={'top-right'}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        theme={'light'}
        transition={Flip}
      />
      <Header />

      <Outlet />
    </div>
  );
}
