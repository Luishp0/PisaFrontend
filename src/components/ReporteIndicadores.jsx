import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Pencil, Trash2 } from 'lucide-react';

const ReporteIndicadores = () => {
  // Estados para almacenar los datos de catálogos
  const [centros, setCentros] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [lineas, setLineas] = useState([]);
  const [procesos, setProcesos] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estado para almacenar los filtros seleccionados
  const [filtros, setFiltros] = useState({
    centro: '',
    departamento: '',
    linea: '',
    proceso: '',
    fechaDesde: '',
    fechaHasta: ''
  });

  // URL base para las peticiones API
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  // Función para cargar los catálogos desde la API, envuelta en useCallback
  const cargarCatalogos = useCallback(async () => {
    try {
      // Cargar catálogo de centros
      const responseCentros = await fetch(`${API_URL}/catalogoCentro`);
      if (!responseCentros.ok) {
        throw new Error('Error al cargar centros');
      }
      const datosCentros = await responseCentros.json();
      setCentros(datosCentros);

      // Cargar catálogo de departamentos
      const responseDepartamentos = await fetch(`${API_URL}/catalogoDepartamento`);
      if (!responseDepartamentos.ok) {
        throw new Error('Error al cargar departamentos');
      }
      const datosDepartamentos = await responseDepartamentos.json();
      setDepartamentos(datosDepartamentos);

      // Cargar catálogo de líneas
      const responseLineas = await fetch(`${API_URL}/catalogoLinea`);
      if (!responseLineas.ok) {
        throw new Error('Error al cargar líneas');
      }
      const datosLineas = await responseLineas.json();
      setLineas(datosLineas);

      // Cargar catálogo de procesos
      const responseProcesos = await fetch(`${API_URL}/catalogoProceso`);
      if (!responseProcesos.ok) {
        throw new Error('Error al cargar procesos');
      }
      const datosProcesos = await responseProcesos.json();
      setProcesos(datosProcesos);
      
    } catch (error) {
      console.error('Error al cargar catálogos:', error);
      setError('Error al cargar los catálogos. Por favor, intente de nuevo.');
    }
  }, [API_URL]); // Dependencia de API_URL

  // Cargar catálogos al montar el componente
  useEffect(() => {
    cargarCatalogos();
  }, [cargarCatalogos]); // Incluimos cargarCatalogos como dependencia

  // Función para manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prevFiltros => ({
      ...prevFiltros,
      [name]: value
    }));
  };

  // Función para obtener datos filtrados del nuevo endpoint
  const obtenerResultados = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Construir query string con los filtros
      let queryParams = new URLSearchParams();
      
      if (filtros.centro) queryParams.append('centro', filtros.centro);
      if (filtros.departamento) queryParams.append('departamento', filtros.departamento);
      if (filtros.linea) queryParams.append('linea', filtros.linea);
      if (filtros.proceso) queryParams.append('proceso', filtros.proceso);
      if (filtros.fechaDesde) queryParams.append('fechaDesde', filtros.fechaDesde);
      if (filtros.fechaHasta) queryParams.append('fechaHasta', filtros.fechaHasta);
      
      // Llamar al nuevo endpoint que maneja todo el filtrado en el backend
      const response = await fetch(`${API_URL}/reporteIndicadores?${queryParams}`);
      if (!response.ok) {
        throw new Error('Error al obtener datos filtrados');
      }
      
      const datos = await response.json();
      setResultados(datos);
      
    } catch (error) {
      console.error('Error al obtener resultados:', error);
      setError('Error al obtener los resultados. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Funciones para acciones en la tabla
  const handleEditar = (registro) => {
    console.log('Editar registro:', registro);
    // Aquí puedes implementar la lógica para editar un registro
  };

  const handleEliminar = async (registro) => {
    if (!window.confirm('¿Está seguro que desea eliminar este registro?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/produccion/${registro.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar el registro');
      }
      
      // Actualizar lista de resultados eliminando el registro
      setResultados(prevResultados => 
        prevResultados.filter(r => r.id !== registro.id)
      );
      
      alert('Registro eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar el registro');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Reporte de Indicadores</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Filtros</h2>
        
        <form onSubmit={obtenerResultados}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Centro</label>
              <select 
                name="centro" 
                value={filtros.centro}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar centro</option>
                {centros.map(centro => (
                  <option key={centro._id} value={centro._id}>
                    {centro.nombreCentroCatalogo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Departamento</label>
              <select 
                name="departamento" 
                value={filtros.departamento}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar departamento</option>
                {departamentos.map(depto => (
                  <option key={depto._id} value={depto._id}>
                    {depto.nombreDepartamentoCatalogo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Línea</label>
              <select 
                name="linea" 
                value={filtros.linea}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar línea</option>
                {lineas.map(linea => (
                  <option key={linea._id} value={linea._id}>
                    {linea.nombreLineaCatalogo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Proceso</label>
              <select 
                name="proceso" 
                value={filtros.proceso}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar proceso</option>
                {procesos.map(proceso => (
                  <option key={proceso._id} value={proceso._id}>
                    {proceso.nombreProcesoCatalogo}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2 text-gray-700">Desde</label>
              <div className="relative">
                <input
                  type="date"
                  name="fechaDesde"
                  value={filtros.fechaDesde}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-2 text-gray-700">Hasta</label>
              <div className="relative">
                <input
                  type="date"
                  name="fechaHasta"
                  value={filtros.fechaHasta}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-8 rounded-md transition duration-200"
              disabled={loading}
              style={{
                backgroundColor: '#2563EB',
                fontWeight: '500',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'CARGANDO...' : 'OBTENER INFORMACIÓN'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Resultados</h2>
          <span className="text-sm text-gray-500">
            {resultados.length > 0 ? `Mostrando ${resultados.length} registros` : ''}
          </span>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
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
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paros</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rechazos</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proceso</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {resultados.length > 0 ? (
                resultados.map((row, index) => (
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
                    <td className="py-3 px-4 text-sm">{row.paros}</td>
                    <td className="py-3 px-4 text-sm">{row.rechazos}</td>
                    <td className="py-3 px-4 text-sm">{row.proceso}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center space-x-4">
                        <button 
                          className="text-blue-600 hover:text-blue-800 flex items-center justify-center"
                          title="Editar"
                          onClick={() => handleEditar(row)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800 flex items-center justify-center"
                          title="Eliminar"
                          onClick={() => handleEliminar(row)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="13" className="py-4 px-4 text-center text-gray-500">
                    {loading ? 'Cargando resultados...' : 'No hay resultados disponibles'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReporteIndicadores;