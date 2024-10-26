import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginFormStyle.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (phoneNumber === '1234567890' && name === 'Juan') {
      setError('');
      navigate('/dashboard');
    } else {
      setError('Número de teléfono o nombre incorrecto. Intenta de nuevo.');
    }
  };

  return (
    <div className="LoginBackground">
      <h1 className="MainTitle">Market on the fly</h1>
      <div className="LoginFormContainer">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          {error && <p className="error">{error}</p>}
          <div className="form-group">
            <label>Número de Teléfono:</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <button type="submit">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
