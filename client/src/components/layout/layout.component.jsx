import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/header.component';

const Layout = () => {
    return (
      <>
        <Header />
        <Outlet />
      </>
    );
  };

export default Layout;