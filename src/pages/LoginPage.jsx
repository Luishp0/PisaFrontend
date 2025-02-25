import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../components/NotificationProvider.jsx'; // Importa el hook
import mejoraContinua from '../img/mejoraContinua.png';
import pisaIcono from '../img/pisaIcono.png';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification(); // Usa el hook de notificación

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      showError('Por favor, complete todos los campos');
      return;
    }

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
        // Mostrar notificación de éxito
        showSuccess('Inicio de sesión exitoso');
        // Redirigir al dashboard (con pequeño retraso para que se vea la notificación)
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        showError(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      showError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        {/* Header with logo */}
        <div className="bg-white p-4 border-b border-blue-600">
          <img src={pisaIcono} alt="Grupo P&A" className="h-16" />
        </div>
        
        {/* Content area */}
        <div className="flex flex-col md:flex-row">
          {/* Left side - Image */}
          <div className="flex items-center justify-center p-6 md:w-1/2">
            <img
              src={mejoraContinua}
              alt="Mejora Continua"
              className="max-w-full max-h-80"
            />
          </div>
          
          {/* Right side - Form */}
          <div className="p-8 md:w-1/2">
            <div className="max-w-md mx-auto">
              <h1 className="text-3xl font-bold text-blue-700 mb-8">Inicio de Sesión</h1>
              
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium text-blue-800">
                    Usuario
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Ingrese su usuario"
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-blue-800">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingrese su contraseña"
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md focus:outline-none mt-6"
                  style={{
                    backgroundColor: '#2563EB',
                    borderRadius: '0.375rem',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  Ingresar
                </button>
                
                <div className="text-center mt-6">
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">
                    ¿Olvidaste la contraseña?
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;