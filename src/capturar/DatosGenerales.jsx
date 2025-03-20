import React, { useState, useEffect } from 'react';
import { ChevronDown, Save } from 'lucide-react';

const DatosGenerales = () => {
  // URL base de la API desde las variables de entorno
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  
  // Estados para almacenar los datos de los catálogos
  const [centros, setCentros] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [procesos, setProcesos] = useState([]);
  const [lineas, setLineas] = useState([]);
  const [materiales, setMateriales] = useState([]);
  
  // Estado para almacenar los valores seleccionados/ingresados
  const [formData, setFormData] = useState({
    centro: '',
    departamento: '',
    proceso: '',
    linea: '',
    material: '',
    orden: '',
    lote: '',
    velocidad: '',
    grupos: '',
    descripcionMaterial: ''
  });
  
  // Estado para mensajes de éxito o error
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [guardando, setGuardando] = useState(false);
  
  // Estados para manejar errores
  const [errores, setErrores] = useState({
    centros: null,
    departamentos: null,
    procesos: null,
    lineas: null,
    materiales: null,
    guardado: null
  });
  
  // Estados para indicar carga
  const [loading, setLoading] = useState({
    centros: false,
    departamentos: false,
    procesos: false,
    lineas: false,
    materiales: false
  });

  // Función para cargar los catálogos desde el servidor
  useEffect(() => {
    // Función genérica para hacer fetch de cualquier catálogo
    const fetchCatalogo = async (endpoint, setCatalogo, tipoEstado) => {
      try {
        setLoading(prev => ({ ...prev, [tipoEstado]: true }));
        
        
        const response = await fetch(`${API_URL}${endpoint}`);
        
        if (!response.ok) {
          throw new Error(`Error en la petición: ${response.status}`);
        }
        
        const data = await response.json();
        
        setCatalogo(data);
        setErrores(prev => ({ ...prev, [tipoEstado]: null }));
      } catch (err) {
        console.error(`Error al cargar ${tipoEstado}:`, err);
        setErrores(prev => ({ ...prev, [tipoEstado]: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, [tipoEstado]: false }));
      }
    };

    // Cargar todos los catálogos con las rutas correctas según la info proporcionada
    fetchCatalogo('/catalogoCentro', setCentros, 'centros');
    fetchCatalogo('/catalogoDepartamento', setDepartamentos, 'departamentos');
    fetchCatalogo('/catalogoProceso', setProcesos, 'procesos');
    fetchCatalogo('/catalogoLinea', setLineas, 'lineas');
    fetchCatalogo('/catalogoMaterial', setMateriales, 'materiales');
    
  }, []); // El array vacío asegura que solo se ejecute una vez al montar el componente

  // Función genérica para manejar cambios en inputs y selects
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Si es el cambio de material, actualizar también la descripción
    if (name === 'material' && value) {
      const materialSeleccionado = materiales.find(material => material._id === value);
      if (materialSeleccionado) {
        setFormData({
          ...formData,
          [name]: value,
          descripcionMaterial: materialSeleccionado.descripcionMaterial
        });
      } else {
        setFormData({
          ...formData,
          [name]: value,
          descripcionMaterial: ''
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Función para guardar los datos en múltiples endpoints
  const guardarDatos = async () => {
    // Validar que los campos requeridos estén completos
    const camposRequeridos = ['centro', 'departamento', 'proceso', 'linea', 'material', 'orden', 'lote', 'velocidad', 'grupos'];
    const camposFaltantes = camposRequeridos.filter(campo => !formData[campo]);
    
    if (camposFaltantes.length > 0) {
      setErrores({
        ...errores,
        guardado: `Faltan campos requeridos: ${camposFaltantes.join(', ')}`
      });
      return;
    }
    
    try {
      setGuardando(true);
      
      // Preparar datos para cada endpoint
      const datosCentro = {
        nombreCentro: formData.centro
      };
      
      const datosDepartamento = {
        nombreDepartamento: formData.departamento
      };
      
      const datosProceso = {
        nombreProceso: formData.proceso
      };
      
      const datosLinea = {
        nombreLinea: formData.linea
      };
      
      const datosGrupo = {
        nombreGrupo: formData.grupos
      };
      
      const datosMaterial = {
        nombreMaterial: formData.material,
        lote: Number(formData.lote),
        orden: Number(formData.orden),
        descripcionMaterial: formData.descripcionMaterial,
        velocidadNominal: Number(formData.velocidad)
      };
      
      // Array para almacenar todas las promesas de fetch
      const fetchPromises = [];
      
      // Función para realizar peticiones a los endpoints
      const enviarDatos = async (endpoint, datos) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datos)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Error en ${endpoint}: ${errorData.message || 'Error al guardar los datos'}`);
        }
        
        return await response.json();
      };
      
      // Agregar promesas para cada endpoint
      fetchPromises.push(enviarDatos('/centro', datosCentro));
      fetchPromises.push(enviarDatos('/departamento', datosDepartamento));
      fetchPromises.push(enviarDatos('/proceso', datosProceso));
      fetchPromises.push(enviarDatos('/linea', datosLinea));
      fetchPromises.push(enviarDatos('/grupo', datosGrupo));
      fetchPromises.push(enviarDatos('/materiales', datosMaterial));
      
      // Ejecutar todas las peticiones en paralelo
      await Promise.all(fetchPromises);
      
      // Mostrar mensaje de éxito
      setMensaje({
        texto: 'Todos los datos fueron guardados correctamente',
        tipo: 'success'
      });
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
      
      setErrores({
        ...errores,
        guardado: null
      });
    } catch (err) {
      console.error('Error al guardar datos:', err);
      setErrores({
        ...errores,
        guardado: err.message
      });
      
      setMensaje({
        texto: `Error al guardar: ${err.message}`,
        tipo: 'error'
      });
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="bg-blue-600 text-white py-2 px-4 font-semibold rounded-t-md flex justify-between items-center">
        <span>Datos generales</span>
        <button 
          className="bg-white text-blue-600 px-3 py-1 rounded text-sm flex items-center"
          onClick={guardarDatos}
          disabled={guardando}
        >
          <Save size={16} className="mr-1" />
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
      
      {mensaje.texto && (
        <div className={`p-3 ${mensaje.tipo === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} mb-2`}>
          {mensaje.texto}
        </div>
      )}
      
      {errores.guardado && (
        <div className="p-3 bg-red-100 text-red-700 mb-2">
          {errores.guardado}
        </div>
      )}
      
      <div className="bg-white p-4 border border-gray-300 rounded-b-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Centros */}
          <div className="flex items-center">
            <label className="w-32 text-gray-700">Centros</label>
            <div className="relative flex-1">
              <select 
                className="w-full border border-gray-300 rounded px-3 py-2 appearance-none"
                name="centro"
                value={formData.centro}
                onChange={handleInputChange}
                disabled={loading.centros}
              >
                <option value="">Seleccionar centro...</option>
                {centros && centros.length > 0 ? (
                  centros.map((centro) => (
                    <option key={centro._id} value={centro._id}>
                      {centro.nombreCentroCatalogo}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    {loading.centros ? 'Cargando centros...' : 'No hay centros disponibles'}
                  </option>
                )}
              </select>
              {loading.centros && <span className="absolute right-8 top-3 text-xs">Cargando...</span>}
              <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500" />
              {errores.centros && <p className="text-red-500 text-xs mt-1">{errores.centros}</p>}
            </div>
          </div>
          
          <div className="flex items-center">
            <label className="w-32 text-gray-700">Orden</label>
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              name="orden"
              value={formData.orden}
              onChange={handleInputChange}
              placeholder="Número de orden"
            />
          </div>

          {/* Departamentos */}
          <div className="flex items-center">
            <label className="w-32 text-gray-700">Departamentos</label>
            <div className="relative flex-1">
              <select 
                className="w-full border border-gray-300 rounded px-3 py-2 appearance-none"
                name="departamento"
                value={formData.departamento}
                onChange={handleInputChange}
                disabled={loading.departamentos}
              >
                <option value="">Seleccionar departamento...</option>
                {departamentos && departamentos.length > 0 ? (
                  departamentos.map((depto) => (
                    <option key={depto._id} value={depto._id}>
                      {depto.nombreDepartamentoCatalogo}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    {loading.departamentos ? 'Cargando departamentos...' : 'No hay departamentos disponibles'}
                  </option>
                )}
              </select>
              {loading.departamentos && <span className="absolute right-8 top-3 text-xs">Cargando...</span>}
              <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500" />
              {errores.departamentos && <p className="text-red-500 text-xs mt-1">{errores.departamentos}</p>}
            </div>
          </div>
          
          <div className="flex items-center">
            <label className="w-32 text-gray-700">Lote</label>
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              name="lote"
              value={formData.lote}
              onChange={handleInputChange}
              placeholder="Número de lote"
            />
          </div>

          {/* Procesos */}
          <div className="flex items-center">
            <label className="w-32 text-gray-700">Proceso</label>
            <div className="relative flex-1">
              <select 
                className="w-full border border-gray-300 rounded px-3 py-2 appearance-none"
                name="proceso"
                value={formData.proceso}
                onChange={handleInputChange}
                disabled={loading.procesos}
              >
                <option value="">Seleccionar proceso...</option>
                {procesos && procesos.length > 0 ? (
                  procesos.map((proceso) => (
                    <option key={proceso._id} value={proceso._id}>
                      {proceso.nombreProcesoCatalogo}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    {loading.procesos ? 'Cargando procesos...' : 'No hay procesos disponibles'}
                  </option>
                )}
              </select>
              {loading.procesos && <span className="absolute right-8 top-3 text-xs">Cargando...</span>}
              <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500" />
              {errores.procesos && <p className="text-red-500 text-xs mt-1">{errores.procesos}</p>}
            </div>
          </div>
          
          <div className="flex items-center">
            <label className="w-32 text-gray-700">Velocidad</label>
            <input
              type="number"
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              name="velocidad"
              value={formData.velocidad}
              onChange={handleInputChange}
              placeholder="Velocidad"
            />
          </div>
          
          {/* Líneas */}
          <div className="flex items-center">
            <label className="w-32 text-gray-700">Líneas</label>
            <div className="relative flex-1">
              <select 
                className="w-full border border-gray-300 rounded px-3 py-2 appearance-none"
                name="linea"
                value={formData.linea}
                onChange={handleInputChange}
                disabled={loading.lineas}
              >
                <option value="">Seleccionar línea...</option>
                {lineas && lineas.length > 0 ? (
                  lineas.map((linea) => (
                    <option key={linea._id} value={linea._id}>
                      {linea.nombreLineaCatalogo}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    {loading.lineas ? 'Cargando líneas...' : 'No hay líneas disponibles'}
                  </option>
                )}
              </select>
              {loading.lineas && <span className="absolute right-8 top-3 text-xs">Cargando...</span>}
              <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500" />
              {errores.lineas && <p className="text-red-500 text-xs mt-1">{errores.lineas}</p>}
            </div>
          </div>
          
          <div className="flex items-center">
            <label className="w-32 text-gray-700">Grupo</label>
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              name="grupos"
              value={formData.grupos}
              onChange={handleInputChange}
              placeholder="Número de grupos"
            />
          </div>
          
          {/* Materiales */}
          <div className="flex items-center">
            <label className="w-32 text-gray-700">Material</label>
            <div className="relative flex-1">
              <select 
                className="w-full border border-gray-300 rounded px-3 py-2 appearance-none"
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                disabled={loading.materiales}
              >
                <option value="">Seleccionar material...</option>
                {materiales && materiales.length > 0 ? (
                  materiales.map((material) => (
                    <option key={material._id} value={material._id}>
                      {material.nombreMaterialCatalogo}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    {loading.materiales ? 'Cargando materiales...' : 'No hay materiales disponibles'}
                  </option>
                )}
              </select>
              {loading.materiales && <span className="absolute right-8 top-3 text-xs">Cargando...</span>}
              <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500" />
              {errores.materiales && <p className="text-red-500 text-xs mt-1">{errores.materiales}</p>}
            </div>
          </div>

          <div className="flex items-center md:col-span-2">
            <label className="w-32 text-gray-700">
              Descripción<br />de Material
            </label>
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              name="descripcionMaterial"
              value={formData.descripcionMaterial}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatosGenerales;