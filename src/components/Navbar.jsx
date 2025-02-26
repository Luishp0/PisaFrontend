import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import PisaIcono from '../img/pisaIcono.png';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="w-full px-0 md:px-0">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 pl-2">
            <img src={PisaIcono} alt="Grupo PSA" className="h-16" />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-gray-500 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8 pr-6">
            <button 
              onClick={() => handleNavigation('/usuario')}
              className="text-blue-600 font-medium hover:text-blue-800 px-2 py-1"
            >
              Usuarios
            </button>
            <button 
              onClick={() => handleNavigation('/mantenimiento')}
              className="text-blue-600 font-medium hover:text-blue-800 px-2 py-1"
            >
              Mantenimiento
            </button>
            <button 
              onClick={() => handleNavigation('/reporte1')}
              className="text-blue-600 font-medium hover:text-blue-800 px-2 py-1"
            >
              Reportes
            </button>
            <button 
              onClick={() => handleNavigation('/inicio')}
              className="text-blue-600 font-medium hover:text-blue-800 px-2 py-1"
            >
              Indicadores
            </button>
            <button 
              onClick={handleLogout}
              className="ml-4 bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 font-medium rounded-md px-6 py-2"
            >
              Salir
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
          <button 
            onClick={() => handleNavigation('/usuario')}
            className="block w-full text-left text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md font-medium"
          >
            Usuarios
          </button>
          <button 
            onClick={() => handleNavigation('/mantenimiento')}
            className="block w-full text-left text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md font-medium"
          >
            Mantenimiento
          </button>
          <button 
            onClick={() => handleNavigation('/reportes')}
            className="block w-full text-left text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md font-medium"
          >
            Reportes
          </button>
          <button 
            onClick={() => handleNavigation('/inicio')}
            className="block w-full text-left text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md font-medium"
          >
            Indicadores
          </button>
          <button 
            onClick={handleLogout}
            className="block w-full text-left text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md font-medium"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;