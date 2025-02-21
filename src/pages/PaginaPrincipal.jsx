import React from 'react';
import Navbar from '../components/Navbar.jsx';
import ReporteIndicadores from '../components/ReporteIndicadores.jsx';

const PaginaPrincipal = () => {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="content">
        {/* Your existing indicators report content */}
        <ReporteIndicadores/>
      </main>
    </div>
  );
};

export default PaginaPrincipal;
