import React, { useState } from 'react';
import { Calendar, ChevronDown, Info, X } from 'lucide-react';

const EditarIndicador = () => {
  const [paros, setParos] = useState([
    { id: 1, nombre: 'Sin causa asignada', cantidad: 0 },
    { id: 2, nombre: 'TARIMA PLASTICA', cantidad: 10 },
    { id: 3, nombre: 'PL-L1-PRUEBAS DE MATERIAL', cantidad: 50 }
  ]);

  const niveles = [
    {
      id: 1,
      titulo: 'Nivel 1',
      items: [
        'ADMINISTRATIVO',
        'CAMBIOS Y LIMPIEZAS',
        'COMEDOR',
        'CUMPLIMIENTO NORMATIVO',
        'DEFECTOS',
        'DIA FESTIVO',
        'INEFICIENCIA',
        'MTTO PREVENTIVO',
        'PROYECTOS/PAROS MAYORES',
        'SERVICIOS',
        'SIN PROGRAMA',
        'SIN TURNO'
      ]
    },
    {
      id: 2,
      titulo: 'Nivel 2',
      items: ['LAB-L1-RESULTADOS DE LABORATORIO', 'PL-L1-PRUEBAS DE MATERIAL', 'PL-L1-PRUEBAS DESARROLLO']
    },
    { id: 3, titulo: 'Nivel 3', items: [] },
    { id: 4, titulo: 'Nivel 4', items: [] },
    { id: 5, titulo: 'Nivel 5', items: [] }
  ];

  const [selectedNivel, setSelectedNivel] = useState(null);

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">Captura de Indicadores</h1>

        {/* Datos generales */}
        <div className="mb-4">
          <div className="bg-blue-600 text-white py-2 px-4 font-semibold rounded-t-md">
            Datos generales
          </div>
          <div className="bg-white p-4 border border-gray-300 rounded-b-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <label className="w-32 text-gray-700">Centros</label>
                <div className="relative flex-1">
                  <select className="w-full border border-gray-300 rounded px-3 py-2 appearance-none">
                    <option>P108</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500" />
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-32 text-gray-700">Orden</label>
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded px-3 py-2"
                  defaultValue="12266177"
                />
              </div>

              <div className="flex items-center">
                <label className="w-32 text-gray-700">Departamentos</label>
                <div className="relative flex-1">
                  <select className="w-full border border-gray-300 rounded px-3 py-2 appearance-none">
                    <option>801</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500" />
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-32 text-gray-700">Lote</label>
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded px-3 py-2"
                  defaultValue="Q24E028"
                />
              </div>

              <div className="flex items-center">
                <label className="w-32 text-gray-700">Proceso</label>
                <div className="relative flex-1">
                  <select className="w-full border border-gray-300 rounded px-3 py-2 appearance-none">
                    <option>BOLSAS LINEA 1</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500" />
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-32 text-gray-700">Velocidad</label>
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded px-3 py-2"
                  defaultValue="3146"
                />
              </div>

              <div className="flex items-center">
                <label className="w-32 text-gray-700">Líneas</label>
                <div className="relative flex-1">
                  <select className="w-full border border-gray-300 rounded px-3 py-2 appearance-none">
                    <option>DOSIFICADO</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500" />
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-32 text-gray-700">Material</label>
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded px-3 py-2"
                  defaultValue="4003179"
                />
              </div>

              <div className="flex items-center md:col-span-2">
                <label className="w-32 text-gray-700">
                  Descripción<br />de Material
                </label>
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded px-3 py-2"
                  defaultValue="2356 DP1 5% 2L MODIF M"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Datos de Indicador */}
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
                  defaultValue="0"
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
                    defaultValue="2025-01-01"
                  />
                  <Calendar className="absolute right-2 top-3 h-4 w-4 text-gray-500" />
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-32 text-gray-700">Motivo</label>
                <div className="relative flex-1">
                  <select className="w-full border border-gray-300 rounded px-3 py-2 appearance-none">
                    <option>Motivo</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500" />
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-32 text-gray-700">Hora</label>
                <div className="flex gap-2">
                  <div className="relative">
                    <select className="border border-gray-300 rounded px-3 py-2 w-20 appearance-none">
                      <option>08</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500" />
                  </div>
                  <div className="relative">
                    <select className="border border-gray-300 rounded px-3 py-2 w-20 appearance-none">
                      <option>00</option>
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
                  defaultValue="60"
                />
              </div>

              <div className="flex items-center">
                <label className="w-32 text-gray-700">Turno</label>
                <div className="relative flex-1">
                  <select className="w-full border border-gray-300 rounded px-3 py-2 appearance-none">
                    <option>C</option>
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

        {/* Rechazos */}
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
                  <select className="w-full border border-gray-300 rounded px-3 py-2 appearance-none">
                    <option value="">Seleccionar rechazo...</option>
                    <option value="Defecto visual">Defecto visual</option>
                    <option value="Defecto dimensional">Defecto dimensional</option>
                    <option value="Material contaminado">Material contaminado</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500" />
                </div>
              </div>
              <div className="w-1/3 px-2">
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="0"
                />
              </div>
              <div className="w-1/6 pl-2 flex justify-center">
                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Paros */}
        <div className="mb-4">
          <div className="bg-blue-600 text-white py-2 px-4 font-semibold rounded-t-md">
            Paros
          </div>
          <div className="bg-white p-4 border border-gray-300 rounded-b-md">
            <div className="grid grid-cols-5 gap-2 mb-4">
              {niveles.map((nivel) => (
                <div 
                  key={nivel.id} 
                  className="border border-gray-300 rounded"
                >
                  <div className="bg-gray-100 p-2 text-center text-sm font-semibold border-b border-gray-300">
                    {nivel.titulo}
                  </div>
                  <div className="relative">
                    <select className="w-full border-0 p-2 appearance-none text-sm bg-white cursor-pointer">
                      <option value="">Seleccione...</option>
                      {nivel.items.map((item, idx) => (
                        <option key={idx} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-2 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mb-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Agregar
              </button>
            </div>

            <div className="grid grid-cols-12 gap-4 mb-2">
              <div className="col-span-5">
                <label className="text-gray-700">Paro</label>
              </div>
              <div className="col-span-3">
                <label className="text-gray-700">Cantidad</label>
              </div>
              <div className="col-span-4">
                <label className="text-gray-700">Folio solicitud de trabajo</label>
              </div>
            </div>

            {paros.map((paro) => (
              <div key={paro.id} className="grid grid-cols-12 gap-4 mb-2 items-center">
                <div className="col-span-5">
                  <span className="text-gray-700">{paro.nombre}</span>
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={paro.cantidad}
                    onChange={(e) => {
                      const newParos = [...paros];
                      const index = newParos.findIndex((p) => p.id === paro.id);
                      newParos[index].cantidad = e.target.value;
                      setParos(newParos);
                    }}
                  />
                </div>
                <div className="col-span-3">
                  {paro.id !== 1 && (
                    <div className="h-8 flex items-center">
                      <span className="text-red-500">•</span>
                    </div>
                  )}
                </div>
                <div className="col-span-1 flex justify-center">
                  {paro.id !== 1 && (
                    <button className="text-red-500">
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="mt-6 flex justify-between">
              <button className="bg-blue-600 text-white px-6 py-2 rounded">
                Guardar
              </button>
              <a href="#" className="text-blue-600 hover:underline py-2">
                Regresar al reporte de indicadores
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarIndicador;