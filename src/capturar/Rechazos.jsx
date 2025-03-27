import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus, Trash2, Edit2, Check, X, AlertCircle, Info } from 'lucide-react';
import { useProduccion } from '../context/ProduccionContext'; // Ajusta la ruta según tu estructura

const Rechazos = () => {
  const { 
    produccionId, 
    produccionData, 
    materialSeleccionado 
  } = useProduccion();

  const [catalogoRechazos, setCatalogoRechazos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRechazo, setSelectedRechazo] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [rechazosAgregados, setRechazosAgregados] = useState([]);
  const [validation, setValidation] = useState({ error: false, message: '' });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editCantidad, setEditCantidad] = useState(0);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [totalRechazos, setTotalRechazos] = useState(0);
  const [piezasFaltantes, setPiezasFaltantes] = useState(0);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  // Calcular las piezas faltantes basadas en la producción y velocidad nominal
  useEffect(() => {
    if (produccionData && materialSeleccionado && materialSeleccionado.velocidadNominal > 0) {
      // Obtener las piezas producidas y el ciclo de producción desde el contexto
      const piezasProducidas = produccionData?.piezasProduccidas || 0;
      const ciclo = produccionData?.ciclo || 60; // Valor predeterminado de 60 minutos
      
      // Calcular las piezas esperadas según la velocidad nominal y el ciclo
      const factorCiclo = ciclo / 60;
      const piezasEsperadas = Math.round(materialSeleccionado.velocidadNominal * factorCiclo);
      
      // Calcular las piezas faltantes
      const faltantes = Math.max(0, piezasEsperadas - piezasProducidas);
      setPiezasFaltantes(faltantes);
      
      console.log('Cálculo de piezas faltantes:', {
        piezasProducidas,
        ciclo,
        velocidadNominal: materialSeleccionado.velocidadNominal,
        piezasEsperadas,
        faltantes
      });
    } else {
      setPiezasFaltantes(0);
    }
  }, [produccionData, materialSeleccionado]);

  // Actualizar total de rechazos cuando cambia la lista
  useEffect(() => {
    const total = rechazosAgregados.reduce((sum, item) => sum + item.cantidad, 0);
    setTotalRechazos(total);
  }, [rechazosAgregados]);

  // Función para cargar los catálogos de rechazo usando fetch
  useEffect(() => {
    const fetchCatalogoRechazos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/catalogoRechazo`);
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        setCatalogoRechazos(data);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar catálogo de rechazos:', err);
        setError('Error al cargar la lista de rechazos. Por favor, intenta de nuevo.');
        setLoading(false);
      }
    };

    fetchCatalogoRechazos();
  }, [API_URL]);

  // Manejar cambio en el select
  const handleRechazoChange = (e) => {
    setSelectedRechazo(e.target.value);
    setValidation({ error: false, message: '' });
  };

  // Manejar cambio en la cantidad
  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setCantidad(value);
    if (value > 0) {
      setValidation({ error: false, message: '' });
    }
  };

  // Validar antes de agregar
  const validateRechazo = () => {
    if (!selectedRechazo) {
      setValidation({ error: true, message: 'Debes seleccionar un tipo de rechazo.' });
      return false;
    }
    
    if (cantidad <= 0) {
      setValidation({ error: true, message: 'La cantidad debe ser mayor a 0.' });
      return false;
    }

    // Verificar si ya existe este rechazo (solo para nuevos elementos)
    if (editingIndex === null && rechazosAgregados.some(item => item.id === selectedRechazo)) {
      setValidation({ 
        error: true, 
        message: 'Este rechazo ya ha sido agregado. Puedes editar su cantidad.' 
      });
      return false;
    }

    return true;
  };

  // Agregar rechazo a la lista
  const handleAgregarRechazo = () => {
    if (!validateRechazo()) return;

    const rechazoSeleccionado = catalogoRechazos.find(
      (rechazo) => rechazo._id === selectedRechazo
    );

    if (rechazoSeleccionado) {
      const nuevoRechazo = {
        id: selectedRechazo,
        nombre: rechazoSeleccionado.nombreRechazoCatalogo,
        cantidad,
      };

      setRechazosAgregados([...rechazosAgregados, nuevoRechazo]);
      setSelectedRechazo('');
      setCantidad(0);
      setValidation({ error: false, message: '' });
    }
  };

  // Iniciar edición de un rechazo
  const handleStartEdit = (index) => {
    setEditingIndex(index);
    setEditCantidad(rechazosAgregados[index].cantidad);
  };

  // Guardar la edición
  const handleSaveEdit = (index) => {
    if (editCantidad <= 0) {
      setValidation({ error: true, message: 'La cantidad debe ser mayor a 0.' });
      return;
    }

    const updatedRechazos = [...rechazosAgregados];
    updatedRechazos[index] = {
      ...updatedRechazos[index],
      cantidad: editCantidad
    };

    setRechazosAgregados(updatedRechazos);
    setEditingIndex(null);
    setValidation({ error: false, message: '' });
  };

  // Cancelar la edición
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setValidation({ error: false, message: '' });
  };

  // Eliminar un rechazo
  const handleEliminarRechazo = (index) => {
    const updatedRechazos = [...rechazosAgregados];
    updatedRechazos.splice(index, 1);
    setRechazosAgregados(updatedRechazos);
  };

  // Enviar los rechazos al servidor
  const handleGuardarRechazos = async () => {
    // Validar que hay una producción activa
    if (!produccionId) {
      setMensaje({
        texto: 'Error: Debes guardar los datos de producción primero.',
        tipo: 'error'
      });
      return;
    }

    // Validar que hay rechazos para guardar
    if (rechazosAgregados.length === 0) {
      setMensaje({
        texto: 'Error: No hay rechazos para guardar.',
        tipo: 'error'
      });
      return;
    }

    setGuardando(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      // Guardar cada rechazo individualmente
      for (const rechazo of rechazosAgregados) {
        const rechazoData = {
          produccion: produccionId,
          tipoRechazo: rechazo.id,
          cantidadRechazo: rechazo.cantidad
        };

        console.log('Enviando rechazo:', rechazoData);

        const response = await fetch(`${API_URL}/rechazo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(rechazoData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error al guardar rechazo: ${response.status}`);
        }
      }

      setMensaje({
        texto: '¡Rechazos guardados correctamente!',
        tipo: 'success'
      });

      // Resetear la lista de rechazos después de guardar
      setRechazosAgregados([]);

    } catch (err) {
      console.error("Error al guardar rechazos:", err);
      setMensaje({
        texto: err.message || 'Error al guardar los rechazos. Intente nuevamente.',
        tipo: 'error'
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="bg-blue-600 text-white py-2 px-4 font-semibold rounded-t-md">
        Rechazos
      </div>
      <div className="bg-white p-4 border border-gray-300 rounded-b-md">
        {/* Información de piezas faltantes */}
        {produccionId ? (
          piezasFaltantes > 0 ? (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
              <div>
                <p className="text-yellow-700 font-medium">
                  Faltan {piezasFaltantes} piezas para alcanzar el 100% de producción nominal
                </p>
                <p className="text-yellow-600 text-sm mt-1">
                  Has registrado {totalRechazos} de {piezasFaltantes} piezas como rechazos ({Math.round((totalRechazos / piezasFaltantes) * 100)}%)
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded flex items-start">
              <Info className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <p className="text-green-700">
                La producción ha alcanzado o superado la capacidad nominal. No es necesario registrar rechazos.
              </p>
            </div>
          )
        ) : (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
            <p className="text-yellow-700">
              Primero debes guardar los datos de producción para poder registrar rechazos.
            </p>
          </div>
        )}

        <div className="flex justify-between items-center mb-2">
          <div className="w-1/2">
            <label className="text-gray-700">Rechazo</label>
          </div>
          <div className="w-1/3">
            <label className="text-gray-700">Cantidad</label>
          </div>
          <div className="w-1/6"></div>
        </div>
        
        <div className="flex items-center mb-4">
          <div className="w-1/2 pr-2">
            <div className="relative">
              <select
                className={`w-full border ${validation.error && !selectedRechazo ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 appearance-none`}
                name="tipo"
                value={selectedRechazo}
                onChange={handleRechazoChange}
                disabled={loading || !produccionId}
              >
                <option value="">Seleccionar rechazo...</option>
                {catalogoRechazos.map((rechazo) => (
                  <option key={rechazo._id} value={rechazo._id}>
                    {rechazo.nombreRechazoCatalogo}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500" />
            </div>
          </div>
          <div className="w-1/3 px-2">
            <input
              type="number"
              className={`w-full border ${validation.error && cantidad <= 0 ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
              placeholder="0"
              name="cantidad"
              min="1"
              value={cantidad}
              onChange={handleCantidadChange}
              disabled={!produccionId}
            />
          </div>
          <div className="w-1/6 pl-2 flex justify-center">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
              onClick={handleAgregarRechazo}
              disabled={!produccionId}
            >
              <Plus className="h-4 w-4 mr-1" /> Agregar
            </button>
          </div>
        </div>

        {validation.error && (
          <div className="text-red-500 mb-4">{validation.message}</div>
        )}

        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}

        {loading && (
          <div className="text-gray-500 mb-4">Cargando catálogo de rechazos...</div>
        )}

        {/* Lista de rechazos agregados */}
        {rechazosAgregados.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Rechazos agregados:</h3>
            <ul className="border border-gray-200 rounded divide-y">
              {rechazosAgregados.map((rechazo, index) => (
                <li key={index} className="flex justify-between items-center p-2">
                  <span className="w-1/2">{rechazo.nombre}</span>
                  
                  {editingIndex === index ? (
                    <>
                      <div className="w-1/3">
                        <input
                          type="number"
                          className={`w-full border ${editCantidad <= 0 ? 'border-red-500' : 'border-gray-300'} rounded px-2 py-1`}
                          min="1"
                          value={editCantidad}
                          onChange={(e) => setEditCantidad(parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="w-1/6 flex justify-end">
                        <button 
                          onClick={() => handleSaveEdit(index)}
                          className="p-1 text-green-600 hover:text-green-800 mr-1"
                          title="Guardar"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Cancelar"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="w-1/3 text-center">{rechazo.cantidad}</span>
                      <div className="w-1/6 flex justify-end">
                        <button 
                          onClick={() => handleStartEdit(index)}
                          className="p-1 text-blue-600 hover:text-blue-800 mr-1"
                          title="Editar"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleEliminarRechazo(index)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Eliminar"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center mt-4">
              <div className="text-gray-700">
                <span className="font-medium">Total de rechazos: </span>
                <span>{totalRechazos}</span>
                {piezasFaltantes > 0 && (
                  <span className="ml-2 text-sm">
                    ({Math.round((totalRechazos / piezasFaltantes) * 100)}% de las piezas faltantes)
                  </span>
                )}
              </div>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center disabled:bg-green-300 disabled:cursor-not-allowed"
                onClick={handleGuardarRechazos}
                disabled={rechazosAgregados.length === 0 || guardando}
              >
                {guardando ? 'Guardando...' : 'Guardar Rechazos'}
              </button>
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
      </div>
    </div>
  );
};

export default Rechazos;