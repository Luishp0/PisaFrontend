import React, { useState, useEffect, forwardRef } from 'react';
import { ChevronDown, Info, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Ajusta la ruta según tu estructura de proyecto
import { useProduccion } from '../context/ProduccionContext.jsx';

const DatosIndicador = forwardRef((props, ref) => {
  const { user } = useAuth(); // Obtenemos el usuario del contexto de autenticación
  const { 
    actualizarProduccion, 
    materialSeleccionado,
    actualizarPiezasTemp,
    actualizarComparacionVelocidad,
    comparacionVelocidad: contextComparacionVelocidad  // Renombrado para evitar conflictos
  } = useProduccion(); // Obtenemos el material del contexto y la función para actualizar piezas temporales

  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  
  // Estado SOLO para la visualización local - NO actualiza el contexto directamente
  const [localComparacionVelocidad, setLocalComparacionVelocidad] = useState({
    mostrar: false,
    porcentaje: 0,
    faltanCapturar: 0,
    minutosFaltantes: 0,
    tipo: '' // 'warning' o 'success'
  });
// Función corregida para obtener la fecha actual sin problemas de zona horaria
const obtenerFechaActual = () => {
  const ahora = new Date();
  
  // Obtener año, mes y día en la zona horaria local
  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0'); // +1 porque los meses empiezan en 0
  const dia = String(ahora.getDate()).padStart(2, '0');
  
  // Formar la fecha en formato YYYY-MM-DD
  return `${anio}-${mes}-${dia}`;
};


const fechaActual = obtenerFechaActual();
  
// Obtener la hora actual y redondear a la media hora más cercana anterior
const obtenerHoraMinutoActual = () => {
  const ahora = new Date();
  const hora = ahora.getHours();
  const minutoActual = ahora.getMinutes();
  
  // Si los minutos son menores a 30, redondear a 00
  // Si los minutos son mayores o iguales a 30, redondear a 30
  const minuto = minutoActual < 30 ? "00" : "30";
  
  return { 
    hora: hora.toString().padStart(2, '0'), 
    minuto 
  };
};
  const { hora: horaActual, minuto: minutoActual } = obtenerHoraMinutoActual();
  
  // Valores predefinidos de ciclos disponibles (solo 30 y 60)
  const ciclosDisponibles = [30, 60];

  const [formData, setFormData] = useState({
    piezasProducidas: '',
    fecha: fechaActual, // Inicializar con fecha actual del sistema
    hora: horaActual,   // Inicializar con hora actual
    minuto: minutoActual, // Inicializar con minuto actual (00 o 30)
    ciclo: '60',
    turno: ''
  });

  // Debugging useEffect to check materialSeleccionado state
  useEffect(() => {
    console.log('Material en DatosIndicador:', materialSeleccionado);
  }, [materialSeleccionado]);

  // Exponer handleSubmit y limpiarFormulario a través de la ref
  React.useImperativeHandle(ref, () => ({
    handleSubmit,
    limpiarFormulario
  }));

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

  // Evaluar las piezas producidas en relación a la velocidad nominal del material seleccionado
  // IMPORTANTE: Este efecto SOLO calcula los valores y actualiza el estado local
  useEffect(() => {
    // Verificar si tenemos un material seleccionado con velocidad nominal y piezas producidas
    if (formData.piezasProducidas && 
        materialSeleccionado && 
        materialSeleccionado.velocidadNominal > 0) {
      
      // Ciclo seleccionado en minutos
      const cicloMinutos = parseInt(formData.ciclo);
      
      // Factor de ajuste basado en el ciclo
      const factorCiclo = cicloMinutos / 60;
      
      // Velocidad nominal ajustada por el ciclo (piezas esperadas en el ciclo)
      const velocidadNominalAjustada = materialSeleccionado.velocidadNominal * factorCiclo;
      
      // Piezas producidas como número
      const piezas = parseInt(formData.piezasProducidas);
      
      // Calcular el porcentaje de producción
      const porcentaje = (piezas / velocidadNominalAjustada) * 100;
      
      // Cuántas piezas faltan por capturar para llegar al 100%
      const faltanCapturar = Math.max(0, velocidadNominalAjustada - piezas);
      
      // Calcular los minutos faltantes
      // Si velocidadNominal es piezas por hora, entonces:
      // minutosFaltantes = (piezasFaltantes / piezasPorHora) * 60 minutos
      const minutosFaltantes = Math.ceil((faltanCapturar / materialSeleccionado.velocidadNominal) * 60);
      
      const nuevaComparacion = {
        mostrar: true,
        porcentaje: Math.round(porcentaje * 100) / 100, // Redondear a 2 decimales
        faltanCapturar: Math.ceil(faltanCapturar),
        minutosFaltantes: minutosFaltantes,
        tipo: porcentaje >= 100 ? 'success' : 'warning'
      };
      
      // Solo actualizar el estado local
      setLocalComparacionVelocidad(nuevaComparacion);
      
      // Actualizar el contexto con los datos temporales para que el componente de Rechazos y Paros pueda acceder a ellos
      actualizarPiezasTemp(formData.piezasProducidas, formData.ciclo);
    } else {
      const nuevaComparacion = {
        mostrar: false,
        porcentaje: 0,
        faltanCapturar: 0,
        minutosFaltantes: 0,
        tipo: ''
      };
      
      setLocalComparacionVelocidad(nuevaComparacion);
      
      // Si no hay piezas producidas, limpiar los datos temporales del contexto
      if (!formData.piezasProducidas) {
        actualizarPiezasTemp(null, null);
      }
    }
  }, [formData.piezasProducidas, formData.ciclo, materialSeleccionado, actualizarPiezasTemp]);

  // Efecto SEPARADO para actualizar el contexto solo cuando el estado local cambia
  // Esto evita el bucle infinito
  useEffect(() => {
    // Comparamos si los valores son diferentes antes de actualizar el contexto
    if (JSON.stringify(localComparacionVelocidad) !== JSON.stringify(contextComparacionVelocidad)) {
      actualizarComparacionVelocidad(localComparacionVelocidad);
    }
  }, [localComparacionVelocidad, contextComparacionVelocidad, actualizarComparacionVelocidad]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Generar las opciones de hora (de 00 a 23)
  const generarOpcionesHora = () => {
    const opciones = [];
    for (let i = 0; i < 24; i++) {
      opciones.push(i.toString().padStart(2, '0'));
    }
    return opciones;
  };

  // Generar las opciones de minuto (solo 00 y 30)
  const opcionesMinuto = ["00", "30"];

// Limpiar el formulario después de guardar
const limpiarFormulario = () => {
  // Obtener la fecha actual actualizada del sistema
  const fechaActualActualizada = obtenerFechaActual();
  
  // Obtener nuevos valores de hora/minuto actuales redondeados
  const { hora: nuevaHora, minuto: nuevoMinuto } = obtenerHoraMinutoActual();
  
  setFormData({
    piezasProducidas: '',
    fecha: fechaActualActualizada, // Usar la fecha actual actualizada
    hora: nuevaHora,
    minuto: nuevoMinuto,
    ciclo: '60',
    turno: ''
  });
  
  // También limpiar la comparación de velocidad
  const nuevaComparacion = {
    mostrar: false,
    porcentaje: 0,
    faltanCapturar: 0,
    minutosFaltantes: 0,
    tipo: ''
  };
  
  setLocalComparacionVelocidad(nuevaComparacion);
  actualizarComparacionVelocidad(nuevaComparacion);
  
  // Limpiar los datos temporales del contexto
  actualizarPiezasTemp(null, null);
};

const handleSubmit = async (e) => {
  if (e) {
    e.preventDefault();
  }
  
  // Verificar que el usuario esté autenticado
  if (!user || !user._id) {
    setMensaje({
      texto: 'Error: No hay un usuario autenticado. Inicie sesión nuevamente.',
      tipo: 'error'
    });
    return;
  }

  // Verificar que hay un material seleccionado en el contexto
  if (!materialSeleccionado || !materialSeleccionado.id) {
    console.log('Material seleccionado en submit:', materialSeleccionado);
    setMensaje({
      texto: 'Error: Debe seleccionar un material en la sección de Datos Generales para continuar.',
      tipo: 'error'
    });
    return;
  }
  
  setGuardando(true);
  setMensaje({ texto: '', tipo: '' });

  try {
    // Obtener la zona horaria local en minutos
    const offsetMinutos = new Date().getTimezoneOffset();
    
    // Crear la fecha y hora correctamente, considerando la zona horaria
    const fechaBase = new Date(`${formData.fecha}T${formData.hora}:${formData.minuto}:00`);
    
    // Ajustar por la zona horaria para preservar la hora local exacta
    const fechaHoraAjustada = new Date(fechaBase.getTime() - (offsetMinutos * 60000));
    
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    
    // 1. Primero guardar la producción incluyendo el ID del usuario
    const produccionData = {
      fechaHora: fechaHoraAjustada.toISOString(), // Usar la fecha ajustada
      piezasProduccidas: parseInt(formData.piezasProducidas),
      ciclo: parseInt(formData.ciclo),
      usuario: user._id,
      materialId: materialSeleccionado.id,
      velocidadNominal: materialSeleccionado.velocidadNominal
    };

    console.log("Enviando datos de producción:", produccionData);
    console.log("Fecha y hora original:", `${formData.fecha}T${formData.hora}:${formData.minuto}:00`);
    console.log("Fecha y hora ajustada:", fechaHoraAjustada.toISOString());

    const produccionResponse = await fetch(`${apiUrl}/produccion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(produccionData)
    });

    if (!produccionResponse.ok) {
      const errorData = await produccionResponse.json();
      throw new Error(errorData.message || `Error al guardar producción: ${produccionResponse.status}`);
    }
    
    const produccionGuardada = await produccionResponse.json();
    console.log('Producción guardada:', produccionGuardada);
    
    // Extraer el ID de producción correctamente según la estructura de respuesta
    let produccionId;
    
    // Verificar la estructura de la respuesta
    if (produccionGuardada._id) {
      produccionId = produccionGuardada._id;
    } else if (produccionGuardada.produccion && produccionGuardada.produccion._id) {
      produccionId = produccionGuardada.produccion._id;
    } else {
      throw new Error('No se pudo obtener el ID de producción');
    }
    
    // Actualizar el contexto con el ID de producción
    actualizarProduccion(produccionId, produccionGuardada);
    
    // 2. Luego guardar el turno con referencia a la producción
    const turnoSeleccionado = turnos.find(t => t._id === formData.turno);
    
    if (turnoSeleccionado && produccionId) {
      const turnoData = {
        produccion: produccionId,
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
    
    // Limpiar el formulario después de guardar exitosamente
    limpiarFormulario();
    
  } catch (err) {
    console.error("Error al guardar datos:", err);
    setMensaje({
      texto: err.message || 'Error al guardar los datos. Intente nuevamente.',
      tipo: 'error'
    });
    // Si ocurre un error, también debemos reiniciar el proceso
    actualizarProduccion(null, null);
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
        {/* Mostrar información del material seleccionado */}
        {materialSeleccionado && materialSeleccionado.id ? (
          <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
            <p className="text-gray-700 font-medium">Material seleccionado: {materialSeleccionado.nombre}</p>
            {materialSeleccionado.velocidadNominal > 0 && (
              <p className="text-gray-600 text-sm mt-1">
                Velocidad nominal: <span className="font-semibold">{materialSeleccionado.velocidadNominal}</span> piezas/hora
              </p>
            )}
          </div>
        ) : (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
            <p className="text-yellow-700">
              No hay material seleccionado. Por favor, seleccione un material en la sección de Datos Generales.
            </p>
          </div>
        )}

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
                  className="flex-1 px-3 py-2 border-none focus:outline-none bg-gray-100" // Añade bg-gray-100 para mostrar que está deshabilitado
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  readOnly // Añade readOnly para que no se pueda editar
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <label className="w-32 text-gray-700">Ciclo</label>
            <div className="flex-1">
              <div className="relative">
                <select 
                  className="w-full border border-gray-300 rounded px-3 py-2 appearance-none"
                  name="ciclo"
                  value={formData.ciclo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar ciclo...</option>
                  {ciclosDisponibles.map(ciclo => (
                    <option key={ciclo} value={ciclo}>{ciclo} minutos</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
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
                  {generarOpcionesHora().map(hora => (
                    <option key={hora} value={hora}>
                      {hora}
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
                  {opcionesMinuto.map(minuto => (
                    <option key={minuto} value={minuto}>
                      {minuto}
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

        {/* Mostrar información sobre la comparación de velocidad nominal - usando localComparacionVelocidad */}
        {localComparacionVelocidad.mostrar && (
          <div className={`mt-4 p-3 rounded-lg flex items-start 
            ${localComparacionVelocidad.tipo === 'warning' 
              ? 'bg-yellow-50 border border-yellow-200' 
              : 'bg-green-50 border border-green-200'}`}>
            {localComparacionVelocidad.tipo === 'warning' ? (
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
            ) : (
              <Info className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            )}
            <div>
              <p className={`font-medium ${
                localComparacionVelocidad.tipo === 'warning' ? 'text-yellow-700' : 'text-green-700'
              }`}>
                Producción al {localComparacionVelocidad.porcentaje.toFixed(2)}% de la capacidad nominal
              </p>
              {localComparacionVelocidad.tipo === 'warning' && (
                <p className="text-yellow-600 text-sm mt-1">
                  Faltan por capturar {localComparacionVelocidad.faltanCapturar} piezas para alcanzar la capacidad nominal.
                </p>
              )}
              {localComparacionVelocidad.tipo === 'success' && (
                <p className="text-green-600 text-sm mt-1">
                  La producción ha alcanzado o superado la capacidad nominal para el ciclo de {formData.ciclo} minutos.
                </p>
              )}
            </div>
          </div>
        )}

        {mensaje.texto && (
          <div className={`mt-4 p-3 rounded flex items-start ${
            mensaje.tipo === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 
            'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <p>{mensaje.texto}</p>
          </div>
        )}

        {guardando && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-blue-700">
              Guardando datos...
            </p>
          </div>
        )}

       
      </div>
    </form>
  );
});

export default DatosIndicador;