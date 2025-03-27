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
  };

  // Valor del contexto que será proporcionado
  const value = {
    produccionId,
    produccionData,
    guardadoCompleto,
    actualizarProduccion,
    resetearProduccion
  };

  return (
    <ProduccionContext.Provider value={value}>
      {children}
    </ProduccionContext.Provider>
  );
};