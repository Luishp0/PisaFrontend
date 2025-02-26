import React, { useState } from 'react';
import { Calendar, X, Search, ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import NavbarReport from '../components/NavbarReport';

const Report = () => {
  const [dropdownOpen, setDropdownOpen] = useState({
    fecha: false,
    familia: false,
    linea: false,
    junta: false,
    porcentaje: false
  });
  const [filters, setFilters] = useState({
    fecha: '',
    familia: '',
    linea: '',
    junta: '',
    concepto: '',
    porcentajeMin: '',
    porcentajeMax: ''
  });
  
  // Datos de muestra para la tabla exactamente como en la imagen
  const tableData = [
    { semana: 50, mes: 12, dia: '10-dic', linea: '5A', oee: '60%', concepto: 'Falta de accesorios', porcentaje: 9.4, hrs: 1.58, falla: 'ESPACIO PATIO PARA CARROS', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '5A', oee: '60%', concepto: 'Cambios y limpiezas', porcentaje: 9.1, hrs: 1.92, falla: 'CIP-SIP', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '5A', oee: '60%', concepto: 'Avería de proceso', porcentaje: 8.1, hrs: 1.70, falla: 'No forma cav 5 y 16', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '5A', oee: '60%', concepto: 'Cambios y limpiezas', porcentaje: 3.5, hrs: 0.73, falla: 'HABILITACIÓN', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '5A', oee: '60%', concepto: 'Ajuste de proceso', porcentaje: 2.5, hrs: 0.52, falla: 'Ajustes en POSICIONES Y VELOCIDAD DE CLAVOS', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '6A', oee: '73%', concepto: 'Cambios y limpiezas', porcentaje: 10.5, hrs: 2.20, falla: 'CIP-SIP', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '6A', oee: '73%', concepto: 'Falta de accesorios', porcentaje: 4.7, hrs: 0.98, falla: 'ESPACIO PATIO PARA CARROS', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '6A', oee: '73%', concepto: 'Cambios y limpiezas', porcentaje: 4.1, hrs: 0.87, falla: 'PRUEBA FD', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '6A', oee: '73%', concepto: 'Administrativo', porcentaje: 1.8, hrs: 0.38, falla: 'MUESTREO MICROBIOLÓGICO', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '6A', oee: '73%', concepto: 'Cambios y limpiezas', porcentaje: 1.4, hrs: 0.30, falla: 'Habilitación', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '8A', oee: '88%', concepto: 'Administrativo', porcentaje: 3.9, hrs: 0.82, falla: 'ESPERA AUTORIZACIÓN TABLET', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '8A', oee: '88%', concepto: 'Cambios y limpiezas', porcentaje: 3.1, hrs: 0.65, falla: 'CAMBIO DE LOTE', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '8A', oee: '88%', concepto: 'Planeados', porcentaje: 1.9, hrs: 0.40, falla: 'RETORNO DE SOLUCIÓN', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '8A', oee: '88%', concepto: 'Ajuste de proceso', porcentaje: 0.7, hrs: 0.15, falla: 'MONITOREO DE CAVIDAD', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '8A', oee: '88%', concepto: 'Cambios y limpiezas', porcentaje: 0.5, hrs: 0.10, falla: 'PRUEBA FD', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '1E', oee: '82%', concepto: 'Ajuste de proceso', porcentaje: 4.1, hrs: 0.88, falla: 'TANQUE COLCHÓN', comentario: 'tanque se vacía con ajustes de máquina, se purga' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '1E', oee: '82%', concepto: 'Falta de personal', porcentaje: 2.9, hrs: 0.62, falla: 'FALTA PERSONAL', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '1E', oee: '82%', concepto: 'Ajuste de proceso', porcentaje: 2.5, hrs: 0.53, falla: 'AJUSTE DE TUBOS', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '1E', oee: '82%', concepto: 'Ajuste de proceso', porcentaje: 1.6, hrs: 0.33, falla: 'ALARMA TROQUELADORA', comentario: 'de re inicia electroválvula' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '1E', oee: '82%', concepto: 'Cambios y limpiezas', porcentaje: 1.3, hrs: 0.27, falla: 'CAMBIO DE LOTE', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '2E', oee: '85%', concepto: 'Ajuste de proceso', porcentaje: 5.7, hrs: 1.17, falla: 'FALLA LINK', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '2E', oee: '85%', concepto: 'Ajuste de proceso', porcentaje: 2.4, hrs: 0.50, falla: 'FALLA UNV', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '2E', oee: '85%', concepto: 'Ajuste de proceso', porcentaje: 1.6, hrs: 0.33, falla: 'FRASCO TRONADO', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '2E', oee: '85%', concepto: 'Cambios y limpiezas', porcentaje: 1.2, hrs: 0.25, falla: 'CAMBIO DE LOTE', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '2E', oee: '85%', concepto: 'Ajuste de proceso', porcentaje: 0.9, hrs: 0.18, falla: 'TAPA ATORADA', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '5E', oee: '55%', concepto: 'Cambios y limpiezas', porcentaje: 16.8, hrs: 3.42, falla: 'CIP-SIP', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '5E', oee: '55%', concepto: 'Ajuste de proceso', porcentaje: 15.1, hrs: 3.07, falla: 'COLGADOR ROTO', comentario: 'ajuste de tubos, revoluciones, retraso de cierre de molde, ajuste de equipo de moldes (limpieza de segmentos)' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '5E', oee: '55%', concepto: 'Falta de material', porcentaje: 2.1, hrs: 0.42, falla: 'PLÁSTICO EN MORDAZA', comentario: 'limpieza' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '5E', oee: '55%', concepto: 'Cambios y limpiezas', porcentaje: 1.6, hrs: 0.33, falla: 'FD', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '5E', oee: '55%', concepto: 'Ajuste de proceso', porcentaje: 1.2, hrs: 0.25, falla: 'FALLA BANDA DE SALIDA BKP', comentario: 'se restablece variador' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '6E', oee: '97%', concepto: 'Cambios y limpiezas', porcentaje: 3.3, hrs: 0.25, falla: 'FD', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '6E', oee: '97%', concepto: '', porcentaje: null, hrs: null, falla: '', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '6E', oee: '97%', concepto: '', porcentaje: null, hrs: null, falla: '', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '6E', oee: '97%', concepto: '', porcentaje: null, hrs: null, falla: '', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '6E', oee: '97%', concepto: '', porcentaje: null, hrs: null, falla: '', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '10E', oee: '51%', concepto: 'Ajuste de proceso', porcentaje: 18.0, hrs: 1.62, falla: 'CLAVIJAS', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '10E', oee: '51%', concepto: 'Ajuste de proceso', porcentaje: 8.9, hrs: 0.80, falla: 'ROBOT', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '10E', oee: '51%', concepto: 'Ajuste de proceso', porcentaje: 6.3, hrs: 0.57, falla: 'MIRROR A', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '10E', oee: '51%', concepto: 'Ajuste de proceso', porcentaje: 4.7, hrs: 0.42, falla: 'FALLA BPK', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '10E', oee: '51%', concepto: 'Ajuste de proceso', porcentaje: 4.2, hrs: 0.38, falla: 'BANDA MIRROR A', comentario: '' }
  ];
  
  // Datos para los dropdowns
  const fechaOptions = ['10-dic', '11-dic', '12-dic', '13-dic', '14-dic'];
  const familiaOptions = ['Bolsas', 'Ampolleteas', 'Flexoval'];
  const lineaOptions = ['5A', '6A', '8A', '1E', '2E', '5E', '6E', '10E'];
  
  // Filtrar datos de la tabla basado en los filtros
  const filteredData = tableData.filter(row => {
    return (
      (filters.fecha === '' || row.dia === filters.fecha) &&
      (filters.familia === '' || row.linea.includes(filters.familia)) &&
      (filters.linea === '' || row.linea === filters.linea) &&
      (filters.junta === '' || true) && // No hay filtro de junta en los datos
      (filters.concepto === '' || 
        (row.concepto && row.concepto.toLowerCase().includes(filters.concepto.toLowerCase())) || 
        (row.falla && row.falla.toLowerCase().includes(filters.concepto.toLowerCase()))) &&
      (filters.porcentajeMin === '' || row.porcentaje === null || row.porcentaje >= parseFloat(filters.porcentajeMin)) &&
      (filters.porcentajeMax === '' || row.porcentaje === null || row.porcentaje <= parseFloat(filters.porcentajeMax))
    );
  });
  
  // Función para determinar el color de fondo basado en el valor de OEE
  const getBackgroundColor = (oee) => {
    const percentage = parseInt(oee);
    if (percentage >= 85) return 'bg-green-100';
    if (percentage >= 70) return 'bg-yellow-100';
    if (percentage >= 60) return 'bg-orange-100';
    return 'bg-red-100';
  };
  
  // Toggle para los dropdowns
  const toggleDropdown = (dropdown) => {
    setDropdownOpen({
      ...dropdownOpen,
      [dropdown]: !dropdownOpen[dropdown]
    });
  };
  
  // Función para seleccionar un filtro
  const selectFilter = (type, value) => {
    setFilters({
      ...filters,
      [type]: value
    });
    toggleDropdown(type);
  };
  
  // Función para limpiar un filtro
  const clearFilter = (type) => {
    setFilters({
      ...filters,
      [type]: ''
    });
  };

  return (
    <div><Navbar/>
    <div className="w-full bg-white p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Reportes</h1>
      <NavbarReport/>
     
      
      {/* Excel icon and filters */}
      <div className="flex items-center mb-6 flex-wrap">
        <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center mr-4 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6">
            <path fill="#eceff1" d="M41,10H25v28h16c0.553,0,1-0.447,1-1V11C42,10.447,41.553,10,41,10z"/>
            <path fill="#388e3c" d="M32 15H39V18H32zM32 25H39V28H32zM32 20H39V23H32zM32 30H39V33H32zM25 15H30V18H25zM25 25H30V28H25zM25 20H30V23H25zM25 30H30V33H25z"/>
            <path fill="#4caf50" d="M27,42l-21-4V10l21-4V42z"/>
            <path fill="#fff" d="M19.129,31l-2.411-4.561c-0.092-0.171-0.186-0.483-0.281-0.93h-0.042c-0.046,0.215-0.154,0.541-0.324,0.97L13.652,31H9.895l4.462-7.001L10.274,17h3.837l2.001,4.196c0.156,0.331,0.296,0.725,0.42,1.179h0.043c0.078-0.271,0.224-0.68,0.439-1.22L19.086,17h3.837l-4.084,6.909L23.253,31H19.129z"/>
          </svg>
        </div>
        
        {/* Filters */}
        <div className="flex space-x-4 flex-grow">
          {/* Date filter */}
          <div className="relative">
            <button className="flex items-center border rounded px-3 py-2" onClick={() => toggleDropdown('fecha')}>
              <Calendar size={16} className="mr-2" />
              <span>{filters.fecha || 'Fecha'}</span>
              {filters.fecha ? (
                <X size={16} className="ml-2 cursor-pointer" onClick={(e) => {
                  e.stopPropagation();
                  clearFilter('fecha');
                }} />
              ) : (
                <ChevronDown size={16} className="ml-2" />
              )}
            </button>
            
            {dropdownOpen.fecha && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded shadow-lg z-10">
                {fechaOptions.map((option, index) => (
                  <div 
                    key={index} 
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectFilter('fecha', option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Familia filter */}
          <div className="relative">
            <div className="flex">
              <div className="bg-purple-100 text-purple-800 text-xs p-1 rounded-l">
                Familia
              </div>
              <button 
                className="flex items-center border rounded-r px-3 py-2"
                onClick={() => toggleDropdown('familia')}
              >
                <span>{filters.familia || 'Familia'}</span>
                {filters.familia ? (
                  <X size={16} className="ml-2 cursor-pointer" onClick={(e) => {
                    e.stopPropagation();
                    clearFilter('familia');
                  }} />
                ) : (
                  <ChevronDown size={16} className="ml-2" />
                )}
              </button>
            </div>
            
            {dropdownOpen.familia && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-purple-50 border rounded shadow-lg z-10">
                {familiaOptions.map((option, index) => (
                  <div 
                    key={index} 
                    className="p-2 hover:bg-purple-100 cursor-pointer"
                    onClick={() => selectFilter('familia', option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Linea filter */}
          <div className="relative">
            <div className="flex">
              <div className="bg-blue-100 text-blue-800 text-xs p-1 rounded-l">
                Línea
              </div>
              <button 
                className="flex items-center border rounded-r px-3 py-2"
                onClick={() => toggleDropdown('linea')}
              >
                <span>{filters.linea || 'Linea'}</span>
                {filters.linea ? (
                  <X size={16} className="ml-2 cursor-pointer" onClick={(e) => {
                    e.stopPropagation();
                    clearFilter('linea');
                  }} />
                ) : (
                  <ChevronDown size={16} className="ml-2" />
                )}
              </button>
            </div>
            
            {dropdownOpen.linea && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-blue-50 border rounded shadow-lg z-10">
                {lineaOptions.map((option, index) => (
                  <div 
                    key={index} 
                    className="p-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => selectFilter('linea', option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Concepto search */}
          <div className="relative flex-grow">
            <div className="flex">
              <div className="bg-gray-100 text-gray-800 text-xs p-1 rounded-l">
                Buscar
              </div>
              <div className="flex items-center border rounded-r px-3 py-2 w-full">
                <Search size={16} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar por concepto o falla..."
                  className="ml-2 outline-none w-full"
                  value={filters.concepto}
                  onChange={(e) => setFilters({...filters, concepto: e.target.value})}
                />
                {filters.concepto && (
                  <X 
                    size={16} 
                    className="ml-2 cursor-pointer text-gray-500" 
                    onClick={() => clearFilter('concepto')}
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Porcentaje filter */}
          <div className="relative ml-4">
            <button 
              className="flex items-center border rounded px-3 py-2 bg-yellow-50"
              onClick={() => toggleDropdown('porcentaje')}
            >
              <span>% </span>
              {(filters.porcentajeMin || filters.porcentajeMax) ? (
                <span>
                  {filters.porcentajeMin || '0'}
                  {' - '}
                  {filters.porcentajeMax || '∞'}
                </span>
              ) : (
                <span>Filtrar</span>
              )}
              {(filters.porcentajeMin || filters.porcentajeMax) ? (
                <X 
                  size={16} 
                  className="ml-2 cursor-pointer" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilters({
                      ...filters, 
                      porcentajeMin: '',
                      porcentajeMax: ''
                    });
                  }}
                />
              ) : (
                <ChevronDown size={16} className="ml-2" />
              )}
            </button>
            
            {dropdownOpen.porcentaje && (
              <div className="absolute top-full right-0 mt-1 p-3 w-64 bg-white border rounded shadow-lg z-10">
                <h4 className="font-medium mb-2">Rango de porcentaje</h4>
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Min"
                    className="border rounded p-1 w-20"
                    value={filters.porcentajeMin}
                    onChange={(e) => setFilters({...filters, porcentajeMin: e.target.value})}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Max"
                    className="border rounded p-1 w-20"
                    value={filters.porcentajeMax}
                    onChange={(e) => setFilters({...filters, porcentajeMax: e.target.value})}
                  />
                </div>
                <div className="flex justify-between">
                  <button 
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded"
                    onClick={() => {
                      setFilters({
                        ...filters,
                        porcentajeMin: '',
                        porcentajeMax: ''
                      });
                      toggleDropdown('porcentaje');
                    }}
                  >
                    Limpiar
                  </button>
                  <button 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => toggleDropdown('porcentaje')}
                  >
                    Aplicar
                  </button>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-500">Rangos comunes:</p>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button 
                      className="text-xs bg-gray-100 hover:bg-gray-200 p-1 rounded"
                      onClick={() => {
                        setFilters({...filters, porcentajeMin: '0', porcentajeMax: '5'});
                      }}
                    >
                      0 - 5%
                    </button>
                    <button 
                      className="text-xs bg-gray-100 hover:bg-gray-200 p-1 rounded"
                      onClick={() => {
                        setFilters({...filters, porcentajeMin: '5', porcentajeMax: '10'});
                      }}
                    >
                      5 - 10%
                    </button>
                    <button 
                      className="text-xs bg-gray-100 hover:bg-gray-200 p-1 rounded"
                      onClick={() => {
                        setFilters({...filters, porcentajeMin: '10', porcentajeMax: ''});
                      }}
                    >
                      ≥ 10%
                    </button>
                    <button 
                      className="text-xs bg-gray-100 hover:bg-gray-200 p-1 rounded"
                      onClick={() => {
                        setFilters({...filters, porcentajeMin: '', porcentajeMax: '5'});
                      }}
                    >
                      ≤ 5%
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-800 text-white">
              <th className="border border-gray-300 px-2 py-1 text-left">Semana</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Mes</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Dia</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Linea</th>
              <th className="border border-gray-300 px-2 py-1 text-left">OEE</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Concepto</th>
              <th className="border border-gray-300 px-2 py-1 text-left">%</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Hrs</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Falla</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Comentarios / Plan de acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 px-2 py-1">{row.semana}</td>
                <td className="border border-gray-300 px-2 py-1">{row.mes}</td>
                <td className="border border-gray-300 px-2 py-1">{row.dia}</td>
                <td className="border border-gray-300 px-2 py-1">{row.linea}</td>
                <td className={`border border-gray-300 px-2 py-1 ${getBackgroundColor(row.oee)}`}>{row.oee}</td>
                <td className="border border-gray-300 px-2 py-1">{row.concepto}</td>
                <td className="border border-gray-300 px-2 py-1">{row.porcentaje !== null ? `${row.porcentaje}%` : ''}</td>
                <td className="border border-gray-300 px-2 py-1">{row.hrs}</td>
                <td className="border border-gray-300 px-2 py-1">{row.falla}</td>
                <td className="border border-gray-300 px-2 py-1">{row.comentario}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}

export default Report;