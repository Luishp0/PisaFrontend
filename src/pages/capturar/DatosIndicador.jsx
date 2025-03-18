import React from 'react';
import { Calendar, ChevronDown, Info } from 'lucide-react';

const DatosIndicador = () => {
  return (
    <div className="mb-4">
      <div className="bg-blue-600 text-white py-2 px-4 font-semibold rounded-t-md">
        Datos de Indicador
      </div>
      <div className="bg-white p-4 border border-gray-300 rounded-b-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <label className="w-32 text-gray-700">
              Piezas<br />Producidas
            </label>
            <input
              type="number"
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              name="piezasProducidas"
              min="0"
            />
          </div>
          <div className="flex items-center justify-end">
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Reloj
            </button>
          </div>

          <div className="flex items-center">
            <label className="w-32 text-gray-700">Fecha</label>
            <div className="relative flex-1">
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2"
                name="fecha"
                value={new Date().toISOString().split('T')[0]}
              />
              <Calendar className="absolute right-2 top-3 h-4 w-4 text-gray-500" />
            </div>
          </div>
          <div className="flex items-center">
            <label className="w-32 text-gray-700">Motivo</label>
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              name="motivo"
              placeholder="Motivo"
            />
          </div>

          <div className="flex items-center">
            <label className="w-32 text-gray-700">Hora</label>
            <div className="flex gap-2">
              <div className="relative">
                <select 
                  className="border border-gray-300 rounded px-3 py-2 w-20 appearance-none"
                  name="hora"
                  defaultValue="08"
                >
                  {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                    <option key={hour} value={hour.toString().padStart(2, '0')}>
                      {hour.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500" />
              </div>
              <div className="relative">
                <select 
                  className="border border-gray-300 rounded px-3 py-2 w-20 appearance-none"
                  name="minuto"
                  defaultValue="00"
                >
                  {Array.from({ length: 60 }, (_, i) => i).map(minute => (
                    <option key={minute} value={minute.toString().padStart(2, '0')}>
                      {minute.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <label className="w-32 text-gray-700">Ciclo</label>
            <input
              type="number"
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              name="ciclo"
              defaultValue="60"
              min="0"
            />
          </div>

          <div className="flex items-center">
            <label className="w-32 text-gray-700">Turno</label>
            <div className="relative flex-1">
              <select 
                className="w-full border border-gray-300 rounded px-3 py-2 appearance-none"
                name="turno"
              >
                <option value="">Seleccionar turno...</option>
              </select>
              <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded flex items-start">
          <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
          <p className="text-blue-700">Debes capturar lo equivalente a <span className="font-bold">60</span> minutos de paros</p>
        </div>
      </div>
    </div>
  );
};

export default DatosIndicador;