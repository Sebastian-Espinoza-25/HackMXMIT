import React, { useState, useEffect } from 'react';
import './InventoryTableStyle.css';

const InventoryTable = () => {
  // Estado para los productos
  const [products, setProducts] = useState({});
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Obtener los productos desde la API
  useEffect(() => {
    fetch('http://localhost:3000/inventario')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error al obtener los productos:', error));
  }, []);

  // Convertir el objeto JSON en un array para que se pueda mapear
  const productEntries = Object.entries(products);

  // Filtrar productos en función del término de búsqueda
  const filteredProducts = productEntries.filter(([gtin, product]) =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="InventoryTableContainer">
      <h2>Inventario de Productos</h2>
      {/* Campo de búsqueda */}
      <input
        type="text"
        placeholder="Buscar producto..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="SearchInput"
      />
      <table className="InventoryTable">
        <thead>
          <tr>
            <th>GTIN</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map(([gtin, product]) => (
              <tr key={gtin}>
                <td>{gtin}</td>
                <td>{product.nombre}</td>
                <td>${product.precio.toFixed(2)}</td>
                <td>{product.cantidad}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="NoResults">
                No se encontraron productos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;