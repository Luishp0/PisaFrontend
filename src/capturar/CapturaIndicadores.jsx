import React from 'react';
import DatosGenerales from './DatosGenerales.jsx';
import DatosIndicador from './DatosIndicador.jsx';
import Rechazos from './Rechazos.jsx';
import Paros from './Paros.jsx';

const CapturaIndicadores = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">Captura de Indicadores</h1>
        
        <DatosGenerales />
        <DatosIndicador />
        <Rechazos />
        <Paros />
        
      </div>
    </div>
  );
};

export default CapturaIndicadores;