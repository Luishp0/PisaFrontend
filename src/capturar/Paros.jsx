import React from 'react';
import { ChevronDown, Plus } from 'lucide-react';

const Paros = () => {
  return (
    <div className="mb-4">
      <div className="bg-blue-600 text-white py-2 px-4 font-semibold rounded-t-md">
        Paros
      </div>
      <div className="bg-white p-4 border border-gray-300 rounded-b-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 mb-4">
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
                >
                  <option value="">Seleccione...</option>
                </select>
                <ChevronDown className="absolute right-2 top-2 h-4 w-4 text-gray-500 pointer-events-none" />
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
              defaultValue="0"
              min="0"
            />
          </div>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" /> Agregar
          </button>
        </div>

        
      </div>
    </div>
  );
};

export default Paros;