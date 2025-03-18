import React from 'react';
import { ChevronDown } from 'lucide-react';

const DatosGenerales = () => {
  return (
    <div className="mb-4">
      <div className="bg-blue-600 text-white py-2 px-4 font-semibold rounded-t-md">
        Datos generales
      </div>
      <div className="bg-white p-4 border border-gray-300 rounded-b-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <label className="w-32 text-gray-700">Centros</label>
            <div className="relative flex-1">
              <select 
                className="w-full border border-gray-300 rounded px-3 py-2 appearance-none"
                name="centro"
              >
                <option value="">Seleccionar centro...</option>
              </select>
              <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500" />
            </div>
          </div>
          <div className="flex items-center">
            <label className="w-32 text-gray-700">Orden</label>
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              name="orden"
              placeholder="Número de orden"
            />
          </div>

          <div className="flex items-center">
            <label className="w-32 text-gray-700">Departamentos</label>
            <div className="relative flex-1">
              <select 
                className="w-full border border-gray-300 rounded px-3 py-2 appearance-none"
                name="departamento"
              >
                <option value="">Seleccionar departamento...</option>
              </select>
              <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500" />
            </div>
          </div>
          <div className="flex items-center">
            <label className="w-32 text-gray-700">Lote</label>
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              name="lote"
              placeholder="Número de lote"
            />
          </div>

          <div className="flex items-center">
            <label className="w-32 text-gray-700">Proceso</label>
            <div className="relative flex-1">
              <select 
                className="w-full border border-gray-300 rounded px-3 py-2 appearance-none"
                name="proceso"
              >
                <option value="">Seleccionar proceso...</option>
              </select>
              <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500" />
            </div>
          </div>
          
          <div className="flex items-center">
            <label className="w-32 text-gray-700">Velocidad</label>
            <input
              type="number"
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              name="velocidad"
              placeholder="Velocidad"
            />
          </div>
          
          <div className="flex items-center">
            <label className="w-32 text-gray-700">Líneas</label>
            <div className="relative flex-1">
              <select 
                className="w-full border border-gray-300 rounded px-3 py-2 appearance-none"
                name="linea"
              >
                <option value="">Seleccionar línea...</option>
              </select>
              <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500" />
            </div>
          </div>
          <div className="flex items-center">
            <label className="w-32 text-gray-700">Grupo</label>
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              name="grupos"
              placeholder="Número de grupos"
            />
          </div>
          <div className="flex items-center">
            <label className="w-32 text-gray-700">Material</label>
            <div className="relative flex-1">
              <select 
                className="w-full border border-gray-300 rounded px-3 py-2 appearance-none"
                name="material"
              >
                <option value="">Seleccionar material...</option>
              </select>
              <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500" />
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
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatosGenerales;