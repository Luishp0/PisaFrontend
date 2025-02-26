import React from 'react';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ComposedChart, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import Navbar from '../components/Navbar';
import NavbarReport from '../components/NavbarReport';
import { Download } from 'lucide-react';

// Componente de exportación a Excel
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
      className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
      title="Exportar a Excel"
    >
      <Download className="h-5 w-5 mr-2" />
      Exportar a Excel
    </button>
  );
};

const Grafica1 = () => {
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

  // Color mapping to match the image
  const colorMap = {
    fabricacion: '#4682B4',  // Blue
    ineficiencia: '#FFA07A', // Light Salmon
    cambiosLimpiezas: '#808080', // Gray
    proyectos: '#66BB6A',   // Green
    sinPrograma: '#FF7F50', // Coral
    diaFestivo: '#FFD700',  // Gold
    esperas: '#6495ED',     // Cornflower Blue
    otros: '#2E8B57'        // Sea Green
  };

  // Custom tooltip to show details
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow-md">
          <p className="font-bold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.fill }}>
              {entry.name}: {entry.value}
            </p>
          ))}
          {payload[0].payload.frascosPorDia && (
            <p className="text-yellow-500 font-bold">
              Frascos/día: {payload[0].payload.frascosPorDia.toFixed(2)}M
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <Navbar/>
      <div className="mx-auto p-4 max-w-6xl">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-center my-4">Reportes</h1>
          <ExportExcelButton 
            data={data} 
            filename="Reporte_Utilizacion_Lineas.xlsx" 
          />
        </div>
        <NavbarReport/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="border border-gray-300 rounded bg-white mb-2 p-2 flex justify-between items-center">
              <span>Familia</span>
              <button className="text-gray-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ul className="space-y-2">
              <li className="p-2 hover:bg-gray-200 cursor-pointer">Bolsas</li>
              <li className="p-2 hover:bg-gray-200 cursor-pointer">Ampoletas</li>
              <li className="p-2 hover:bg-gray-200 cursor-pointer">Flexoval</li>
            </ul>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="border border-gray-300 rounded bg-white mb-2 p-2 flex justify-between items-center">
              <span>Línea</span>
              <button className="text-gray-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ul className="space-y-2">
              <li className="p-2 hover:bg-gray-200 cursor-pointer">Línea 1</li>
              <li className="p-2 hover:bg-gray-200 cursor-pointer">Línea 2</li>
              <li className="p-2 hover:bg-gray-200 cursor-pointer">Línea 3</li>
            </ul>
          </div>
        </div>
        
        <h2 className="text-lg font-semibold text-center my-4">
          Utilización 10 Líneas de envase Flexoval
        </h2>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                domain={[0, 0.7]} 
                tickFormatter={(value) => `${value.toFixed(2)}M`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
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
                dot={{ r: 5 }} 
                activeDot={{ r: 8 }} 
                yAxisId="right" 
                name="Frascos por día"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Grafica1;