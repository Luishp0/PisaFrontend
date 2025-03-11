import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import Navbar from './Navbar';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  // Función para obtener los usuarios del servidor
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/usuario');
        
        if (!response.ok) {
          throw new Error('Error al obtener los usuarios');
        }
        
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  // Función para cambiar el estado de bloqueo de un usuario
  const toggleStatus = async (userId) => {
    try {
      const userToUpdate = users.find(user => user._id === userId);
      
      if (!userToUpdate) return;
      
      const response = await fetch(`http://localhost:8000/usuario/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userToUpdate,
          bloqueado: !userToUpdate.bloqueado
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar el usuario');
      }
      
      // Actualiza el estado local después de la actualización exitosa
      setUsers(users.map(user => 
        user._id === userId ? { ...user, bloqueado: !user.bloqueado } : user
      ));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAddUser = () => {
    navigate('/usuarioRegistrado');
  };

  // Filtrado de usuarios según el término de búsqueda
  const filteredUsers = users.filter(user => 
    user.nombreUsuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.familia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.idRol && user.idRol.tipo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Formatear la fecha para mostrarla en formato DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  return (
    <div> 
      <Navbar/>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">Usuarios</h1>
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          {/* Búsqueda */}
          <div className="relative w-full md:w-64 mb-4 md:mb-0">
            <input 
              type="text" 
              placeholder="Buscar Usuario" 
              className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <Search size={20} />
            </div>
          </div>
          
          {/* Botón Agregar */}
          <button 
            onClick={handleAddUser} 
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out"
          >
            Agregar Usuario
          </button>
        </div>
        
        {/* Mensajes de estado */}
        {loading && <p className="text-center py-4">Cargando usuarios...</p>}
        {error && <p className="text-center text-red-500 py-4">Error: {error}</p>}
        
        {/* Tabla */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-6 text-left border-b border-r">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Usuario
                    </div>
                  </th>
                  <th className="py-3 px-6 text-left border-b border-r">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Familia
                    </div>
                  </th>

                  <th className="py-3 px-6 text-left border-b border-r">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Rol del Usuario
                    </div>
                  </th>
                  <th className="py-3 px-6 text-left border-b border-r">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Fecha Registro
                    </div>
                  </th>
                  <th className="py-3 px-6 text-left border-b">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Estado
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 border-b border-r">{user.nombreUsuario}</td>
                    <td className="py-4 px-6 border-b border-r">{user.familia}</td>
                    <td className="py-4 px-6 border-b border-r font-medium">
                      <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm">
                        {user.idRol ? user.idRol.tipo : 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-6 border-b border-r">{formatDate(user.fechaHora)}</td>
                    <td className="py-4 px-6 border-b">
                      <div className="flex items-center">
                        {/* Toggle Switch */}
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input 
                            type="checkbox" 
                            checked={!user.bloqueado} 
                            onChange={() => toggleStatus(user._id)}
                            className="sr-only"
                            id={`toggle-${user._id}`}
                          />
                          <label 
                            htmlFor={`toggle-${user._id}`}
                            className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${!user.bloqueado ? 'bg-green-400' : 'bg-gray-300'}`}
                          >
                            <span 
                              className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in ${!user.bloqueado ? 'transform translate-x-4' : ''}`}
                            ></span>
                          </label>
                        </div>
                        {/* Status Text */}
                        <span className={`${!user.bloqueado ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'} py-1 px-2 rounded-md text-xs font-medium`}>
                          {!user.bloqueado ? 'Activo' : 'Bloqueado'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;