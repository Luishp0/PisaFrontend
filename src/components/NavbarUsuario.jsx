import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { Menu, X } from 'lucide-react';
import PisaIcono from '../img/pisaIcono.png';

const NavbarUsuario = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); // Inicializa useNavigate

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    navigate('/'); // Redirige al usuario a la ruta de inicio de sesión
  };

  return (
    <nav className="w-full bg-white shadow-sm p-2">
      <div className="max-w-full mx-0 flex justify-between items-center px-6 md:px-12">
        <div className="flex items-center">
          <div className="w-20 h-16 mr-2">
            <img src={PisaIcono} alt="Grupo PSA Logo" className="w-full h-full object-contain" />
          </div>
        </div>
        
        <div className="md:hidden">
          <button onClick={toggleMenu} className="p-2">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        <div className="hidden md:block">
          <button 
            onClick={handleLogout} // Añade el manejador de clic
            className="border border-blue-600 text-blue-600 px-8 py-2 rounded-md hover:bg-blue-50 transition-colors duration-300"
          >
            Salir
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden mt-2 bg-white py-2">
          <button 
            onClick={handleLogout} // Añade el manejador de clic
            className="w-full text-center border border-blue-600 text-blue-600 px-8 py-2 rounded-md hover:bg-blue-50 transition-colors duration-300"
          >
            Salir
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavbarUsuario;