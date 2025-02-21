// Navbar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import PisaIcono from '../img/pisaIcono.png'
import '../css/Navbar.css';

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
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={PisaIcono} alt="Grupo PSA" className="logo" />
      </div>

      <button className="menu-toggle" onClick={toggleMenu}>
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
        <button onClick={() => handleNavigation('/usuario')}>Usuarios</button>
        <button onClick={() => handleNavigation('/mantenimiento')}>Mantenimiento</button>
        <button onClick={() => handleNavigation('/reportes')}>Reportes</button>
        <button onClick={() => handleNavigation('/inicio')}>Indicadores</button>
        <button onClick={handleLogout} className="logout-btn">Salir</button>
      </div>
    </nav>
  );
};

export default Navbar;