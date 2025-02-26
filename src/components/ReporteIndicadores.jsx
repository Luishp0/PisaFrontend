import React, { useState, useEffect } from 'react';
import { Calendar, Pencil, Trash2 } from 'lucide-react';

const ReporteIndicadores = () => {
  const [filters, setFilters] = useState({
    centro: 'P108',
    departamento: '801',
    linea: 'BOLSAS LINEA 1',
    proceso: 'DOSIFICADO',
    velocidad: '',
    fechaDesde: '2025-01-01',
    fechaHasta: '2025-01-30'
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos al iniciar
  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('YOUR_API_ENDPOINT/indicadores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(filters)
      });
      
      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }
      
      const data = await response.json();
      setResults(data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error al obtener los datos. Intente nuevamente.');
      // Datos de muestra para desarrollo
      setResults([
        {
          material: '4003179',
          orden: '12266177',
          lote: 'Q24E028',
          piezas: '0',
          nominales: '0',
          fecha: '2025-01-01',
          hora: '00:00',
          turno: 'C',
          ciclo: '60',
          peros: '60',
          rechazos: '0',
          proceso: 'DOSIFICADO'
        },
        // Más datos para las filas
        ...Array(9).fill(0).map((_, i) => ({
          material: '4003179',
          orden: '12266177',
          lote: 'Q24E028',
          piezas: '0',
          nominales: '0',
          fecha: '2025-01-01',
          hora: `0${i+1}:00`,
          turno: 'C',
          ciclo: '60',
          peros: '60',
          rechazos: '0',
          proceso: 'DOSIFICADO'
        }))
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleEdit = (row) => {
    // Lógica para editar
    console.log('Edit row:', row);
  };
  
  const handleDelete = (row) => {
    // Lógica para eliminar
    console.log('Delete row:', row);
  };

  const handleReset = () => {
    setFilters({
      centro: '',
      departamento: '',
      linea: '',
      proceso: '',
      velocidad: '',
      fechaDesde: '',
      fechaHasta: ''
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Reporte de indicadores</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Reporte de Indicadores</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Centro</label>
              <select 
                name="centro" 
                value={filters.centro} 
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="P108">P108</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Departamento</label>
              <select 
                name="departamento" 
                value={filters.departamento} 
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="801">801</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Línea</label>
              <select 
                name="linea" 
                value={filters.linea} 
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="BOLSAS LINEA 1">BOLSAS LINEA 1</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Proceso</label>
              <select 
                name="proceso" 
                value={filters.proceso} 
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="DOSIFICADO">DOSIFICADO</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Velocidad</label>
              <select 
                name="velocidad" 
                value={filters.velocidad} 
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar...</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Desde</label>
              <div className="relative">
                <input
                  type="date"
                  name="fechaDesde"
                  value={filters.fechaDesde}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="absolute right-3 top-2 text-gray-400" size={20} />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Hasta</label>
              <div className="relative">
                <input
                  type="date"
                  name="fechaHasta"
                  value={filters.fechaHasta}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="absolute right-3 top-2 text-gray-400" size={20} />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
              style={{
                backgroundColor: '#2563EB', // Azul más vibrante
                fontWeight: '500'
              }}
            >
              OBTENER INFORMACIÓN
            </button>
            <button 
              type="button" 
              onClick={handleReset}
              className="bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 px-6 border border-gray-300 rounded-md shadow-sm transition duration-200"
              
            >
              INICIALIZAR PARÁMETROS
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Resultados</h2>
        
        {loading ? (
          <div className="text-center py-8">Cargando datos...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orden</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lote</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Piezas</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominales</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turno</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciclo</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peros</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rechazos</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proceso</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {results.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{row.material}</td>
                    <td className="py-3 px-4 text-sm">{row.orden}</td>
                    <td className="py-3 px-4 text-sm">{row.lote}</td>
                    <td className="py-3 px-4 text-sm">{row.piezas}</td>
                    <td className="py-3 px-4 text-sm">{row.nominales}</td>
                    <td className="py-3 px-4 text-sm">{row.fecha}</td>
                    <td className="py-3 px-4 text-sm">{row.hora}</td>
                    <td className="py-3 px-4 text-sm">{row.turno}</td>
                    <td className="py-3 px-4 text-sm">{row.ciclo}</td>
                    <td className="py-3 px-4 text-sm">{row.peros}</td>
                    <td className="py-3 px-4 text-sm">{row.rechazos}</td>
                    <td className="py-3 px-4 text-sm">{row.proceso}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(row)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(row)}
                          className="text-red-600 hover:text-red-800"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReporteIndicadores;