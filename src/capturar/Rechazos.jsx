import React from 'react';
import { ChevronDown, Plus } from 'lucide-react';

const Rechazos = () => {
  return (
    <div className="mb-4">
      <div className="bg-blue-600 text-white py-2 px-4 font-semibold rounded-t-md">
        Rechazos
      </div>
      <div className="bg-white p-4 border border-gray-300 rounded-b-md">
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
                className="w-full border border-gray-300 rounded px-3 py-2 appearance-none"
                name="tipo"
              >
                <option value="">Seleccionar rechazo...</option>
              </select>
              <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500" />
            </div>
          </div>
          <div className="w-1/3 px-2">
            <input
              type="number"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="0"
              name="cantidad"
              min="0"
            />
          </div>
          <div className="w-1/6 pl-2 flex justify-center">
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" /> Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rechazos;