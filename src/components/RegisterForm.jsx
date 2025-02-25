import React, { useState } from 'react';
import { useNotification } from '../components/NotificationProvider.jsx'; // Importa el hook
import statisticsImage from '../img/fondoUsuario.png'; // Asegúrate de tener una imagen o cambiar la ruta
import Navbar from './Navbar';

const RegisterForm = () => {
  const { showSuccess, showError } = useNotification(); // Usa el hook de notificación
  const [formData, setFormData] = useState({
    usuario: '',
    contrasena: '',
    familia: '',
    puesto: '',
    clase: 'Usuario'
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
    
    // Validar campos obligatorios
    if (!formData.usuario || !formData.contrasena) {
      showError('Por favor, complete los campos obligatorios');
      return;
    }
    
    // Simulación de envío exitoso
    console.log('Datos del formulario:', formData);
    showSuccess('Usuario registrado exitosamente');
    
    // Aquí iría el código para enviar datos al servidor
    // try {
    //   const response = await fetch('/api/registro', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData)
    //   });
    //   
    //   if (response.ok) {
    //     showSuccess('Usuario registrado exitosamente');
    //     // Redirigir o limpiar formulario
    //   } else {
    //     const data = await response.json();
    //     showError(data.message || 'Error al registrar usuario');
    //   }
    // } catch (error) {
    //   showError('Error de conexión con el servidor');
    // }
  };

  return (
    <div><Navbar/>
    <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl mx-auto my-10">
      {/* Sección de la imagen */}
      <div className="md:w-1/2 bg-blue-50">
        <div className="h-full flex items-center justify-center p-6">
          <img 
            src={statisticsImage} 
            alt="Estadísticas" 
            className="max-w-full h-auto rounded-lg shadow-md"
          />
          {/* Si prefieres usar un div con background-image en lugar de img */}
          {/* <div className="w-full h-full bg-cover bg-center rounded-lg shadow-md" 
               style={{ backgroundImage: "url('/path/to/your/image.jpg')" }}>
          </div> */}
        </div>
      </div>
      
      {/* Sección del formulario */}
      <div className="md:w-1/2 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-2xl font-bold text-blue-700 mb-6">Registrar</h1>
          
          <div className="space-y-2">
            <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">
              Usuario
            </label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="familia" className="block text-sm font-medium text-gray-700">
              Familia
            </label>
            <input
              type="text"
              id="familia"
              name="familia"
              value={formData.familia}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="puesto" className="block text-sm font-medium text-gray-700">
              Puesto
            </label>
            <input
              type="text"
              id="puesto"
              name="puesto"
              value={formData.puesto}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="clase" className="block text-sm font-medium text-gray-700">
              Usuario o administrador
            </label>
            <select
              id="clase"
              name="clase"
              value={formData.clase}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="Usuario">Usuario</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out mt-6 shadow-md"
            style={{
              backgroundColor: '#2563EB', // Azul más vibrante
              fontWeight: '500'
            }}
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default RegisterForm;