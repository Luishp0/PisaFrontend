import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import PisaIcono from '../img/pisaIcono.png';

const NavbarUsuario = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full bg-white shadow-sm p-2">
      {/* Cambiado a max-w-full y añadido mx-0 para eliminar márgenes automáticos */}
      <div className="max-w-full mx-0 flex justify-between items-center px-6 md:px-12">
        {/* Logo a la izquierda extrema */}
        <div className="flex items-center">
          <div className="w-20 h-16 mr-2">
            {/* Logo utilizando la imagen importada - tamaño aumentado */}
            <img src={PisaIcono} alt="Grupo PSA Logo" className="w-full h-full object-contain" />
          </div>
        </div>
        
        {/* Botón menú para móviles */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="p-2">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Botón Salir para desktop - movido más a la derecha */}
        <div className="hidden md:block">
          <button className="border border-blue-600 text-blue-600 px-8 py-2 rounded-md hover:bg-blue-50 transition-colors duration-300">
            Salir
          </button>
        </div>
      </div>
      
      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 bg-white py-2">
          <button className="w-full text-center border border-blue-600 text-blue-600 px-8 py-2 rounded-md hover:bg-blue-50 transition-colors duration-300">
            Salir
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavbarUsuario;