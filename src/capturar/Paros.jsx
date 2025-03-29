import React, { useState, useEffect, forwardRef } from 'react';
import { ChevronDown, Plus, Clock, Trash2, Edit, X, Check, ArrowLeft, Info } from 'lucide-react';
import { useProduccion } from '../context/ProduccionContext';

const Paros = forwardRef((props, ref) => {
  const { produccionId, comparacionVelocidad } = useProduccion();
  
  const [catalogosPorNivel, setCatalogosPorNivel] = useState({
    1: [],
    2: [],
    3: [],
    4: []
  });
  const [selecciones, setSelecciones] = useState({
    nivel1: '',
    nivel2: '',
    nivel3: '',
    nivel4: ''
  });
  const [duracion, setDuracion] = useState(0);
  const [sugerenciaDuracion, setSugerenciaDuracion] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [historialParos, setHistorialParos] = useState([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const [editandoParo, setEditandoParo] = useState(null);
  const [paroOriginal, setParoOriginal] = useState(null);
  const [tiempoRegistrado, setTiempoRegistrado] = useState(0);
  const [tiempoFaltante, setTiempoFaltante] = useState(0);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  // Actualizar la sugerencia de duración cuando cambia la comparaciónVelocidad
  useEffect(() => {
    if (comparacionVelocidad && comparacionVelocidad.mostrar && comparacionVelocidad.tipo === 'warning') {
      setSugerenciaDuracion(comparacionVelocidad.minutosFaltantes);
      // No establecemos automáticamente la duración al valor sugerido
      setTiempoFaltante(comparacionVelocidad.minutosFaltantes);
    }
  }, [comparacionVelocidad]);

  // Calcular el tiempo total registrado y el tiempo faltante
  useEffect(() => {
    const tiempoTotal = historialParos.reduce((suma, paro) => suma + paro.duracion, 0);
    setTiempoRegistrado(tiempoTotal);
    
    // Actualizar el tiempo faltante basado en la comparación de velocidad y lo ya registrado
    if (comparacionVelocidad && comparacionVelocidad.mostrar && comparacionVelocidad.tipo === 'warning') {
      const faltante = Math.max(0, comparacionVelocidad.minutosFaltantes - tiempoTotal);
      setTiempoFaltante(faltante);
    }
  }, [historialParos, comparacionVelocidad]);

  // Obtener los datos del catálogo para el nivel 1 al cargar el componente
  useEffect(() => {
    const fetchCatalogoNivel1 = async () => {
      try {
        setCargando(true);
        const response = await fetch(`${API_URL}/catalogoParo/nivel/1`);
        if (!response.ok) {
          throw new Error('Error al cargar datos del catálogo nivel 1');
        }
        const data = await response.json();
        setCatalogosPorNivel(prev => ({ ...prev, 1: data }));
        setCargando(false);
      } catch (err) {
        console.error('Error fetching nivel 1:', err);
        setError('No se pudieron cargar las categorías de nivel 1');
        setCargando(false);
      }
    };

    fetchCatalogoNivel1();
  }, [API_URL]);

  // Cargar datos del siguiente nivel cuando se selecciona una opción
  const cargarNivel = async (nivel, idPadre) => {
    if (!idPadre) return;
    
    try {
      setCargando(true);
      const url = `${API_URL}/catalogoParo/nivel/${nivel}?idPadre=${idPadre}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al cargar datos para nivel ${nivel}`);
      }
      
      const data = await response.json();
      setCatalogosPorNivel(prev => ({ ...prev, [nivel]: data }));
      setCargando(false);
    } catch (err) {
      console.error(`Error fetching nivel ${nivel}:`, err);
      setError(`No se pudieron cargar las categorías de nivel ${nivel}`);
      setCargando(false);
    }
  };

  // Efecto para cargar nivel 2 cuando cambia la selección de nivel 1
  useEffect(() => {
    if (selecciones.nivel1) {
      cargarNivel(2, selecciones.nivel1);
      
      // Resetear niveles posteriores
      setSelecciones(prev => ({
        ...prev,
        nivel2: '',
        nivel3: '',
        nivel4: ''
      }));
      
      // Limpiar datos de niveles posteriores
      setCatalogosPorNivel(prev => ({
        ...prev,
        2: [],
        3: [],
        4: []
      }));
    }
  }, [selecciones.nivel1, API_URL]);

  // Efecto para cargar nivel 3 cuando cambia la selección de nivel 2
  useEffect(() => {
    if (selecciones.nivel2) {
      cargarNivel(3, selecciones.nivel2);
      
      // Resetear niveles posteriores
      setSelecciones(prev => ({
        ...prev,
        nivel3: '',
        nivel4: ''
      }));
      
      // Limpiar datos de niveles posteriores
      setCatalogosPorNivel(prev => ({
        ...prev,
        3: [],
        4: []
      }));
    }
  }, [selecciones.nivel2, API_URL]);

  // Efecto para cargar nivel 4 cuando cambia la selección de nivel 3
  useEffect(() => {
    if (selecciones.nivel3) {
      cargarNivel(4, selecciones.nivel3);
      
      // Resetear nivel posterior
      setSelecciones(prev => ({
        ...prev,
        nivel4: ''
      }));
      
      // Limpiar datos de nivel posterior
      setCatalogosPorNivel(prev => ({
        ...prev,
        4: []
      }));
    }
  }, [selecciones.nivel3, API_URL]);

  const handleSeleccionCambio = (nivel, valor) => {
    setSelecciones(prev => ({ ...prev, [`nivel${nivel}`]: valor }));
  };

  // Manejar cambios en la duración
  const handleDuracionCambio = (e) => {
    const nuevaDuracion = parseInt(e.target.value) || 0;
    setDuracion(nuevaDuracion);
    
    // Verificar si la duración ingresada excede el tiempo faltante
    if (tiempoFaltante > 0 && nuevaDuracion > tiempoFaltante) {
      // No mostrar error aquí, solo cuando intenten guardar
      console.log(`Atención: La duración ingresada (${nuevaDuracion}) excede el tiempo faltante (${tiempoFaltante}).`);
    } else {
      // Si había un error relacionado con la duración, limpiarlo
      if (error && error.includes('Estás intentando registrar') || error && error.includes('Estás intentando aumentar')) {
        setError(null);
      }
    }
  };

  // Función para limpiar el formulario
  const limpiarFormulario = () => {
    setSelecciones({
      nivel1: '',
      nivel2: '',
      nivel3: '',
      nivel4: ''
    });
    
    // Establecemos la duración a un valor predeterminado, sin usar el tiempoFaltante
    setDuracion(0);
  };

  // Función para guardar los paros en la base de datos
  const guardarParos = async () => {
    if (!produccionId) {
      setError('No hay un ID de producción válido para guardar los paros');
      return false;
    }

    if (historialParos.length === 0) {
      console.log('No hay paros para guardar');
      return true; // No hay paros, pero esto no es un error
    }

    try {
      setEnviando(true);
      setError(null);
      
      const promesas = historialParos.map(async (paro) => {
        // Determinar el nivel más profundo que tiene seleccionado
        let nivelMasAlto = 1;
        let descripcion = paro.nivel1.categoria;
        let idNivel = paro.nivel1.id;
        
        if (paro.nivel4 && paro.nivel4.id) {
          nivelMasAlto = 4;
          descripcion = paro.nivel4.categoria;
          idNivel = paro.nivel4.id;
        } else if (paro.nivel3 && paro.nivel3.id) {
          nivelMasAlto = 3;
          descripcion = paro.nivel3.categoria;
          idNivel = paro.nivel3.id;
        } else if (paro.nivel2 && paro.nivel2.id) {
          nivelMasAlto = 2;
          descripcion = paro.nivel2.categoria;
          idNivel = paro.nivel2.id;
        }
        
        const paroData = {
          produccion: produccionId,
          numeroNivel: nivelMasAlto,
          descripcion: descripcion,
          duracion: paro.duracion,
          idCatalogoParo: idNivel
        };
        
        console.log('Enviando paro:', paroData);
        
        const response = await fetch(`${API_URL}/paros`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(paroData)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error al guardar paro: ${response.status}`);
        }
        
        return await response.json();
      });
      
      const resultados = await Promise.all(promesas);
      console.log('Paros guardados:', resultados);

      // Mostrar mensaje de éxito incluyendo el tiempo total registrado
      setMensaje(`Paros guardados exitosamente. Se han registrado ${tiempoRegistrado} minutos de paros.`);
      
      // Limpiar el formulario después de guardar exitosamente
      limpiarFormulario();
      
      // Limpiar el historial después de guardar
      setHistorialParos([]);
      
      return true;
    } catch (err) {
      console.error('Error al guardar los paros:', err);
      setError(err.message || 'No se pudieron guardar los paros');
      return false;
    } finally {
      setEnviando(false);
    }
  };

  // Exponer la función al componente padre a través de la ref
  React.useImperativeHandle(ref, () => ({
    guardarParos
  }));

  const handleAgregar = () => {
    // Validación básica
    if (!selecciones.nivel1) {
      setError('Debes seleccionar al menos el nivel 1');
      return;
    }

    if (duracion <= 0) {
      setError('La duración debe ser mayor a 0 minutos');
      return;
    }
    
    // Validar si se está intentando registrar más tiempo del necesario
    if (duracion > tiempoFaltante && tiempoFaltante > 0) {
      setError(`Estás intentando registrar ${duracion} minutos, pero solo faltan ${tiempoFaltante} minutos. Ajusta la duración para continuar.`);
      return;
    }

    try {
      setEnviando(true);
      setError(null);
      
      // Obtener nombres/categorías de cada nivel seleccionado
      const nivel1Info = catalogosPorNivel[1].find(item => item._id === selecciones.nivel1);
      const nivel2Info = selecciones.nivel2 ? catalogosPorNivel[2].find(item => item._id === selecciones.nivel2) : null;
      const nivel3Info = selecciones.nivel3 ? catalogosPorNivel[3].find(item => item._id === selecciones.nivel3) : null;
      const nivel4Info = selecciones.nivel4 ? catalogosPorNivel[4].find(item => item._id === selecciones.nivel4) : null;
      
      // Preparar los datos del paro (sin enviar al servidor)
      const datosParo = {
        nivel1: {
          id: selecciones.nivel1,
          categoria: nivel1Info?.categoria || ''
        },
        nivel2: selecciones.nivel2 ? {
          id: selecciones.nivel2,
          categoria: nivel2Info?.categoria || ''
        } : null,
        nivel3: selecciones.nivel3 ? {
          id: selecciones.nivel3,
          categoria: nivel3Info?.categoria || ''
        } : null,
        nivel4: selecciones.nivel4 ? {
          id: selecciones.nivel4,
          categoria: nivel4Info?.categoria || ''
        } : null,
        duracion: duracion
      };
      
      console.log('Datos del paro a mostrar:', datosParo);
      
      // Añadir el nuevo paro al historial con fecha y hora actual
      const nuevoParo = {
        ...datosParo,
        id: Date.now(), // Usar un timestamp como ID
        timestamp: new Date().toLocaleString(),
        animacion: true // Para manejar la animación
      };
      
      setHistorialParos(prevHistorial => [nuevoParo, ...prevHistorial]);
      
      // Quitar la clase de animación después de unos segundos
      setTimeout(() => {
        setHistorialParos(prevHistorial => 
          prevHistorial.map(paro => 
            paro.id === nuevoParo.id ? { ...paro, animacion: false } : paro
          )
        );
      }, 2000);
      
      // Mostrar mensaje de éxito
      setMensaje('Paro registrado exitosamente');
      
      // Mostrar el historial si estaba oculto
      setMostrarHistorial(true);
      
      // Limpiar el formulario
      limpiarFormulario();
      
      // Limpiar el mensaje después de 3 segundos
      setTimeout(() => {
        setMensaje(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error al registrar el paro:', err);
      setError(err.message || 'No se pudo registrar el paro');
    } finally {
      setEnviando(false);
    }
  };

  // Genera una representación en texto de las categorías seleccionadas
  const formatearCategorias = (paro) => {
    const categorias = [];
    if (paro.nivel1 && paro.nivel1.categoria) categorias.push(paro.nivel1.categoria);
    if (paro.nivel2 && paro.nivel2.categoria) categorias.push(paro.nivel2.categoria);
    if (paro.nivel3 && paro.nivel3.categoria) categorias.push(paro.nivel3.categoria);
    if (paro.nivel4 && paro.nivel4.categoria) categorias.push(paro.nivel4.categoria);
    
    return categorias.join(' > ');
  };
  
  // Eliminar un paro del historial
  const handleEliminarParo = (id) => {
    setHistorialParos(prevHistorial => prevHistorial.filter(paro => paro.id !== id));
    setMensaje('Paro eliminado exitosamente');
    
    // Si estamos editando ese paro, cancelar la edición
    if (editandoParo === id) {
      handleCancelarEdicion();
    }
    
    // Limpiar el mensaje después de 3 segundos
    setTimeout(() => {
      setMensaje(null);
    }, 3000);
  };
  
  // Iniciar la edición de un paro
  const handleIniciarEdicion = (paro) => {
    setEditandoParo(paro.id);
    setParoOriginal(paro);
    
    // Establecer las selecciones actuales con los valores del paro
    setSelecciones({
      nivel1: paro.nivel1.id,
      nivel2: paro.nivel2 ? paro.nivel2.id : '',
      nivel3: paro.nivel3 ? paro.nivel3.id : '',
      nivel4: paro.nivel4 ? paro.nivel4.id : '',
    });
    
    // Establecer la duración
    setDuracion(paro.duracion);
    
    // Mostrar el formulario
    setMostrarFormulario(true);
  };
  
  // Cancelar la edición
  const handleCancelarEdicion = () => {
    setEditandoParo(null);
    setParoOriginal(null);
    
    // Limpiar el formulario
    limpiarFormulario();
  };
  
  // Guardar los cambios en un paro editado
  const handleGuardarEdicion = () => {
    if (!selecciones.nivel1) {
      setError('Debes seleccionar al menos el nivel 1');
      return;
    }

    if (duracion <= 0) {
      setError('La duración debe ser mayor a 0 minutos');
      return;
    }
    
    // Si estamos editando un paro, necesitamos calcular si el nuevo valor de duración es aceptable
    if (paroOriginal) {
      const duracionAnterior = paroOriginal.duracion;
      const duracionNueva = duracion;
      const diferencia = duracionNueva - duracionAnterior;
      
      // Si la duración aumentó, verificamos que no exceda el tiempo faltante
      if (diferencia > 0 && diferencia > tiempoFaltante && tiempoFaltante > 0) {
        setError(`Estás intentando aumentar ${diferencia} minutos, pero solo faltan ${tiempoFaltante} minutos. Ajusta la duración para continuar.`);
        return;
      }
    }
    
    try {
      // Obtener nombres/categorías de cada nivel seleccionado
      const nivel1Info = catalogosPorNivel[1].find(item => item._id === selecciones.nivel1);
      const nivel2Info = selecciones.nivel2 ? catalogosPorNivel[2].find(item => item._id === selecciones.nivel2) : null;
      const nivel3Info = selecciones.nivel3 ? catalogosPorNivel[3].find(item => item._id === selecciones.nivel3) : null;
      const nivel4Info = selecciones.nivel4 ? catalogosPorNivel[4].find(item => item._id === selecciones.nivel4) : null;
      
      // Preparar los datos actualizados
      const paroActualizado = {
        ...paroOriginal,
        nivel1: {
          id: selecciones.nivel1,
          categoria: nivel1Info?.categoria || ''
        },
        nivel2: selecciones.nivel2 ? {
          id: selecciones.nivel2,
          categoria: nivel2Info?.categoria || ''
        } : null,
        nivel3: selecciones.nivel3 ? {
          id: selecciones.nivel3,
          categoria: nivel3Info?.categoria || ''
        } : null,
        nivel4: selecciones.nivel4 ? {
          id: selecciones.nivel4,
          categoria: nivel4Info?.categoria || ''
        } : null,
        duracion: duracion,
        animacion: true, // Para mostrar la animación
        timestamp: new Date().toLocaleString() + ' (editado)'
      };
      
      // Actualizar el historial
      setHistorialParos(prevHistorial => 
        prevHistorial.map(paro => 
          paro.id === editandoParo ? paroActualizado : paro
        )
      );
      
      // Quitar la animación después de unos segundos
      setTimeout(() => {
        setHistorialParos(prevHistorial => 
          prevHistorial.map(paro => 
            paro.id === editandoParo ? { ...paro, animacion: false } : paro
          )
        );
      }, 2000);
      
      // Mostrar mensaje de éxito
      setMensaje('Paro actualizado exitosamente');
      
      // Salir del modo edición
      setEditandoParo(null);
      setParoOriginal(null);
      
      // Limpiar el formulario
      limpiarFormulario();
      
      // Limpiar el mensaje después de 3 segundos
      setTimeout(() => {
        setMensaje(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error al actualizar el paro:', err);
      setError(err.message || 'No se pudo actualizar el paro');
    }
  };
  
  // Mostrar el formulario
  const handleMostrarFormulario = () => {
    setMostrarFormulario(true);
  };

  return (
    <div className="mb-4">
      <div className="bg-blue-600 text-white py-2 px-4 font-semibold rounded-t-md">
        Paros
      </div>
      <div className="bg-white p-4 border border-gray-300 rounded-b-md">
        {error && (
          <div className="mb-4 bg-red-100 text-red-700 p-3 rounded border border-red-300">
            {error}
            <button 
              className="ml-2 text-sm underline"
              onClick={() => setError(null)}
            >
              Cerrar
            </button>
          </div>
        )}
        
        {mensaje && (
          <div className="mb-4 bg-green-100 text-green-700 p-3 rounded border border-green-300">
            {mensaje}
          </div>
        )}
        
        {/* Mostrar sugerencia de paros y tiempo registrado */}
        {comparacionVelocidad && comparacionVelocidad.mostrar && comparacionVelocidad.tipo === 'warning' && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <div className="text-blue-700">
                <p className="font-medium">Registrar lo equivalente a <span className="font-bold">{comparacionVelocidad.minutosFaltantes}</span> minutos de paros</p>
                <p className="text-sm mt-1">Para cumplir con la producción nominal esperada, registra los tiempos de paro.</p>
                
                {tiempoRegistrado > 0 && (
                  <div className="mt-2 pt-2 border-t border-blue-200">
                    <p className="font-medium">
                      Estado actual: {tiempoRegistrado} / {comparacionVelocidad.minutosFaltantes} minutos registrados
                      ({Math.min(100, Math.round((tiempoRegistrado / comparacionVelocidad.minutosFaltantes) * 100))}%)
                    </p>
                    {tiempoFaltante > 0 ? (
                      <p className="text-sm mt-1">
                        Aún faltan <span className="font-bold">{tiempoFaltante}</span> minutos por registrar
                      </p>
                    ) : (
                      <p className="text-sm mt-1 text-green-700 font-medium">
                        ¡Se ha registrado el tiempo de paros requerido! No es posible agregar más paros.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {!mostrarFormulario ? (
          <div className="flex justify-center my-4">
            <button
              className="px-4 py-2 rounded flex items-center bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleMostrarFormulario}
            >
              <Plus className="h-4 w-4 mr-1" /> Nuevo Paro
            </button>
          </div>
        ) : (
          <>
            {editandoParo && (
              <div className="mb-4 flex items-center text-blue-600">
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span className="font-medium">Editando paro</span>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {[1, 2, 3, 4].map((nivel) => (
                <div
                  key={nivel}
                  className="border border-gray-300 rounded"
                >
                  <div className="bg-gray-100 p-2 text-center text-sm font-semibold border-b border-gray-300">
                    Nivel {nivel}
                  </div>
                  <div className="relative">
                    <select
                      className="w-full border-0 p-2 appearance-none text-sm bg-white cursor-pointer"
                      name={`nivel${nivel}`}
                      value={selecciones[`nivel${nivel}`]}
                      onChange={(e) => handleSeleccionCambio(nivel, e.target.value)}
                      disabled={
                        cargando || 
                        enviando ||
                        (nivel > 1 && !selecciones[`nivel${nivel-1}`]) || 
                        !catalogosPorNivel[nivel] || 
                        catalogosPorNivel[nivel].length === 0
                      }
                    >
                      <option value="">Seleccione...</option>
                      {catalogosPorNivel[nivel]?.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.categoria}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-2 h-4 w-4 text-gray-500 pointer-events-none" />
                    
                    {(cargando && nivel === 1 && catalogosPorNivel[1].length === 0) || 
                     (cargando && nivel > 1 && selecciones[`nivel${nivel-1}`]) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                        <span className="text-sm text-gray-500">Cargando...</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <label className="w-32 text-gray-700">Duración (min)</label>
                <input
                  type="number"
                  className="w-24 border border-gray-300 rounded px-3 py-2"
                  value={duracion}
                  onChange={handleDuracionCambio}
                  min="1"
                  disabled={enviando}
                />
              </div>
              
              {editandoParo ? (
                <div className="flex space-x-2">
                  <button
                    className="px-3 py-2 rounded flex items-center bg-gray-500 hover:bg-gray-600 text-white"
                    onClick={handleCancelarEdicion}
                    disabled={enviando}
                  >
                    <X className="h-4 w-4 mr-1" /> Cancelar
                  </button>
                  <button
                    className={`px-3 py-2 rounded flex items-center ${enviando || !selecciones.nivel1 || duracion <= 0 
                      ? 'bg-green-300 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'} text-white`}
                    onClick={handleGuardarEdicion}
                    disabled={enviando || !selecciones.nivel1 || duracion <= 0}
                  >
                    <Check className="h-4 w-4 mr-1" /> Guardar
                  </button>
                </div>
              ) : (
                <button
                  className={`px-4 py-2 rounded flex items-center ${
                    enviando || !selecciones.nivel1 || duracion <= 0 || tiempoFaltante <= 0
                      ? 'bg-blue-300 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                  onClick={handleAgregar}
                  disabled={enviando || !selecciones.nivel1 || duracion <= 0 || tiempoFaltante <= 0}
                  title={tiempoFaltante <= 0 ? "Ya se ha registrado el tiempo de paros requerido" : ""}
                >
                  {enviando ? (
                    <>
                      <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-1" /> Agregar
                    </>
                  )}
                </button>
              )}
            </div>
          </>
        )}
        
        {/* Total de tiempo de paros registrado */}
        {tiempoRegistrado > 0 && (
          <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-600 mr-2" />
              <div>
                <p className="font-medium text-gray-700">
                  Tiempo total de paros: <span className="font-bold">{tiempoRegistrado}</span> minutos
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Sección de historial de paros agregados */}
        <div className="mt-6">
          <div 
            className="flex items-center justify-between bg-gray-100 p-2 rounded-t border border-gray-300 cursor-pointer"
            onClick={() => setMostrarHistorial(!mostrarHistorial)}
          >
            <h3 className="font-semibold text-gray-700">Historial de paros registrados</h3>
            <ChevronDown 
              className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${mostrarHistorial ? 'rotate-180' : ''}`} 
            />
          </div>
          
          {mostrarHistorial && (
            <div className="border border-gray-300 border-t-0 rounded-b p-2 max-h-64 overflow-y-auto">
              {historialParos.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay paros registrados</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {historialParos.map((paro) => (
                    <li 
                    key={paro.id}
                    className={`py-3 px-2 ${
                      paro.animacion 
                        ? 'bg-green-100 animate-pulse transition-colors duration-1000' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{formatearCategorias(paro)}</p>
                        <p className="text-sm text-gray-500">{paro.timestamp}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center text-blue-600">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="font-medium">{paro.duracion} min</span>
                        </div>
                        
                        <button
                          className="p-1 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded"
                          onClick={() => handleIniciarEdicion(paro)}
                          disabled={editandoParo !== null}
                          title="Editar paro"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        
                        <button
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                          onClick={() => handleEliminarParo(paro.id)}
                          title="Eliminar paro"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default Paros;