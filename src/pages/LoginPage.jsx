import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../components/NotificationProvider.jsx';
import mejoraContinua from '../img/mejoraContinua.png';
import pisaIcono from '../img/pisaIcono.png';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [intentosRestantes, setIntentosRestantes] = useState(null);
  const navigate = useNavigate();
  const { showError, showSuccess, showWarning} = useNotification();

  // Obteniendo la URL base de la API desde las variables de entorno
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setIntentosRestantes(null);

    if (!username || !password) {
      showWarning('Por favor, complete todos los campos');
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          nombreUsuario: username, 
          contraseña: password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar el token en localStorage
        localStorage.setItem('token', data.token);
        
        // Guardar información del usuario si está disponible
        if (data.user) {
          localStorage.setItem('userData', JSON.stringify(data.user));
        }
        
        // Mostrar notificación de éxito
        showSuccess('¡Bienvenido! Inicio de sesión exitoso');
        
        // Redirigir según el rol
        setTimeout(() => {
          // Redirección basada en el rol del usuario
          if (data.user && data.user.idRol) {
            switch(data.user.idRol) {
              case '67b3ef205de7d75b4cd02e5d': // Usuario
                navigate('/usuario');
                break;
              case '67b3ee195de7d75b4cd02e56': // Administrador
                navigate('/admin');
                break;
              default:
                navigate('/usuario'); // Ruta por defecto
            }
          } else {
            navigate('/usuario'); // Ruta por defecto si no hay rol
          }
        }, 1000);
      } else {
        // Manejar diferentes tipos de errores
        setLoginError(data.error || 'Error al iniciar sesión');
        
        // Si la cuenta está bloqueada
        if (data.bloqueado) {
          showError('Cuenta bloqueada', {
            description: 'Tu cuenta ha sido bloqueada. Por favor, contacta al administrador.'
          });
        } 
        // Si hay intentos fallidos pero no está bloqueado
        else if (data.intentosRestantes !== undefined) {
          setIntentosRestantes(data.intentosRestantes);
          
          if (data.intentosRestantes <= 2) {
            showWarning(`¡Atención! ${data.error}`, {
              description: `Te quedan ${data.intentosRestantes} ${data.intentosRestantes === 1 ? 'intento' : 'intentos'} antes de que tu cuenta sea bloqueada.`
            });
          } else {
            showError(`Error: ${data.error}`, {
              description: `Te quedan ${data.intentosRestantes} intentos antes de que tu cuenta sea bloqueada.`
            });
          }
        } 
        // Error genérico
        else {
          showError(data.error || 'Error al iniciar sesión');
        }
      }
    } catch (err) {
      console.error(err);
      setLoginError('Error de conexión con el servidor');
      showError('Error de conexión', { 
        description: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.' 
      });
    } finally {
      setIsLoading(false);
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
              
              {/* Mensajes de error */}
              {loginError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                  <AlertCircle className="text-red-500 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-700 text-sm font-medium">{loginError}</p>
                    {intentosRestantes !== null && intentosRestantes > 0 && (
                      <p className="text-red-600 text-xs mt-1">
                        Te quedan {intentosRestantes} {intentosRestantes === 1 ? 'intento' : 'intentos'} antes de que tu cuenta sea bloqueada.
                      </p>
                    )}
                  </div>
                </div>
              )}
              
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
                    disabled={isLoading}
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
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className={`w-full ${isLoading ? 'bg-blue-400' : 'bg-blue-600'} text-white py-3 px-4 rounded-md focus:outline-none mt-6 flex justify-center items-center`}
                  style={{
                    backgroundColor: isLoading ? '#60A5FA' : '#2563EB',
                    borderRadius: '0.375rem',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
                </button>
                
                
                
                {/* Información adicional */}
                <div className="mt-4 flex items-start text-xs text-gray-500">
                  <Info className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                  <p>
                    Por tu seguridad, después de 5 intentos fallidos tu cuenta será bloqueada temporalmente.
                    Si tienes problemas para acceder, por favor contacta al administrador.
                  </p>
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