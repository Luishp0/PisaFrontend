import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const ProduccionContext = createContext();

// Hook personalizado para usar el contexto
export const useProduccion = () => {
  const context = useContext(ProduccionContext);
  if (!context) {
    throw new Error('useProduccion debe ser usado dentro de un ProduccionProvider');
  }
  return context;
};

// Proveedor del contexto
export const ProduccionProvider = ({ children }) => {
  // Estado para el ID de producción
  const [produccionId, setProduccionId] = useState(null);
  
  // Estado para los datos completos de producción
  const [produccionData, setProduccionData] = useState(null);
  
  // Estado para controlar si el proceso de guardado está completo
  const [guardadoCompleto, setGuardadoCompleto] = useState(false);
  
  // Estado para datos temporales de producción (para comunicación entre componentes sin guardar)
  const [piezasProducidasTemp, setPiezasProducidasTemp] = useState(null);
  const [cicloTemp, setCicloTemp] = useState(null);
  
  // Estado para el material seleccionado
  const [materialSeleccionado, setMaterialSeleccionado] = useState({
    id: '',
    nombre: '',
    velocidadNominal: 0
  });

  // Función para actualizar el material seleccionado
  const actualizarMaterial = (id, nombre, velocidadNominal) => {
    console.log('Actualizando material seleccionado:', { id, nombre, velocidadNominal });
    setMaterialSeleccionado({
      id,
      nombre,
      velocidadNominal: Number(velocidadNominal) || 0
    });
  };

  // Función para actualizar los datos temporales de piezas producidas y ciclo
  const actualizarPiezasTemp = (piezas, ciclo) => {
    console.log('Actualizando datos temporales:', { piezas, ciclo });
    setPiezasProducidasTemp(piezas);
    setCicloTemp(ciclo);
  };

  // Función para actualizar el ID y los datos de producción
  const actualizarProduccion = (id, data) => {
    console.log('Actualizando ID de producción:', id);
    setProduccionId(id);
    setProduccionData(data);
    setGuardadoCompleto(true);
  };

  // Función para resetear el estado
  const resetearProduccion = () => {
    setProduccionId(null);
    setProduccionData(null);
    setGuardadoCompleto(false);
    // No resetear el material seleccionado, porque se usa entre formularios
  };

  // Valor del contexto que será proporcionado
  const value = {
    produccionId,
    produccionData,
    guardadoCompleto,
    materialSeleccionado,
    piezasProducidasTemp,
    cicloTemp,
    actualizarProduccion,
    resetearProduccion,
    actualizarMaterial,
    actualizarPiezasTemp
  };

  return (
    <ProduccionContext.Provider value={value}>
      {children}
    </ProduccionContext.Provider>
  );
};