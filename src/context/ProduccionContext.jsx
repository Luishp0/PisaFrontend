import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const ProduccionContext = createContext();

// Hook personalizado para usar el contexto
export const useProduccion = () => useContext(ProduccionContext);

// Componente proveedor
export const ProduccionProvider = ({ children }) => {
  // Estado para el ID de producción que se genera al guardar DatosIndicador
  const [produccionId, setProduccionId] = useState(null);
  
  // Estado para almacenar los datos completos de la producción
  const [produccionData, setProduccionData] = useState(null);
  
  // Estado para el material seleccionado
  const [materialSeleccionado, setMaterialSeleccionado] = useState({
    id: '',
    nombre: '',
    velocidadNominal: 0
  });
  
  // Estado para las piezas producidas temporales (antes de guardar)
  const [piezasProducidasTemp, setPiezasProducidasTemp] = useState(null);
  
  // Estado para el ciclo temporal (antes de guardar)
  const [cicloTemp, setCicloTemp] = useState(null);
  
  // Estado para la comparación de velocidad
  const [comparacionVelocidad, setComparacionVelocidad] = useState({
    mostrar: false,
    porcentaje: 0,
    faltanCapturar: 0,
    minutosFaltantes: 0,
    tipo: ''
  });
  
  // Estado para indicar que se debe proceder con el guardado completo
  const [guardadoCompleto, setGuardadoCompleto] = useState(false);

  // Log for debugging purposes
  useEffect(() => {
    console.log('Material seleccionado actualizado:', materialSeleccionado);
  }, [materialSeleccionado]);
  
  // Log para debugging de comparacionVelocidad (solo se ejecuta cuando cambios reales)
  useEffect(() => {
    console.log('Comparación de velocidad actualizada:', comparacionVelocidad);
  }, [comparacionVelocidad]);
  
  // Función para actualizar la información del material seleccionado
  const actualizarMaterial = (id, nombre, velocidadNominal) => {
    setMaterialSeleccionado({
      id: id || '',
      nombre: nombre || '',
      velocidadNominal: velocidadNominal || 0
    });
  };
  
  // Función para actualizar el ID de producción y los datos
  const actualizarProduccion = (id, data) => {
    setProduccionId(id);
    setProduccionData(data);
    
    // Si se establece un nuevo ID de producción, indicar que se puede proceder con el guardado completo
    if (id) {
      setGuardadoCompleto(true);
    }
  };
  
  // Función para actualizar información temporal de piezas
  const actualizarPiezasTemp = (piezas, ciclo) => {
    setPiezasProducidasTemp(piezas);
    if (ciclo) {
      setCicloTemp(ciclo);
    }
  };
  
  // Función para actualizar la comparación de velocidad
  const actualizarComparacionVelocidad = (nuevaComparacion) => {
    // Verificar si los datos son diferentes antes de actualizar el estado
    // Esto evita actualizaciones innecesarias que podrían causar bucles
    setComparacionVelocidad(prevComparacion => {
      if (JSON.stringify(prevComparacion) === JSON.stringify(nuevaComparacion)) {
        return prevComparacion; // No hay cambios, devolver el estado anterior
      }
      return nuevaComparacion; // Hay cambios, actualizar el estado
    });
  };
  
  // Función para resetear el estado de la producción
  const resetearProduccion = () => {
    setGuardadoCompleto(false);
  };
  
  // Valores que se expondrán a través del contexto
  const value = {
    produccionId,
    produccionData,
    materialSeleccionado,
    piezasProducidasTemp,
    cicloTemp,
    comparacionVelocidad,
    guardadoCompleto,
    actualizarMaterial,
    actualizarProduccion,
    actualizarPiezasTemp,
    actualizarComparacionVelocidad,
    resetearProduccion
  };
  
  return (
    <ProduccionContext.Provider value={value}>
      {children}
    </ProduccionContext.Provider>
  );
};