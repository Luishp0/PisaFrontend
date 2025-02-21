import React, { useState } from 'react';
import '../css/RegisterForm.css';
import Navbar from './Navbar';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    contrasena: '',
    familia: '',
    puesto: '',
    clase: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
  };

  return (
    <div> <Navbar/>
    <div className="register-container">
      <div className="image-section">
        <div className="stats-image">
          {/* La imagen de estadísticas se maneja con CSS como background */}
        </div>
      </div>
      
      <div className="form-section">
        <form onSubmit={handleSubmit}>
          <h1>Registrar</h1>
          
          <div className="form-group">
            <label htmlFor="usuario">Usuario</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="familia">Familia</label>
            <input
              type="text"
              id="familia"
              name="familia"
              value={formData.familia}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="puesto">Puesto</label>
            <input
              type="text"
              id="puesto"
              name="puesto"
              value={formData.puesto}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="clase">Usuario o administrador</label>
            <select
              id="clase"
              name="clase"
              value={formData.clase}
              onChange={handleChange}
            >
              <option value="Usurio">Usuario</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>

          <button type="submit" className="register-button">
            Registrar
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default RegisterForm;