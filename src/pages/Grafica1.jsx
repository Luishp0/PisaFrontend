import React, { useState } from 'react';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ComposedChart, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import Navbar from '../components/Navbar';
import NavbarReport from '../components/NavbarReport';
import { Download, Calendar, Filter, X, CheckSquare } from 'lucide-react';

// Componente de exportación a Excel mejorado
const ExportExcelButton = ({ data, filename = 'exported_data.xlsx' }) => {
  const exportToExcel = () => {
    // Crear un nuevo libro de trabajo
    const workbook = XLSX.utils.book_new();
    
    // Convertir los datos a una hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    
    // Exportar el archivo
    XLSX.writeFile(workbook, filename);
  };

  return (
    <button 
      onClick={exportToExcel} 
      className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200 shadow-md"
      title="Exportar a Excel"
    >
      <Download className="h-5 w-5 mr-2" />
      Exportar a Excel
    </button>
  );
};

const FilterDropdown = ({ title, options, selected, onSelect, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div className="border border-gray-300 rounded-md bg-white p-3 flex justify-between items-center cursor-pointer shadow-sm" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center">
          <Filter className="h-4 w-4 text-gray-500 mr-2" />
          <span className="font-medium">{title}</span>
        </div>
        <div className="flex items-center">
          {selected && selected.length > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full mr-2">
              {selected.length}
            </span>
          )}
          {isOpen ? (
            <X className="h-4 w-4 text-gray-500" />
          ) : (
            <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="p-2 border-b border-gray-200 flex justify-between items-center">
            <span className="text-sm font-medium">Seleccionar {title.toLowerCase()}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Limpiar
            </button>
          </div>
          <ul className="max-h-60 overflow-y-auto py-1">
            {options.map((option, index) => (
              <li 
                key={index} 
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(option);
                }}
              >
                {selected && selected.includes(option) ? (
                  <CheckSquare className="h-4 w-4 text-blue-600 mr-2" />
                ) : (
                  <div className="h-4 w-4 border border-gray-300 rounded mr-2"></div>
                )}
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const DateRangePicker = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  return (
    <div className="border border-gray-300 rounded-md bg-white p-3 shadow-sm">
      <div className="flex items-center mb-2">
        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
        <span className="font-medium">Rango de fechas</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Desde</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Hasta</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

const Grafica1 = () => {
  // Estados para los filtros
  const [selectedFamilias, setSelectedFamilias] = useState([]);
  const [selectedLineas, setSelectedLineas] = useState([]);
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-01-31');

  // Options for filters
  const familiaOptions = ['Bolsas', 'Ampoletas', 'Flexoval'];
  const lineaOptions = ['Línea 1', 'Línea 2', 'Línea 3', 'Línea 4', 'Línea 5'];

  // Data matching the image
  const data = [
    {
      name: 'Septiembre',
      fabricacion: 99,
      ineficiencia: 21,
      cambiosLimpiezas: 9,
      proyectos: 0,
      sinPrograma: 0,
      diaFestivo: 9,
      esperas: 96,
      otros: 1,
      frascosPorDia: 0.59,
    },
    {
      name: 'Octubre',
      fabricacion: 96,
      ineficiencia: 16,
      cambiosLimpiezas: 9,
      proyectos: 15,
      sinPrograma: 0,
      diaFestivo: 9,
      esperas: 89,
      otros: 1,
      frascosPorDia: 0.54,
    },
    {
      name: 'Noviembre',
      fabricacion: 82,
      ineficiencia: 14,
      cambiosLimpiezas: 9,
      proyectos: 56,
      sinPrograma: 0,
      diaFestivo: 6,
      esperas: 65,
      otros: 1,
      frascosPorDia: 0.55,
    },
    {
      name: 'Sem 47',
      fabricacion: 90,
      ineficiencia: 18,
      cambiosLimpiezas: 7,
      proyectos: 0,
      sinPrograma: 8,
      diaFestivo: 24,
      esperas: 91,
      otros: 0,
      frascosPorDia: 0.48,
    },
    {
      name: 'Sem 48',
      fabricacion: 97,
      ineficiencia: 25,
      cambiosLimpiezas: 14,
      proyectos: 4,
      sinPrograma: 0,
      diaFestivo: 0,
      esperas: 92,
      otros: 2,
      frascosPorDia: 0.54,
    },
    {
      name: 'Sem 49',
      fabricacion: 94,
      ineficiencia: 20,
      cambiosLimpiezas: 9,
      proyectos: 25,
      sinPrograma: 0,
      diaFestivo: 0,
      esperas: 88,
      otros: 2,
      frascosPorDia: 0.54,
    },
    {
      name: 'Sem 50',
      fabricacion: 84,
      ineficiencia: 18,
      cambiosLimpiezas: 10,
      proyectos: 12,
      sinPrograma: 5,
      diaFestivo: 0,
      esperas: 109,
      otros: 0,
      frascosPorDia: 0.47,
    },
    {
      name: 'Lunes',
      fabricacion: 240,
      ineficiencia: 0,
      cambiosLimpiezas: 0,
      proyectos: 0,
      sinPrograma: 0,
      diaFestivo: 0,
      esperas: 0,
      otros: 0,
      frascosPorDia: 0.65,
    },
    {
      name: 'Martes',
      fabricacion: 240,
      ineficiencia: 0,
      cambiosLimpiezas: 0,
      proyectos: 0,
      sinPrograma: 0,
      diaFestivo: 0,
      esperas: 0,
      otros: 0,
      frascosPorDia: 0.60,
    }
  ];
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-300 rounded-md shadow-lg">
        <p className="font-bold text-gray-800 mb-1">{label}</p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center">
              <div className="w-3 h-3 mr-2" style={{ backgroundColor: entry.fill }}></div>
              <span className="text-sm">{entry.name}: <span className="font-semibold">{entry.value}</span></span>
            </div>
          ))}
        </div>
        {payload[0].payload.frascosPorDia && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-yellow-600 font-bold text-sm">
              Frascos/día: {payload[0].payload.frascosPorDia.toFixed(2)}M
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const handleFamiliaSelect = (familia) => {
  if (selectedFamilias.includes(familia)) {
    setSelectedFamilias(selectedFamilias.filter(f => f !== familia));
  } else {
    setSelectedFamilias([...selectedFamilias, familia]);
  }
};

const handleLineaSelect = (linea) => {
  if (selectedLineas.includes(linea)) {
    setSelectedLineas(selectedLineas.filter(l => l !== linea));
  } else {
    setSelectedLineas([...selectedLineas, linea]);
  }
};

const colorMap = {
  fabricacion: '#4682B4', // Blue
  ineficiencia: '#FFA07A', // Light Salmon
  cambiosLimpiezas: '#808080', // Gray
  proyectos: '#66BB6A',   // Green
  sinPrograma: '#FF7F50', // Coral
  diaFestivo: '#FFD700',  // Gold
  esperas: '#6495ED',     // Cornflower Blue
  otros: '#2E8B57'        // Sea Green
};




  // Apply filters button
  const handleApplyFilters = () => {
    console.log('Aplicando filtros:', {
      familias: selectedFamilias,
      lineas: selectedLineas,
      fechaInicio: startDate,
      fechaFin: endDate
    });
    // Aquí iría la lógica para filtrar los datos según los criterios seleccionados
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar/>
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Reportes de Utilización</h1>
          <ExportExcelButton 
            data={data} 
            filename="Reporte_Utilizacion_Lineas.xlsx" 
          />
        </div>
        
        <NavbarReport/>
        
        {/* Filtros mejorados */}
        <div className="bg-white rounded-lg shadow-md p-5 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FilterDropdown 
              title="Familia" 
              options={familiaOptions}
              selected={selectedFamilias}
              onSelect={handleFamiliaSelect}
              onClear={() => setSelectedFamilias([])}
            />
            
            <FilterDropdown 
              title="Línea" 
              options={lineaOptions}
              selected={selectedLineas}
              onSelect={handleLineaSelect}
              onClear={() => setSelectedLineas([])}
            />
            
            <DateRangePicker 
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          </div>
          
          <div className="mt-4 flex justify-end">
            <button 
              onClick={handleApplyFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 shadow-md"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
        
        {/* Título del gráfico */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Utilización 10 Líneas de envase Flexoval
          </h2>
          
          {/* Indicadores de filtros aplicados */}
          <div className="flex space-x-2">
            {selectedFamilias.length > 0 && (
              <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                Familias: {selectedFamilias.length}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => setSelectedFamilias([])} 
                />
              </div>
            )}
            
            {selectedLineas.length > 0 && (
              <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                Líneas: {selectedLineas.length}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => setSelectedLineas([])} 
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Gráfico principal */}
        <div className="bg-white p-5 rounded-lg shadow-md mb-6">
          <ResponsiveContainer width="100%" height={450}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis 
                yAxisId="left" 
                orientation="left" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}h`}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                domain={[0, 0.7]} 
                tickFormatter={(value) => `${value.toFixed(2)}M`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ fontSize: 12 }}
              />
              <Bar dataKey="fabricacion" stackId="a" yAxisId="left" fill={colorMap.fabricacion} name="Fabricación" />
              <Bar dataKey="ineficiencia" stackId="a" yAxisId="left" fill={colorMap.ineficiencia} name="Ineficiencia" />
              <Bar dataKey="cambiosLimpiezas" stackId="a" yAxisId="left" fill={colorMap.cambiosLimpiezas} name="Cambios y limpiezas" />
              <Bar dataKey="proyectos" stackId="a" yAxisId="left" fill={colorMap.proyectos} name="Proyectos" />
              <Bar dataKey="sinPrograma" stackId="a" yAxisId="left" fill={colorMap.sinPrograma} name="Sin Programa" />
              <Bar dataKey="diaFestivo" stackId="a" yAxisId="left" fill={colorMap.diaFestivo} name="Día festivo" />
              <Bar dataKey="esperas" stackId="a" yAxisId="left" fill={colorMap.esperas} name="Esperas" />
              <Bar dataKey="otros" stackId="a" yAxisId="left" fill={colorMap.otros} name="Otros" />
              <Line 
                type="monotone" 
                dataKey="frascosPorDia" 
                stroke="#FFD700" 
                strokeWidth={3} 
                dot={{ r: 5, fill: "#FFD700", stroke: "#FFD700" }} 
                activeDot={{ r: 8 }} 
                yAxisId="right" 
                name="Frascos por día (M)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* Resumen de datos */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Resumen de datos</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Período</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fabricación</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ineficiencia</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cambios y limpiezas</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frascos/día</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.fabricacion}h</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.ineficiencia}h</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.cambiosLimpiezas}h</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.frascosPorDia.toFixed(2)}M</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grafica1;