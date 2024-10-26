import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AppLogin from './components/Pages/AppLogin';
import AppScan from './components/Pages/AppScan';
import AppInventario from './components/Pages/AppInventario';
import AppVentas from './components/Pages/AppVentas';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLogin />,
  },
  {
    path: '/dashboard',
    element: <App />,
  },
  {
    path: '/scan',
    element: <AppScan />,
  },
  {
    path: '/inventario',
    element: <AppInventario />,
  },
  {
    path: '/ventas',
    element: <AppVentas />,
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router} />);
    

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
