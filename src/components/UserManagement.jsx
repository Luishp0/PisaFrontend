import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import Navbar from './Navbar';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, lastLogin: '22/10/2022', name: 'Markus Suzak', active: true },
    { id: 2, lastLogin: '22/05/2022', name: 'Ankur Warikoo', active: true },
    { id: 3, lastLogin: '14/07/2020', name: 'Jodi Picoult', active: true },
    { id: 4, lastLogin: '12/04/2021', name: 'James Clear', active: true },
    { id: 5, lastLogin: '02/02/2022', name: 'Frank Herbert', active: false },
  ]);

  const navigate = useNavigate();

  const toggleStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, active: !user.active } : user
    ));
  };

  const handleAddUser = () => {
    navigate('/usuarioRegistrado');
  };

  return (
    <div> <Navbar/>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">Usuarios</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        {/* Búsqueda */}
        <div className="relative w-full md:w-64 mb-4 md:mb-0">
          <input 
            type="text" 
            placeholder="Buscar Usuario" 
            className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" 
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
      
      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-6 text-left border-b border-r">
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Último Ingreso
                </div>
              </th>
              <th className="py-3 px-6 text-left border-b border-r">
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Usuario
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
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-4 px-6 border-b border-r">{user.lastLogin}</td>
                <td className="py-4 px-6 border-b border-r">{user.name}</td>
                <td className="py-4 px-6 border-b">
                  <div className="flex items-center">
                    {/* Toggle Switch */}
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        checked={user.active} 
                        onChange={() => toggleStatus(user.id)}
                        className="sr-only"
                        id={`toggle-${user.id}`}
                      />
                      <label 
                        htmlFor={`toggle-${user.id}`}
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${user.active ? 'bg-green-400' : 'bg-gray-300'}`}
                      >
                        <span 
                          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in ${user.active ? 'transform translate-x-4' : ''}`}
                        ></span>
                      </label>
                    </div>
                    {/* Status Text */}
                    <span className={`${user.active ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'} py-1 px-2 rounded-md text-xs font-medium`}>
                      {user.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>

  );
};

export default UserManagement;