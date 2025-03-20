import React, { useState, useEffect } from 'react';
import { ChevronDown, Info, Save, Beaker } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Ajusta la ruta según tu estructura de proyecto

const DatosIndicador = () => {
  const { user } = useAuth(); // Obtenemos el usuario del contexto de autenticación
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [formData, setFormData] = useState({
    piezasProducidas: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: '08',
    minuto: '00',
    ciclo: '60',
    turno: ''
  });

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/catalogoTurno`);
        
        if (!response.ok) {
          throw new Error(`Error al cargar turnos: ${response.status}`);
        }
        
        const data = await response.json();
        setTurnos(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar los turnos:", err);
        setError("No se pudieron cargar los turnos. Intente nuevamente más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchTurnos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleTestData = () => {
    // Si hay turnos disponibles, seleccionar el primero
    const primerTurnoId = turnos.length > 0 ? turnos[0]._id : '';
    
    setFormData({
      piezasProducidas: '100',
      fecha: new Date().toISOString().split('T')[0],
      hora: '10',
      minuto: '30',
      ciclo: '30',
      turno: primerTurnoId
    });
    
    setMensaje({
      texto: 'Datos de prueba cargados. Haga clic en Guardar para enviar.',
      tipo: 'success'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar que el usuario esté autenticado
    if (!user || !user._id) {
      setMensaje({
        texto: 'Error: No hay un usuario autenticado. Inicie sesión nuevamente.',
        tipo: 'error'
      });
      return;
    }
    
    setGuardando(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      // Formatear la fecha y hora para enviar
      const fechaHora = new Date(`${formData.fecha}T${formData.hora}:${formData.minuto}:00`);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      
      // 1. Primero guardar la producción incluyendo el ID del usuario
      const produccionData = {
        fechaHora: fechaHora.toISOString(),
        piezasProduccidas: parseInt(formData.piezasProducidas),
        ciclo: parseInt(formData.ciclo),
        usuario: user._id // Añadimos el ID del usuario autenticado
      };

      const produccionResponse = await fetch(`${apiUrl}/produccion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Añadimos el token para autorización
        },
        body: JSON.stringify(produccionData),
      });

      if (!produccionResponse.ok) {
        const errorData = await produccionResponse.json();
        throw new Error(errorData.message || `Error al guardar producción: ${produccionResponse.status}`);
      }
      
      const produccionGuardada = await produccionResponse.json();
      
      
      // Modifica esta sección dentro de tu función handleSubmit

     // Modifica esta sección dentro de tu función handleSubmit

      // 2. Luego guardar el turno con referencia a la producción
      const turnoSeleccionado = turnos.find(t => t._id === formData.turno);
      

      // Verificar la estructura de la respuesta y obtener el ID de producción correctamente
      const produccionId = produccionGuardada && produccionGuardada.produccion && produccionGuardada.produccion._id;


      if (turnoSeleccionado && produccionId) {
        const turnoData = {
          produccion: produccionId, // Usamos el ID correcto de la estructura de respuesta
          nombreTurno: turnoSeleccionado.nombreTurnoCatalogo
        };
        
        console.log("Datos de turno a enviar:", turnoData);
        
        const turnoResponse = await fetch(`${apiUrl}/turno`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(turnoData),
        });

        if (!turnoResponse.ok) {
          const errorData = await turnoResponse.json();
          throw new Error(errorData.message || `Error al guardar turno: ${turnoResponse.status}`);
        }
        
        const turnoGuardado = await turnoResponse.json();
        console.log("Turno guardado correctamente:", turnoGuardado);
      } else {
        throw new Error('No se pudo crear el turno porque falta la referencia a producción o el turno seleccionado');
      }

      setMensaje({
        texto: '¡Datos guardados correctamente!',
        tipo: 'success'
      });

      // Resetear el formulario después de guardar
      setFormData({
        ...formData,
        piezasProducidas: ''
      });
      
    } catch (err) {
      console.error("Error al guardar datos:", err);
      setMensaje({
        texto: err.message || 'Error al guardar los datos. Intente nuevamente.',
        tipo: 'error'
      });
    } finally {
      setGuardando(false);
    }
  };

  // Renderizado condicional si no hay usuario autenticado
  if (!user) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p>Debe iniciar sesión para acceder a esta funcionalidad.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="bg-blue-600 text-white py-2 px-4 font-semibold rounded-t-md flex justify-between items-center">
        <span>Datos de Indicador</span>
        <span className="text-sm">Usuario: {user.nombre || user.email}</span>
      </div>
      <div className="bg-white p-4 border border-gray-300 rounded-b-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <label className="w-32 text-gray-700">
              Piezas<br />Producidas
            </label>
            <input
              type="number"
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              name="piezasProducidas"
              min="0"
              value={formData.piezasProducidas}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="flex items-center">
            <label className="w-32 text-gray-700">Fecha</label>
            <div className="relative flex-1">
              <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                <input
                  type="date"
                  className="flex-1 px-3 py-2 border-none focus:outline-none"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <label className="w-32 text-gray-700">Ciclo</label>
            <div className="relative flex-1">
              <select 
                className="w-full border border-gray-300 rounded px-3 py-2 appearance-none"
                name="ciclo"
                value={formData.ciclo}
                onChange={handleChange}
                required
              >
                <option value="30">30</option>
                <option value="60">60</option>
              </select>
              <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
          
          <div className="flex items-center">
            <label className="w-32 text-gray-700">Hora</label>
            <div className="flex gap-2">
              <div className="relative">
                <select 
                  className="border border-gray-300 rounded px-3 py-2 w-20 appearance-none"
                  name="hora"
                  value={formData.hora}
                  onChange={handleChange}
                  required
                >
                  {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                    <option key={hour} value={hour.toString().padStart(2, '0')}>
                      {hour.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
              <div className="relative">
                <select 
                  className="border border-gray-300 rounded px-3 py-2 w-20 appearance-none"
                  name="minuto"
                  value={formData.minuto}
                  onChange={handleChange}
                  required
                >
                  {Array.from({ length: 60 }, (_, i) => i).map(minute => (
                    <option key={minute} value={minute.toString().padStart(2, '0')}>
                      {minute.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <label className="w-32 text-gray-700">Turno</label>
            <div className="relative flex-1">
              <select 
                className="w-full border border-gray-300 rounded px-3 py-2 appearance-none"
                name="turno"
                value={formData.turno}
                onChange={handleChange}
                disabled={loading}
                required
              >
                {loading ? (
                  <option value="">Cargando turnos...</option>
                ) : error ? (
                  <option value="">Error al cargar turnos</option>
                ) : turnos.length === 0 ? (
                  <option value="">No hay turnos disponibles</option>
                ) : (
                  <>
                    <option value="">Seleccionar turno...</option>
                    {turnos.map((turno) => (
                      <option key={turno._id} value={turno._id}>
                        {turno.nombreTurnoCatalogo}
                      </option>
                    ))}
                  </>
                )}
              </select>
              <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded flex items-start">
          <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
          <p className="text-blue-700">Debes capturar lo equivalente a <span className="font-bold">60</span> minutos de paros</p>
        </div>

        {mensaje.texto && (
          <div className={`mt-4 p-3 rounded flex items-start ${
            mensaje.tipo === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 
            'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <p>{mensaje.texto}</p>
          </div>
        )}

        <div className="mt-4 flex justify-between">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            onClick={handleTestData}
            disabled={loading || turnos.length === 0}
          >
            <Beaker className="h-4 w-4" />
            Cargar Datos de Prueba
          </button>
          
          <button
            type="submit"
            className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
              guardando ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={guardando || loading}
          >
            <Save className="h-4 w-4" />
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default DatosIndicador;