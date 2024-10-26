import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UilScenery, UilClipboardAlt, UilShoppingCart } from '@iconscout/react-unicons';
import './App.css';

function App() {
  const navigate = useNavigate();

  return (
    <div className="DashboardContainer">
      <h1 className="DashboardTitle">Lazy Inventory Computed on the Fly</h1>
      <div className="ButtonContainer">
        <div className="DashboardCard" onClick={() => navigate('/scan')}>
          <UilScenery size="50" color="#fff" />
          <h2>Escanear y registro de productos</h2>
        </div>
        <div className="DashboardCard" onClick={() => navigate('/inventario')}>
          <UilClipboardAlt size="50" color="#fff" />
          <h2>Inventario</h2>
        </div>
        <div className="DashboardCard" onClick={() => navigate('/ventas')}>
          <UilShoppingCart size="50" color="#fff" />
          <h2>Ventas</h2>
        </div>
      </div>
    </div>
  );
}

export default App;
