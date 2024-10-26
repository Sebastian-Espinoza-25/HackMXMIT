import React from 'react';
import { useNavigate } from 'react-router-dom';
import SalesTable from '../SalesTools/SalesTable';
import '../PagesStyles/AppVentasStyle.css';

function AppVentas() {
    const navigate = useNavigate();

    const salesData = [
        {
            "codigo": "7501234567890",
            "cantidad": 2,
            "precio": 45,
            "fechaHora": "2024-10-26T12:31:19.427Z"
        },
        {
            "codigo": "7501234567890",
            "cantidad": 2,
            "precio": 45,
            "fechaHora": "2024-10-26T12:33:55.780Z"
        }
    ];

    return (
        <div className="AppVentasContainer">
            <div className="HeaderContainer">
                <h1>Ventas</h1>
                <button onClick={() => navigate('/dashboard')}>Regresar a menú</button>
            </div>
            <SalesTable sales={salesData} />
        </div>
    );
}

export default AppVentas;
