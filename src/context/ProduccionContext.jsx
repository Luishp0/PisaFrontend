// 1. Primero, crea un nuevo archivo para el contexto (ProduccionContext.js)
import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const ProduccionContext = createContext();

// Crear un proveedor de contexto
export const ProduccionProvider = ({ children }) => {
  const [produccionId, setProduccionId] = useState(null);
  const [produccionData, setProduccionData] = useState(null);

  // Función para actualizar el ID de producción
  const actualizarProduccion = (id, data) => {
    setProduccionId(id);
    setProduccionData(data);
  };

  return (
    <ProduccionContext.Provider 
      value={{ 
        produccionId, 
        produccionData, 
        actualizarProduccion 
      }}
    >
      {children}
    </ProduccionContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useProduccion = () => useContext(ProduccionContext);