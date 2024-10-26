import React from 'react';
import { useNavigate } from 'react-router-dom';
import InventoryTable from '../InventoryTools/InventoryTable';
import '../PagesStyles/AppInventarioStyle.css';

function AppInventario() {
    const navigate = useNavigate();

    // Formato JSON de productos
    const products = {
        "777": {
            "nombre": "Queso",
            "precio": 100,
            "cantidad": 2
        },
        "7501234567890": {
            "nombre": "Coca Cola 3lts",
            "precio": 45,
            "cantidad": 14
        },
        "7500987654321": {
            "nombre": "Del Valle Mango 1lt",
            "precio": 20,
            "cantidad": 15
        }
    };

    return (
        <div className="AppInventarioContainer">
            <div className="HeaderContainer">
                <h1>Inventario</h1>
                <button onClick={() => navigate('/dashboard')}>Regresar a menú</button>
            </div>
            <InventoryTable products={products} />
        </div>
    );
}

export default AppInventario;
