import React, { useState } from 'react';
import { Calendar, Filter, FileSpreadsheet,  ChevronRight, ChevronDown, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import NavbarReport from '../components/NavbarReport';

const ReportCompliance = () => {
  // State for filters
  const [dateFilter, setDateFilter] = useState('');
  const [lineFilter, setLineFilter] = useState('');
  const [complianceFilter, setComplianceFilter] = useState('');
  const [rootCauseFilter, setRootCauseFilter] = useState('');
  
  // State for dropdown visibility
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showLineDropdown, setShowLineDropdown] = useState(false);
  const [showComplianceDropdown, setShowComplianceDropdown] = useState(false);
  const [showRootCauseDropdown, setShowRootCauseDropdown] = useState(false);
  
  // State for expanded rows in mobile view
  const [expandedRows, setExpandedRows] = useState({});
  
  // Sample data for filters
  const dateOptions = ['29-ene', '30-ene', '31-ene', '01-feb'];
  const lineOptions = ['5A', '6A', '8A', '1E', '2E', '10E'];
  const complianceOptions = ['Alto (>85%)', 'Medio (75-85%)', 'Bajo (<75%)'];
  const rootCauseOptions = ['Falta de Carros', 'Ajuste Frasco', 'Falla troqueladora', 'Sistema electrico'];
  
  // Sample data for the table
  const tableData = [
    {
      linea: '5A',
      fecha: '29-ene',
      planPVO: 108000,
      realPVO: 88130,
      cumplimiento: 82,
      oeeDiario: 80.9,
      tiempoParo1: 40,
      tiempoParo2: 20,
      tiempoParo3: '-',
      comentarios: [
        '1.- Falta de Carros (Sistema Automatizado)',
        '2.- Ajuste Frasco caído'
      ]
    },
    {
      linea: '6A',
      fecha: '31-ene',
      planPVO: 108000,
      realPVO: 85110,
      cumplimiento: 79,
      oeeDiario: 78.3,
      tiempoParo1: 40,
      tiempoParo2: 35,
      tiempoParo3: 26,
      comentarios: [
        '1.- Falta de carros (Sistema Automatizado)',
        '2.- Ajuste Falla troqueladora derecha',
        '3.- Ajuste Frasco Caido'
      ]
    },
    {
      linea: '8A',
      fecha: '01-feb',
      planPVO: 251280,
      realPVO: 155611,
      cumplimiento: 62,
      oeeDiario: 61.0,
      tiempoParo1: 330,
      tiempoParo2: 69,
      tiempoParo3: 66,
      comentarios: [
        '1.-Frasco pegado en molde',
        '2.-Inspeccion de frasco',
        '3.-Falla en rascador'
      ]
    },
    {
      linea: '1E',
      fecha: '30-ene',
      planPVO: 172800,
      realPVO: 114254,
      cumplimiento: 66,
      oeeDiario: 0.0,
      tiempoParo1: 101,
      tiempoParo2: 49,
      tiempoParo3: 49,
      comentarios: [
        '1.- Falta de Carros (Cambio de Sector)',
        '2.- Ajuste Falla pinza Gripper Mirror B',
        '3.- Ajuste Se baja tanque colchon'
      ]
    },
    {
      linea: '2E',
      fecha: '30-ene',
      planPVO: 112800,
      realPVO: 72250,
      cumplimiento: 64,
      oeeDiario: 66.2,
      tiempoParo1: 214,
      tiempoParo2: 100,
      tiempoParo3: 56,
      comentarios: [
        '1.-Falta de carros por revision de frasco',
        '2.-Cuello debil de frasco',
        '3.-Fisura de cabeza de frasco'
      ]
    },
    {
      linea: '10E',
      fecha: '30-ene',
      planPVO: 192010,
      realPVO: 170646,
      cumplimiento: 89,
      oeeDiario: 88.0,
      tiempoParo1: 54,
      tiempoParo2: 20,
      tiempoParo3: 20,
      comentarios: [
        '1.-Perdida de velocidad',
        '2.-Sistema electrico robot #1',
        '3.-Limpieza de boquillas'
      ]
    }
  ];
  
  // Calculate totals
  const totalPlanPVO = tableData.reduce((acc, row) => acc + row.planPVO, 0);
  const totalRealPVO = tableData.reduce((acc, row) => acc + row.realPVO, 0);
  const totalCumplimiento = Math.round((totalRealPVO / totalPlanPVO) * 100);
  
  // Helper function to determine cell background color based on value
  const getCumplimientoColor = (value) => {
    if (value >= 85) return 'bg-green-200';
    if (value >= 75) return 'bg-yellow-200';
    return 'bg-red-200';
  };
  
  // Function to handle filter selection
  const selectDate = (option) => {
    setDateFilter(option);
    setShowDatePicker(false);
  };
  
  const selectLine = (option) => {
    setLineFilter(option);
    setShowLineDropdown(false);
  };
  
  const selectCompliance = (option) => {
    setComplianceFilter(option);
    setShowComplianceDropdown(false);
  };
  
  const selectRootCause = (option) => {
    setRootCauseFilter(option);
    setShowRootCauseDropdown(false);
  };
  
  // Function to show applied filters
  const getAppliedFiltersCount = () => {
    let count = 0;
    if (dateFilter) count++;
    if (lineFilter) count++;
    if (complianceFilter) count++;
    if (rootCauseFilter) count++;
    return count;
  };
  
  const clearDateFilter = () => {
    setDateFilter('');
  };
  
  const clearLineFilter = () => {
    setLineFilter('');
  };
  
  const clearComplianceFilter = () => {
    setComplianceFilter('');
  };
  
  const clearRootCauseFilter = () => {
    setRootCauseFilter('');
  };
  
  // Toggle row expansion for mobile view
  const toggleRowExpansion = (index) => {
    setExpandedRows({
      ...expandedRows,
      [index]: !expandedRows[index]
    });
  };
  
  // Filter the table data based on selected filters
  const filteredData = tableData.filter(row => {
    // Filter by date
    if (dateFilter !== '' && row.fecha !== dateFilter) {
      return false;
    }
    
    // Filter by line
    if (lineFilter !== '' && row.linea !== lineFilter) {
      return false;
    }
    
    // Filter by compliance range
    if (complianceFilter !== '') {
      if (complianceFilter === 'Alto (>85%)' && row.cumplimiento <= 85) {
        return false;
      } else if (complianceFilter === 'Medio (75-85%)' && (row.cumplimiento < 75 || row.cumplimiento > 85)) {
        return false;
      } else if (complianceFilter === 'Bajo (<75%)' && row.cumplimiento >= 75) {
        return false;
      }
    }
    
    // Filter by root cause
    if (rootCauseFilter !== '') {
      // Check if any of the comments contain the root cause text
      const hasRootCause = row.comentarios.some(comment => 
        comment.toLowerCase().includes(rootCauseFilter.toLowerCase())
      );
      if (!hasRootCause) {
        return false;
      }
    }
    
    return true;
  });
  
  // Mock function to export to Excel
  const exportToExcel = () => {
    alert('Exportando a Excel...');
    // In a real implementation, you would use a library like xlsx
    // to generate and download an Excel file
  };
  
  // Close any open dropdowns
  const closeAllDropdowns = () => {
    setShowDatePicker(false);
    setShowLineDropdown(false);
    setShowComplianceDropdown(false);
    setShowRootCauseDropdown(false);
  };
  
  // Handle clicks outside the dropdown areas
  const handleClickOutside = () => {
    closeAllDropdowns();
  };
  
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-2 py-4 w-full min-h-screen" onClick={handleClickOutside}>
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Reportes</h1>
          
          {/* Excel Export Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              exportToExcel();
            }}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm sm:text-base"
          >
            <FileSpreadsheet size={18} />
            <span className="hidden sm:inline">Exportar a Excel</span>
          </button>
        </div>

        <NavbarReport />
        
        {/* Filters - Scrollable on mobile */}
        <div className="flex overflow-x-auto pb-2 gap-2 mb-4 mt-4 hide-scrollbar">
          {/* Date Filter */}
          <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center border rounded-lg p-2 bg-white">
              <span className="mr-2 text-xs sm:text-sm">Fecha</span>
              <input 
                type="text" 
                className="outline-none w-16 text-xs sm:text-sm" 
                placeholder="Fecha" 
                value={dateFilter}
                readOnly
                onClick={() => {
                  setShowDatePicker(!showDatePicker);
                  setShowLineDropdown(false);
                  setShowComplianceDropdown(false);
                  setShowRootCauseDropdown(false);
                }}
              />
              {dateFilter && (
                <button onClick={clearDateFilter} className="ml-1">
                  <X size={16} />
                </button>
              )}
              <Calendar size={16} className="ml-1" />
            </div>
            
            {showDatePicker && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
                <div className="relative bg-white rounded-lg shadow-xl w-64 max-w-full m-4">
                  <div className="flex justify-between items-center p-3 border-b">
                    <h3 className="font-medium">Seleccionar fecha</h3>
                    <button onClick={() => setShowDatePicker(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  <div className="p-2 max-h-60 overflow-y-auto">
                    {dateOptions.map((option, index) => (
                      <div 
                        key={index} 
                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => selectDate(option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Line Filter */}
          <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center border rounded-lg p-2 bg-white">
              <span className="text-purple-700 mr-2 text-xs">Línea</span>
              <input 
                type="text" 
                className="outline-none w-10 text-xs sm:text-sm" 
                placeholder="Línea" 
                value={lineFilter}
                readOnly
                onClick={() => {
                  setShowLineDropdown(!showLineDropdown);
                  setShowDatePicker(false);
                  setShowComplianceDropdown(false);
                  setShowRootCauseDropdown(false);
                }}
              />
              {lineFilter && (
                <button onClick={clearLineFilter} className="ml-1">
                  <X size={16} />
                </button>
              )}
              <Filter size={16} className="ml-1" />
            </div>
            
            {showLineDropdown && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
                <div className="relative bg-purple-50 rounded-lg shadow-xl w-64 max-w-full m-4">
                  <div className="flex justify-between items-center p-3 border-b bg-purple-100">
                    <h3 className="font-medium text-purple-800">Seleccionar línea</h3>
                    <button onClick={() => setShowLineDropdown(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  <div className="p-2 max-h-60 overflow-y-auto">
                    {lineOptions.map((option, index) => (
                      <div 
                        key={index} 
                        className="p-2 hover:bg-purple-100 cursor-pointer text-sm"
                        onClick={() => selectLine(option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Compliance Filter */}
          <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center border rounded-lg p-2 bg-white">
              <span className="text-blue-700 mr-2 text-xs">Cumplimiento</span>
              <input 
                type="text" 
                className="outline-none w-20 sm:w-28 text-xs sm:text-sm" 
                placeholder="Cumplimiento" 
                value={complianceFilter}
                readOnly
                onClick={() => {
                  setShowComplianceDropdown(!showComplianceDropdown);
                  setShowDatePicker(false);
                  setShowLineDropdown(false);
                  setShowRootCauseDropdown(false);
                }}
              />
              {complianceFilter && (
                <button onClick={clearComplianceFilter} className="ml-1">
                  <X size={16} />
                </button>
              )}
              <Filter size={16} className="ml-1" />
            </div>
            
            {showComplianceDropdown && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
                <div className="relative bg-blue-50 rounded-lg shadow-xl w-64 max-w-full m-4">
                  <div className="flex justify-between items-center p-3 border-b bg-blue-100">
                    <h3 className="font-medium text-blue-800">Seleccionar cumplimiento</h3>
                    <button onClick={() => setShowComplianceDropdown(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  <div className="p-2 max-h-60 overflow-y-auto">
                    {complianceOptions.map((option, index) => (
                      <div 
                        key={index} 
                        className="p-2 hover:bg-blue-100 cursor-pointer text-sm"
                        onClick={() => selectCompliance(option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Root Cause Filter */}
          <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center border rounded-lg p-2 bg-white">
              <span className="text-red-700 mr-2 text-xs">Causa Raíz</span>
              <input 
                type="text" 
                className="outline-none w-20 sm:w-36 text-xs sm:text-sm" 
                placeholder="Causa Raíz" 
                value={rootCauseFilter}
                readOnly
                onClick={() => {
                  setShowRootCauseDropdown(!showRootCauseDropdown);
                  setShowDatePicker(false);
                  setShowLineDropdown(false);
                  setShowComplianceDropdown(false);
                }}
              />
              {rootCauseFilter && (
                <button onClick={clearRootCauseFilter} className="ml-1">
                  <X size={16} />
                </button>
              )}
              <Filter size={16} className="ml-1" />
            </div>
            
            {showRootCauseDropdown && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
                <div className="relative bg-red-50 rounded-lg shadow-xl w-64 max-w-full m-4">
                  <div className="flex justify-between items-center p-3 border-b bg-red-100">
                    <h3 className="font-medium text-red-800">Seleccionar causa raíz</h3>
                    <button onClick={() => setShowRootCauseDropdown(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  <div className="p-2 max-h-60 overflow-y-auto">
                    {rootCauseOptions.map((option, index) => (
                      <div 
                        key={index} 
                        className="p-2 hover:bg-red-100 cursor-pointer text-sm"
                        onClick={() => selectRootCause(option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Applied Filters Display */}
        {getAppliedFiltersCount() > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 mt-1">
            {dateFilter && (
              <div className="flex items-center bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-xs">
                <span>Fecha: {dateFilter}</span>
                <button onClick={clearDateFilter} className="ml-1">
                  <X size={14} />
                </button>
              </div>
            )}
            {lineFilter && (
              <div className="flex items-center bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-xs">
                <span>Línea: {lineFilter}</span>
                <button onClick={clearLineFilter} className="ml-1">
                  <X size={14} />
                </button>
              </div>
            )}
            {complianceFilter && (
              <div className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs">
                <span>Cumplimiento: {complianceFilter}</span>
                <button onClick={clearComplianceFilter} className="ml-1">
                  <X size={14} />
                </button>
              </div>
            )}
            {rootCauseFilter && (
              <div className="flex items-center bg-red-100 text-red-800 rounded-full px-3 py-1 text-xs">
                <span>Causa Raíz: {rootCauseFilter}</span>
                <button onClick={clearRootCauseFilter} className="ml-1">
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Totals - Responsive grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mb-2 text-center font-bold">
          <div className="bg-white border py-2 text-xs sm:text-sm">
            <div className="md:hidden text-gray-500 mb-1">Plan PVO</div>
            {totalPlanPVO.toLocaleString()}
          </div>
          <div className="bg-white border py-2 text-xs sm:text-sm">
            <div className="md:hidden text-gray-500 mb-1">Real PVO</div>
            {totalRealPVO.toLocaleString()}
          </div>
          <div className={`${getCumplimientoColor(totalCumplimiento)} border py-2 text-xs sm:text-sm`}>
            <div className="md:hidden text-gray-500 mb-1">Cumplimiento</div>
            {totalCumplimiento}%
          </div>
          <div className="bg-red-200 border py-2 text-xs sm:text-sm">
            <div className="md:hidden text-gray-500 mb-1">OEE Promedio</div>
            62.4%
          </div>
        </div>
        
        {/* Desktop Table - Hidden on mobile */}
        <div className="hidden md:block overflow-x-auto w-full shadow-md rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border p-2 text-left whitespace-nowrap text-sm">Línea</th>
                <th className="border p-2 text-center whitespace-nowrap text-sm">Fecha</th>
                <th className="border p-2 text-center whitespace-nowrap text-sm">Plan PVO</th>
                <th className="border p-2 text-center whitespace-nowrap text-sm">Real PVO</th>
                <th className="border p-2 text-center whitespace-nowrap text-sm">Cumplimiento</th>
                <th className="border p-2 text-center whitespace-nowrap text-sm">OEE DIARIO</th>
                <th className="border p-2 text-center whitespace-nowrap text-sm">T. Paro 1er</th>
                <th className="border p-2 text-center whitespace-nowrap text-sm">T. Paro 2do</th>
                <th className="border p-2 text-center whitespace-nowrap text-sm">T. Paro 3ero</th>
                <th className="border p-2 text-left text-sm">Comentarios / Causa Raíz</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, rowIndex) => (
                <tr key={rowIndex} className="border hover:bg-gray-50">
                  <td className="border px-2 py-2 text-sm">{row.linea}</td>
                  <td className="border px-2 py-2 text-center text-sm">{row.fecha}</td>
                  <td className="border px-2 py-2 text-center text-sm">{row.planPVO.toLocaleString()}</td>
                  <td className="border px-2 py-2 text-center text-sm">{row.realPVO.toLocaleString()}</td>
                  <td className={`border px-2 py-2 text-center text-sm ${getCumplimientoColor(row.cumplimiento)}`}>
                    {row.cumplimiento}%
                  </td>
                  <td className={`border px-2 py-2 text-center text-sm ${getCumplimientoColor(row.oeeDiario)}`}>
                    {row.oeeDiario}%
                  </td>
                  <td className="border px-2 py-2 text-center text-sm">{row.tiempoParo1}</td>
                  <td className="border px-2 py-2 text-center text-sm">{row.tiempoParo2}</td>
                  <td className="border px-2 py-2 text-center text-sm">{row.tiempoParo3}</td>
                  <td className="border px-2 py-2 text-sm">
                    {row.comentarios.map((comment, i) => (
                      <div key={i} className="py-0.5">{comment}</div>
                    ))}
                  </td>
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
                <div className="flex items-center space-x-2">
                  <span className="font-bold">{row.linea}</span>
                  <span className="text-gray-500 text-sm">{row.fecha}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`px-2 py-1 rounded-full text-xs ${getCumplimientoColor(row.cumplimiento)}`}>
                    {row.cumplimiento}%
                  </div>
                  {expandedRows[rowIndex] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
              </div>
              
              {/* Card expanded content */}
              {expandedRows[rowIndex] && (
                <div className="p-3 border-t">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="text-xs">
                      <div className="text-gray-500">Plan PVO</div>
                      <div className="font-bold">{row.planPVO.toLocaleString()}</div>
                    </div>
                    <div className="text-xs">
                      <div className="text-gray-500">Real PVO</div>
                      <div className="font-bold">{row.realPVO.toLocaleString()}</div>
                    </div>
                    <div className="text-xs">
                      <div className="text-gray-500">OEE Diario</div>
                      <div className={`font-bold ${getCumplimientoColor(row.oeeDiario)}`}>
                        {row.oeeDiario}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-gray-500 text-xs mb-1">Tiempos de Paro</div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="text-gray-500">1er</div>
                        <div className="font-medium">{row.tiempoParo1}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">2do</div>
                        <div className="font-medium">{row.tiempoParo2}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">3ero</div>
                        <div className="font-medium">{row.tiempoParo3}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Comentarios / Causa Raíz</div>
                    <div className="text-xs space-y-1">
                      {row.comentarios.map((comment, i) => (
                        <div key={i} className="py-0.5">{comment}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};



export default ReportCompliance;