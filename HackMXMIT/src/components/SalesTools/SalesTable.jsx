import React, { useState, useEffect } from 'react';
import './SalesTable.css';

const SalesTable = () => {
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Obtener las ventas desde la API
  useEffect(() => {
    fetch('http://localhost:3000/historial_ventas')
      .then(response => response.json())
      .then(data => setSales(data))
      .catch(error => console.error('Error al obtener las ventas:', error));
  }, []);

  // Filtrar ventas según el término de búsqueda (por código o fecha)
  const filteredSales = sales.filter(sale =>
    (sale.codigo && sale.codigo.includes(searchTerm)) || sale.fechaHora.includes(searchTerm)
  );

  return (
    <div className="SalesTableContainer">
      <h2>Registro de Ventas</h2>
      <input
        type="text"
        placeholder="Buscar por código o fecha..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="SearchInput"
      />
      <table className="SalesTable">
        <thead>
          <tr>
            <th>Código</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Fecha y Hora</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.length > 0 ? (
            filteredSales.map((sale, index) => (
              <tr key={index}>
                <td>{sale.codigo || 'N/A'}</td>
                <td>{sale.cantidad}</td>
                <td>${sale.precio.toFixed(2)}</td>
                <td>{new Date(sale.fechaHora).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="NoResults">No se encontraron ventas</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;