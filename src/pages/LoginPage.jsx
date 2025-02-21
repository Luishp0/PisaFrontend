import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import mejoraContinua from '../img/mejoraContinua.png'
import pisaIcono from '../img/pisaIcono.png'
import '../css/LoginPage.css';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar el token en localStorage
        localStorage.setItem('token', data.token);
        // Redirigir al dashboard
        navigate('/dashboard');
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="login-container">
      
      <div className="login-card">
        <div className="header">
          <img src={pisaIcono} alt="Grupo P&A" className="company-logo" />
        </div>
        
        <div className="login-content">
          <div className="left-side">
            <img src={mejoraContinua} alt="Mejora Continua" className="mejora-logo" />
          </div>
          
          <div className="right-side">
            <h1 className="login-title">Inicio de Sesión</h1>
            
            {error && <div className="error-message">{error}</div>}
            
            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label>Usuario</label>
                <input
                  type="text"
                  placeholder="Ingrese su usuario"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Contraseña</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingrese su contraseña"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-button">
                Ingresar
              </button>

              <a href="#" className="forgot-password">
                ¿Olvidaste la contraseña?
              </a>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;