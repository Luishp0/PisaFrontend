import React, { useState, useEffect, forwardRef } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useProduccion } from '../context/ProduccionContext.jsx';

const DatosGenerales = forwardRef((props, ref) => {
  // URL base de la API desde las variables de entorno
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const { user } = useAuth();
  const { produccionId, actualizarMaterial } = useProduccion(); // Añadimos actualizarMaterial
  
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
    descripcionMaterial: ''
  });

  // Estado para errores de validación por campo
  const [validationErrors, setValidationErrors] = useState({
    centro: '',
    departamento: '',
    proceso: '',
    linea: '',
    material: '',
    orden: '',
    lote: '',
    velocidad: ''
  });

  // Estado para campos tocados (para mostrar errores solo después de interacción)
  const [touched, setTouched] = useState({
    centro: false,
    departamento: false,
    proceso: false,
    linea: false,
    material: false,
    orden: false,
    lote: false,
    velocidad: false
  });

  // Estado para indicar si el formulario es válido
  const [isFormValid, setIsFormValid] = useState(false);

  // Exponer handleSubmit a través de la ref
  React.useImperativeHandle(ref, () => ({
    handleSubmit
  }));
  
  // Estado para mensajes de éxito o error
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [guardando, setGuardando] = useState(false);
  
  // Estado para seguimiento de operaciones guardadas
  const [guardados, setGuardados] = useState({
    material: false,
    centro: false,
    proceso: false,
    departamento: false,
    linea: false
  });
  
  // Estados para manejar errores de carga
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
    materiales: false,
  });

  // Configuración de campos requeridos
  const requiredFields = {
    centro: true,
    departamento: true,
    proceso: true,
    linea: true,
    material: true,
    orden: true,
    lote: true,
    velocidad: true
  };

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
        setErrores(prev => ({ ...prev, [tipoEstado]: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, [tipoEstado]: false }));
      }
    };

    // Cargar todos los catálogos con las rutas correctas
    fetchCatalogo('/catalogoCentro', setCentros, 'centros');
    fetchCatalogo('/catalogoDepartamento', setDepartamentos, 'departamentos');
    fetchCatalogo('/catalogoProceso', setProcesos, 'procesos');
    fetchCatalogo('/catalogoLinea', setLineas, 'lineas');
    fetchCatalogo('/catalogoMaterial', setMateriales, 'materiales');
    
  }, []); // El array vacío asegura que solo se ejecute una vez al montar el componente

  // Función para validar un campo específico
  const validateField = (name, value) => {
    if (requiredFields[name] && !value) {
      return 'Este campo es obligatorio';
    }

    // Validaciones específicas por tipo de campo
    switch (name) {
      case 'orden':
        if (value && (isNaN(value) || value <= 0)) {
          return 'Debe ser un número positivo';
        }
        break;
      case 'lote':
        // El lote puede tener letras y números, solo validamos que no esté vacío
        if (value && value.trim() === '') {
          return 'El lote no puede estar vacío';
        }
        break;
      case 'velocidad':
        if (value && (isNaN(value) || value <= 0)) {
          return 'Debe ser un número positivo';
        }
        break;
      default:
        break;
    }
    
    return '';
  };

  // Validar todo el formulario
  const validateForm = () => {
    const newErrors = {};
    let formIsValid = true;

    // Validar cada campo
    Object.keys(formData).forEach(field => {
      if (field !== 'descripcionMaterial') { // Excluir el campo de solo lectura
        const error = validateField(field, formData[field]);
        newErrors[field] = error;
        if (error && requiredFields[field]) {
          formIsValid = false;
        }
      }
    });

    setValidationErrors(newErrors);
    setIsFormValid(formIsValid);
    return formIsValid;
  };

  // Efecto para validar el formulario cuando cambian los datos
  useEffect(() => {
    validateForm();
  }, [formData]);

  // Debugging useEffect to check when material changes
  useEffect(() => {
    if (formData.material) {
      console.log('Material cambiado en DatosGenerales:', formData.material);
      
      // Log the selected material details
      const materialSeleccionado = materiales.find(material => material._id === formData.material);
      console.log('Material seleccionado detalles:', materialSeleccionado);
    }
  }, [formData.material, materiales]);

  // Función genérica para manejar cambios en inputs y selects
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Marcar el campo como tocado
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Si es el cambio de material, actualizar también la descripción y la velocidad
    if (name === 'material' && value) {
      const materialSeleccionado = materiales.find(material => material._id === value);
      if (materialSeleccionado) {
        // Siempre cargar la velocidad del material, incluso si es 0 o vacía
        const velocidadMaterial = materialSeleccionado.velocidadNominal?.toString() || '';
        
        // Actualizar el contexto con el material seleccionado INMEDIATAMENTE
        actualizarMaterial(
          materialSeleccionado._id,
          materialSeleccionado.nombreMaterialCatalogo,
          materialSeleccionado.velocidadNominal || 0
        );
        
        // Log to verify the context update
        console.log('Material actualizado en contexto:', {
          id: materialSeleccionado._id,
          nombre: materialSeleccionado.nombreMaterialCatalogo,
          velocidadNominal: materialSeleccionado.velocidadNominal || 0
        });
        
        setFormData({
          ...formData,
          [name]: value,
          descripcionMaterial: materialSeleccionado.descripcionMaterial || '',
          velocidad: velocidadMaterial // Cargar la velocidad del material siempre
        });
        
        // Siempre marcar velocidad como tocado cuando se cambia el material
        setTouched(prev => ({
          ...prev,
          velocidad: true
        }));
      } else {
        // Si no hay material seleccionado, actualizar el contexto con valores vacíos
        actualizarMaterial('', '', 0);
        
        setFormData({
          ...formData,
          [name]: value,
          descripcionMaterial: '',
          velocidad: '' // Limpiar la velocidad si no hay material seleccionado
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // Validar el campo
    const errorMsg = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: errorMsg
    }));
  };

  // Función para manejar cuando un campo pierde el foco
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Si el campo es material, asegurar que el contexto está actualizado
    if (name === 'material' && formData.material) {
      const materialSeleccionado = materiales.find(material => material._id === formData.material);
      if (materialSeleccionado) {
        actualizarMaterial(
          materialSeleccionado._id,
          materialSeleccionado.nombreMaterialCatalogo,
          materialSeleccionado.velocidadNominal || 0
        );
      }
    }
  };

  // Función para guardar en una colección específica
  const guardarEnColeccion = async (endpoint, data) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error al guardar en ${endpoint}`);
      }

      const resultado = await response.json();
      return resultado;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    // Marcar todos los campos como tocados para mostrar todos los errores
    const allTouched = Object.keys(touched).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    
    setTouched(allTouched);

    // Validar todo el formulario antes de guardar
    if (!validateForm()) {
      setMensaje({
        texto: 'Por favor, completa todos los campos obligatorios correctamente',
        tipo: 'error'
      });
      return;
    }

    if (!user?._id) {
      setMensaje({
        texto: 'Usuario no autenticado',
        tipo: 'error'
      });
      return;
    }

    if (!produccionId) {
      setMensaje({
        texto: 'Debe guardar primero los datos del indicador',
        tipo: 'error'
      });
      return;
    }

    // Reiniciamos el estado de guardados
    setGuardados({
      material: false,
      centro: false,
      proceso: false,
      departamento: false,
      linea: false
    });

    try {
      setGuardando(true);
      
      // Datos comunes para todas las operaciones
      const datosBase = {
        userId: user._id,
        produccionId: produccionId
      };

      // 1. Guardar material
      if (formData.material) {
        const datosMaterial = {
          produccion: produccionId,
          nombreMaterial: materiales.find(m => m._id === formData.material)?.nombreMaterialCatalogo || '',
          lote: formData.lote,
          orden: formData.orden ? Number(formData.orden) : 0,
          descripcionMaterial: formData.descripcionMaterial,
          velocidadNominal: formData.velocidad ? Number(formData.velocidad) : 0
        };

        await guardarEnColeccion('/materiales', datosMaterial);
        setGuardados(prev => ({ ...prev, material: true }));
      }

      // 2. Guardar centro
      if (formData.centro) {
        const datosCentro = {
          ...datosBase,
          centroId: formData.centro,
          produccion: produccionId,
          nombreCentro: centros.find(c => c._id === formData.centro)?.nombreCentroCatalogo || ''
        };

        await guardarEnColeccion('/centro', datosCentro);
        setGuardados(prev => ({ ...prev, centro: true }));
      }

      // 3. Guardar departamento
      if (formData.departamento) {
        const datosDepartamento = {
          ...datosBase,
          departamentoId: formData.departamento,
          produccion: produccionId,
          nombreDepartamento: departamentos.find(d => d._id === formData.departamento)?.nombreDepartamentoCatalogo || ''
        };

        await guardarEnColeccion('/departamento', datosDepartamento);
        setGuardados(prev => ({ ...prev, departamento: true }));
      }

      // 4. Guardar proceso
      if (formData.proceso) {
        const datosProceso = {
          ...datosBase,
          procesoId: formData.proceso,
          produccion: produccionId,
          nombreProceso: procesos.find(p => p._id === formData.proceso)?.nombreProcesoCatalogo || ''
        };

        await guardarEnColeccion('/proceso', datosProceso);
        setGuardados(prev => ({ ...prev, proceso: true }));
      }

      // 5. Guardar línea
      if (formData.linea) {
        const datosLinea = {
          ...datosBase,
          lineaId: formData.linea,
          produccion: produccionId,
          nombreLinea: lineas.find(l => l._id === formData.linea)?.nombreLineaCatalogo || ''
        };

        await guardarEnColeccion('/linea', datosLinea);
        setGuardados(prev => ({ ...prev, linea: true }));
      }

      setMensaje({
        texto: 'Todos los datos fueron guardados correctamente',
        tipo: 'success'
      });

      // Resetear campos tocados
      setTouched({
        centro: false,
        departamento: false,
        proceso: false,
        linea: false,
        material: false,
        orden: false,
        lote: false,
        velocidad: false
      });

      // Opcional: Limpiar el formulario después de guardar
      // Asegurar que el contexto es actualizado correctamente
      actualizarMaterial('', '', 0);
      
      setFormData({
        centro: '',
        departamento: '',
        proceso: '',
        linea: '',
        material: '',
        orden: '',
        lote: '',
        velocidad: '',
        descripcionMaterial: ''
      });

    } catch (error) {
      setMensaje({
        texto: error.message || 'Error al guardar los datos',
        tipo: 'error'
      });
    } finally {
      setGuardando(false);
    }
  };

  // Función de renderizado de errores de validación
  const renderFieldError = (fieldName) => {
    if (touched[fieldName] && validationErrors[fieldName]) {
      return (
        <p className="text-red-500 text-xs mt-1 flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" /> 
          {validationErrors[fieldName]}
        </p>
      );
    }
    return null;
  };

  // Función para verificar si un campo es válido (para estilos)
  const isFieldValid = (fieldName) => {
    return touched[fieldName] && !validationErrors[fieldName];
  };

  // Función para obtener las clases de estilo del campo
  const getFieldClasses = (fieldName) => {
    let baseClasses = "w-full border rounded px-3 py-2 ";
    
    if (touched[fieldName]) {
      if (validationErrors[fieldName]) {
        return baseClasses + "border-red-300 focus:border-red-500 focus:ring focus:ring-red-200";
      } else {
        return baseClasses + "border-green-300 focus:border-green-500 focus:ring focus:ring-green-200";
      }
    }
    
    return baseClasses + "border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200";
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="bg-blue-600 text-white py-2 px-4 font-semibold rounded-t-md">
        Datos Generales
      </div>
      <div className="bg-white p-6 border border-gray-300 rounded-b-md">
        {/* Formulario para capturar datos - Diseño mejorado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-5">
          {/* Primera columna */}
          <div className="space-y-5">
            {/* Centro */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Centros
                {requiredFields.centro && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="relative">
                <select 
                  className={getFieldClasses('centro')}
                  name="centro"
                  value={formData.centro}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
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
                {isFieldValid('centro') && (
                  <CheckCircle className="absolute right-8 top-3 h-4 w-4 text-green-500" />
                )}
              </div>
              {renderFieldError('centro')}
              {errores.centros && <p className="text-red-500 text-xs mt-1">{errores.centros}</p>}
            </div>
            
            {/* Departamento */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Departamentos
                {requiredFields.departamento && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="relative">
                <select 
                  className={getFieldClasses('departamento')}
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
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
                {isFieldValid('departamento') && (
                  <CheckCircle className="absolute right-8 top-3 h-4 w-4 text-green-500" />
                )}
              </div>
              {renderFieldError('departamento')}
              {errores.departamentos && <p className="text-red-500 text-xs mt-1">{errores.departamentos}</p>}
            </div>

            {/* Proceso */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Proceso
                {requiredFields.proceso && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="relative">
                <select 
                  className={getFieldClasses('proceso')}
                  name="proceso"
                  value={formData.proceso}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
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
                {isFieldValid('proceso') && (
                  <CheckCircle className="absolute right-8 top-3 h-4 w-4 text-green-500" />
                )}
              </div>
              {renderFieldError('proceso')}
              {errores.procesos && <p className="text-red-500 text-xs mt-1">{errores.procesos}</p>}
            </div>

            {/* Línea */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Líneas
                {requiredFields.linea && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="relative">
                <select 
                  className={getFieldClasses('linea')}
                  name="linea"
                  value={formData.linea}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
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
                {isFieldValid('linea') && (
                  <CheckCircle className="absolute right-8 top-3 h-4 w-4 text-green-500" />
                )}
              </div>
              {renderFieldError('linea')}
              {errores.lineas && <p className="text-red-500 text-xs mt-1">{errores.lineas}</p>}
            </div>
          </div>
          
          {/* Segunda columna */}
          <div className="space-y-5">
            {/* Orden */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Orden
                {requiredFields.orden && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="relative">
                <input
                  type="text"
                  className={getFieldClasses('orden')}
                  name="orden"
                  value={formData.orden}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Número de orden"
                />
                {isFieldValid('orden') && (
                  <CheckCircle className="absolute right-2 top-3 h-4 w-4 text-green-500" />
                )}
              </div>
              {renderFieldError('orden')}
            </div>

            {/* Lote */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Lote
                {requiredFields.lote && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="relative">
                <input
                  type="text"
                  className={getFieldClasses('lote')}
                  name="lote"
                  value={formData.lote}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Código de lote (números y letras)"
                />
                {isFieldValid('lote') && (
                  <CheckCircle className="absolute right-2 top-3 h-4 w-4 text-green-500" />
                )}
              </div>
              {renderFieldError('lote')}
            </div>

            {/* Material */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Material
                {requiredFields.material && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="relative">
                <select 
                  className={getFieldClasses('material')}
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
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
                {isFieldValid('material') && (
                  <CheckCircle className="absolute right-8 top-3 h-4 w-4 text-green-500" />
                )}
              </div>
              {renderFieldError('material')}
              {errores.materiales && <p className="text-red-500 text-xs mt-1">{errores.materiales}</p>}
            </div>

            {/* Velocidad */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Velocidad
                {requiredFields.velocidad && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="relative">
                <input
                  type="number"
                  className={getFieldClasses('velocidad')}
                  name="velocidad"
                  value={formData.velocidad}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Velocidad"
                />
                {isFieldValid('velocidad') && (
                  <CheckCircle className="absolute right-2 top-3 h-4 w-4 text-green-500" />
                )}
              </div>
              {renderFieldError('velocidad')}
            </div>
          </div>
        </div>

        {/* Descripción del material */}
        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-2">
            Descripción de Material
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
            name="descripcionMaterial"
            value={formData.descripcionMaterial}
            readOnly
          />
        </div>
        
        {/* Leyenda de campos requeridos */}
        <div className="mt-6 flex items-center text-sm text-gray-500">
          <span className="text-red-500 mr-1">*</span> Campos obligatorios
        </div>
        
        {/* Estado de validación general */}
        {!isFormValid && Object.values(touched).some(t => t) && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-yellow-700 font-medium">Hay campos incompletos o con errores</p>
              <p className="text-yellow-600 text-sm mt-1">Por favor, verifica los campos marcados y completa la información requerida.</p>
            </div>
          </div>
        )}

{mensaje.texto && (
          <div className={`mt-4 p-3 rounded ${
            mensaje.tipo === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <p>{mensaje.texto}</p>
          </div>
        )}

        {guardando && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-blue-700 font-medium mb-2">Guardando datos en múltiples colecciones...</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {Object.entries(guardados).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                    value ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                  }`}>
                    {value && <CheckCircle className="h-3 w-3" />}
                  </span>
                  <span className="text-gray-600 capitalize">{key}:</span>
                  <span className={`ml-1 ${value ? "text-green-600 font-medium" : "text-gray-500"}`}>
                    {value ? "✓ Guardado" : "Pendiente"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </form>
  );
});

export default DatosGenerales;