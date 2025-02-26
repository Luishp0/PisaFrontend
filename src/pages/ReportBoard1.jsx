import React, { useState, useEffect } from 'react';
import { Calendar, X, Search, ChevronDown,  ChevronRight } from 'lucide-react';
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
  
  // Estado para filas expandidas en vista móvil
  const [expandedRows, setExpandedRows] = useState({});
  
  // Datos de muestra para la tabla
  const tableData = [
    { semana: 50, mes: 12, dia: '10-dic', linea: '5A', oee: '90%', concepto: 'Falta de accesorios', porcentaje: 9.4, hrs: 1.58, falla: 'ESPACIO PATIO PARA CARROS', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '5A', oee: '70%', concepto: 'Cambios y limpiezas', porcentaje: 9.1, hrs: 1.92, falla: 'CIP-SIP', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '5A', oee: '51%', concepto: 'Avería de proceso', porcentaje: 8.1, hrs: 1.70, falla: 'No forma cav 5 y 16', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '5A', oee: '60%', concepto: 'Cambios y limpiezas', porcentaje: 3.5, hrs: 0.73, falla: 'HABILITACIÓN', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '5A', oee: '60%', concepto: 'Ajuste de proceso', porcentaje: 2.5, hrs: 0.52, falla: 'Ajustes en POSICIONES Y VELOCIDAD DE CLAVOS', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '6A', oee: '73%', concepto: 'Cambios y limpiezas', porcentaje: 10.5, hrs: 2.20, falla: 'CIP-SIP', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '6A', oee: '73%', concepto: 'Falta de accesorios', porcentaje: 4.7, hrs: 0.98, falla: 'ESPACIO PATIO PARA CARROS', comentario: '' },
    { semana: 50, mes: 12, dia: '10-dic', linea: '6A', oee: '73%', concepto: 'Cambios y limpiezas', porcentaje: 4.1, hrs: 0.87, falla: 'PRUEBA FD', comentario: '' }
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
    if (percentage > 50) return 'bg-yellow-200';
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
  
  // Función para limpiar rango de porcentaje
  const clearPorcentajeFilter = () => {
    setFilters({
      ...filters,
      porcentajeMin: '',
      porcentajeMax: ''
    });
  };
  
  // Toggle para expandir filas en vista móvil
  const toggleRowExpansion = (index) => {
    setExpandedRows({
      ...expandedRows,
      [index]: !expandedRows[index]
    });
  };
  
  // Cerrar todos los dropdowns
  const closeAllDropdowns = () => {
    setDropdownOpen({
      fecha: false,
      familia: false,
      linea: false,
      junta: false,
      porcentaje: false
    });
  };
  
  // Manejar clics fuera de los dropdowns
  const handleClickOutside = () => {
    closeAllDropdowns();
  };
  
  // Función para obtener cantidad de filtros aplicados
  const getAppliedFiltersCount = () => {
    let count = 0;
    if (filters.fecha) count++;
    if (filters.familia) count++;
    if (filters.linea) count++;
    if (filters.concepto) count++;
    if (filters.porcentajeMin || filters.porcentajeMax) count++;
    return count;
  };
  
  // Función para exportar a Excel (simulada)
  const exportToExcel = () => {
    console.log('Exportando a Excel...');
    // Aquí iría la lógica para exportar a Excel
  };
  
  // Cerrar dropdowns al hacer resize
  useEffect(() => {
    const handleResize = () => {
      closeAllDropdowns();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <Navbar/>
      <div className="w-full bg-white p-2 sm:p-4" onClick={handleClickOutside}>
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Reportes</h1>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              exportToExcel();
            }}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md transition-colors text-sm sm:text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
              <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75c-1.036 0-1.875-.84-1.875-1.875v-11.25zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75C3.84 21.75 3 20.91 3 19.875v-6.75z" />
            </svg>
            <span className="hidden sm:inline">Exportar a Excel</span>
          </button>
        </div>
        
        <NavbarReport/>
        
        {/* Filters - Scrollable on mobile */}
        <div className="flex overflow-x-auto pb-2 gap-2 mb-4 mt-4 hide-scrollbar">
          {/* Date filter */}
          <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
            <button 
              className="flex items-center border rounded-lg px-3 py-2 bg-white text-xs sm:text-sm" 
              onClick={() => toggleDropdown('fecha')}
            >
              <Calendar size={16} className="mr-2" />
              <span>{filters.fecha || 'Fecha'}</span>
              {filters.fecha ? (
                <X 
                  size={16} 
                  className="ml-2 cursor-pointer" 
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFilter('fecha');
                  }} 
                />
              ) : (
                <ChevronDown size={16} className="ml-2" />
              )}
            </button>
            
            {dropdownOpen.fecha && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
                <div className="relative bg-white rounded-lg shadow-xl w-64 max-w-full m-4">
                  <div className="flex justify-between items-center p-3 border-b">
                    <h3 className="font-medium">Seleccionar fecha</h3>
                    <button onClick={() => toggleDropdown('fecha')}>
                      <X size={20} />
                    </button>
                  </div>
                  <div className="p-2 max-h-60 overflow-y-auto">
                    {fechaOptions.map((option, index) => (
                      <div 
                        key={index} 
                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => selectFilter('fecha', option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Familia filter */}
          <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center bg-white rounded-lg border">
              <div className="bg-purple-100 text-purple-800 text-xs p-1 px-2 rounded-l-lg">
                Familia
              </div>
              <button 
                className="flex items-center px-3 py-2 text-xs sm:text-sm"
                onClick={() => toggleDropdown('familia')}
              >
                <span>{filters.familia || 'Familia'}</span>
                {filters.familia ? (
                  <X 
                    size={16} 
                    className="ml-2 cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFilter('familia');
                    }} 
                  />
                ) : (
                  <ChevronDown size={16} className="ml-2" />
                )}
              </button>
            </div>
            
            {dropdownOpen.familia && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
                <div className="relative bg-purple-50 rounded-lg shadow-xl w-64 max-w-full m-4">
                  <div className="flex justify-between items-center p-3 border-b bg-purple-100">
                    <h3 className="font-medium text-purple-800">Seleccionar familia</h3>
                    <button onClick={() => toggleDropdown('familia')}>
                      <X size={20} />
                    </button>
                  </div>
                  <div className="p-2 max-h-60 overflow-y-auto">
                    {familiaOptions.map((option, index) => (
                      <div 
                        key={index} 
                        className="p-2 hover:bg-purple-100 cursor-pointer text-sm"
                        onClick={() => selectFilter('familia', option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Linea filter */}
          <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center bg-white rounded-lg border">
              <div className="bg-blue-100 text-blue-800 text-xs p-1 px-2 rounded-l-lg">
                Línea
              </div>
              <button 
                className="flex items-center px-3 py-2 text-xs sm:text-sm"
                onClick={() => toggleDropdown('linea')}
              >
                <span>{filters.linea || 'Linea'}</span>
                {filters.linea ? (
                  <X 
                    size={16} 
                    className="ml-2 cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFilter('linea');
                    }} 
                  />
                ) : (
                  <ChevronDown size={16} className="ml-2" />
                )}
              </button>
            </div>
            
            {dropdownOpen.linea && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
                <div className="relative bg-blue-50 rounded-lg shadow-xl w-64 max-w-full m-4">
                  <div className="flex justify-between items-center p-3 border-b bg-blue-100">
                    <h3 className="font-medium text-blue-800">Seleccionar línea</h3>
                    <button onClick={() => toggleDropdown('linea')}>
                      <X size={20} />
                    </button>
                  </div>
                  <div className="p-2 max-h-60 overflow-y-auto">
                    {lineaOptions.map((option, index) => (
                      <div 
                        key={index} 
                        className="p-2 hover:bg-blue-100 cursor-pointer text-sm"
                        onClick={() => selectFilter('linea', option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Concepto search */}
          <div className="relative shrink-0 flex-grow" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center bg-white rounded-lg border h-full">
              <div className="bg-gray-100 text-gray-800 text-xs p-1 px-2 rounded-l-lg h-full flex items-center">
                Buscar
              </div>
              <div className="flex items-center px-2 py-1 w-full">
                <Search size={16} className="text-gray-500 mr-1" />
                <input
                  type="text"
                  placeholder="Concepto o falla..."
                  className="outline-none w-full text-xs sm:text-sm"
                  value={filters.concepto}
                  onChange={(e) => setFilters({...filters, concepto: e.target.value})}
                />
                {filters.concepto && (
                  <X 
                    size={16} 
                    className="ml-1 cursor-pointer text-gray-500" 
                    onClick={() => clearFilter('concepto')}
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Porcentaje filter */}
          <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
            <button 
              className="flex items-center border rounded-lg px-3 py-2 bg-yellow-50 text-xs sm:text-sm whitespace-nowrap"
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
                    clearPorcentajeFilter();
                  }}
                />
              ) : (
                <ChevronDown size={16} className="ml-2" />
              )}
            </button>
            
            {dropdownOpen.porcentaje && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
                <div className="relative bg-yellow-50 rounded-lg shadow-xl w-80 max-w-full m-4">
                  <div className="flex justify-between items-center p-3 border-b bg-yellow-100">
                    <h3 className="font-medium text-yellow-800">Rango de porcentaje</h3>
                    <button onClick={() => toggleDropdown('porcentaje')}>
                      <X size={20} />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Min"
                        className="border rounded p-2 w-24"
                        value={filters.porcentajeMin}
                        onChange={(e) => setFilters({...filters, porcentajeMin: e.target.value})}
                      />
                      <span>-</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Max"
                        className="border rounded p-2 w-24"
                        value={filters.porcentajeMax}
                        onChange={(e) => setFilters({...filters, porcentajeMax: e.target.value})}
                      />
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Rangos comunes:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          className="text-xs bg-gray-100 hover:bg-gray-200 p-2 rounded"
                          onClick={() => {
                            setFilters({...filters, porcentajeMin: '0', porcentajeMax: '5'});
                          }}
                        >
                          0 - 5%
                        </button>
                        <button 
                          className="text-xs bg-gray-100 hover:bg-gray-200 p-2 rounded"
                          onClick={() => {
                            setFilters({...filters, porcentajeMin: '5', porcentajeMax: '10'});
                          }}
                        >
                          5 - 10%
                        </button>
                        <button 
                          className="text-xs bg-gray-100 hover:bg-gray-200 p-2 rounded"
                          onClick={() => {
                            setFilters({...filters, porcentajeMin: '10', porcentajeMax: ''});
                          }}
                        >
                          ≥ 10%
                        </button>
                        <button 
                          className="text-xs bg-gray-100 hover:bg-gray-200 p-2 rounded"
                          onClick={() => {
                            setFilters({...filters, porcentajeMin: '', porcentajeMax: '5'});
                          }}
                        >
                          ≤ 5%
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-4">
                      <button 
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                        onClick={() => {
                          clearPorcentajeFilter();
                        }}
                      >
                        Limpiar
                      </button>
                      <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={() => toggleDropdown('porcentaje')}
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Applied Filters Display */}
        {getAppliedFiltersCount() > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {filters.fecha && (
              <div className="flex items-center bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-xs">
                <span>Fecha: {filters.fecha}</span>
                <button onClick={() => clearFilter('fecha')} className="ml-1">
                  <X size={14} />
                </button>
              </div>
            )}
            {filters.familia && (
              <div className="flex items-center bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-xs">
                <span>Familia: {filters.familia}</span>
                <button onClick={() => clearFilter('familia')} className="ml-1">
                  <X size={14} />
                </button>
              </div>
            )}
            {filters.linea && (
              <div className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs">
                <span>Línea: {filters.linea}</span>
                <button onClick={() => clearFilter('linea')} className="ml-1">
                  <X size={14} />
                </button>
              </div>
            )}
            {filters.concepto && (
              <div className="flex items-center bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-xs">
                <span>Buscar: {filters.concepto}</span>
                <button onClick={() => clearFilter('concepto')} className="ml-1">
                  <X size={14} />
                </button>
              </div>
            )}
            {(filters.porcentajeMin || filters.porcentajeMax) && (
              <div className="flex items-center bg-yellow-100 text-yellow-800 rounded-full px-3 py-1 text-xs">
                <span>
                  %: {filters.porcentajeMin || '0'} - {filters.porcentajeMax || '∞'}
                </span>
                <button onClick={clearPorcentajeFilter} className="ml-1">
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Desktop Table - Hidden on mobile */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-800 text-white text-sm">
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
                  <td className="border border-gray-300 px-2 py-1 text-sm">{row.semana}</td>
                  <td className="border border-gray-300 px-2 py-1 text-sm">{row.mes}</td>
                  <td className="border border-gray-300 px-2 py-1 text-sm">{row.dia}</td>
                  <td className="border border-gray-300 px-2 py-1 text-sm">{row.linea}</td>
                  <td className={`border border-gray-300 px-2 py-1 text-sm ${getBackgroundColor(row.oee)}`}>{row.oee}</td>
                  <td className="border border-gray-300 px-2 py-1 text-sm">{row.concepto}</td>
                  <td className="border border-gray-300 px-2 py-1 text-sm">{row.porcentaje !== null ? `${row.porcentaje}%` : ''}</td>
                  <td className="border border-gray-300 px-2 py-1 text-sm">{row.hrs}</td>
                  <td className="border border-gray-300 px-2 py-1 text-sm">{row.falla}</td>
                  <td className="border border-gray-300 px-2 py-1 text-sm">{row.comentario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Mobile-friendly card view - Visible only on mobile */}
        <div className="md:hidden">
          {filteredData.map((row, rowIndex) => (
            <div key={rowIndex} className="mb-3 border rounded-lg shadow-sm bg-white">
              {/* Card header */}
              <div 
                className="flex justify-between items-center p-3 cursor-pointer"
                onClick={() => toggleRowExpansion(rowIndex)}
              >
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{row.linea}</span>
                    <span className="text-gray-500 text-xs">{row.dia}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 truncate w-40">
                    {row.concepto}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`px-2 py-1 rounded text-xs ${getBackgroundColor(row.oee)}`}>
                    {row.oee}
                  </div>
                  {expandedRows[rowIndex] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
              </div>
              
              {/* Card expanded content */}
              {expandedRows[rowIndex] && (
                <div className="p-3 border-t">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="text-xs">
                      <div className="text-gray-500">Semana/Mes</div>
                      <div className="font-bold">{row.semana} / {row.mes}</div>
                    </div>
                    <div className="text-xs">
                      <div className="text-gray-500">Porcentaje</div>
                      <div className="font-bold">{row.porcentaje}%</div>
                    </div>
                    <div className="text-xs">
                      <div className="text-gray-500">Horas</div>
                      <div className="font-bold">{row.hrs}</div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-gray-500 text-xs mb-1">Falla</div>
                    <div className="text-sm font-medium">{row.falla}</div>
                  </div>
                  
                  {row.comentario && (
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Comentarios</div>
                      <div className="text-xs">{row.comentario}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {filteredData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron resultados con los filtros seleccionados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Report;