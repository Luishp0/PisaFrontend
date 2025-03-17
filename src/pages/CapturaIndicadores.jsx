import React from 'react';
import { Calendar, ChevronDown, Info, Plus, Trash2 } from 'lucide-react';

const CapturaIndicadores = () => {
  // Datos de ejemplo para la interfaz
  const centros = [{ id: 1, nombre: 'Centro 1' }, { id: 2, nombre: 'Centro 2' }];
  const departamentos = [{ id: 1, nombre: 'Departamento 1' }, { id: 2, nombre: 'Departamento 2' }];
  const procesos = [{ id: 1, nombre: 'Proceso 1' }, { id: 2, nombre: 'Proceso 2' }];
  const lineas = [{ id: 1, nombre: 'Línea 1' }, { id: 2, nombre: 'Línea 2' }];
  const turnos = [{ id: 1, nombre: 'Turno Mañana' }, { id: 2, nombre: 'Turno Tarde' }];
  const materiales = [{ id: 1, codigo: 'MAT-001' }, { id: 2, codigo: 'MAT-002' }];
  const rechazos = [{ id: 1, nombre: 'Defecto A' }, { id: 2, nombre: 'Defecto B' }];
  
  // Niveles de paros para la UI
  const nivelesParos = [
    { id: 1, titulo: 'Nivel 1', items: ['Mecánico', 'Eléctrico'] },
    { id: 2, titulo: 'Nivel 2', items: ['Motor', 'Sensor'] },
    { id: 3, titulo: 'Nivel 3', items: ['Reemplazo', 'Ajuste'] },
    { id: 4, titulo: 'Nivel 4', items: ['Completo', 'Parcial'] },
    { id: 5, titulo: 'Nivel 5', items: ['Urgente', 'Normal'] }
  ];
  
  // Ejemplo de rechazos agregados
  const rechazosAgregados = [
    { id: 101, tipo: 1, cantidad: 5 },
    { id: 102, tipo: 2, cantidad: 3 }
  ];
  
  // Ejemplo de paros seleccionados
  const parosSeleccionados = [
    { 
      id: 201, 
      nivel1: 'Mecánico', 
      nivel2: 'Motor', 
      nivel3: 'Reemplazo', 
      nivel4: '', 
      nivel5: '', 
      duracion: 30 
    },
    { 
      id: 202, 
      nivel1: 'Eléctrico', 
      nivel2: 'Sensor', 
      nivel3: '', 
      nivel4: '', 
      nivel5: '', 
      duracion: 15 
    }
  ];

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
                  <select 
                    className="w-full border border-gray-300 rounded px-3 py-2 appearance-none"
                    name="centro"
                  >
                    <option value="">Seleccionar centro...</option>
                    {centros.map(centro => (
                      <option key={centro.id} value={centro.id}>
                        {centro.nombre}
                      </option>
                    ))}
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
                    {departamentos.map(depto => (
                      <option key={depto.id} value={depto.id}>
                        {depto.nombre}
                      </option>
                    ))}
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
                    {procesos.map(proceso => (
                      <option key={proceso.id} value={proceso.id}>
                        {proceso.nombre}
                      </option>
                    ))}
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
                    {lineas.map(linea => (
                      <option key={linea.id} value={linea.id}>
                        {linea.nombre}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500" />
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-32 text-gray-700">Grupos</label>
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
                    {materiales.map(material => (
                      <option key={material.id} value={material.id}>
                        {material.codigo}
                      </option>
                    ))}
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
                    {turnos.map(turno => (
                      <option key={turno.id} value={turno.id}>
                        {turno.nombre}
                      </option>
                    ))}
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
                  <select 
                    className="w-full border border-gray-300 rounded px-3 py-2 appearance-none"
                    name="tipo"
                  >
                    <option value="">Seleccionar rechazo...</option>
                    {rechazos.map(rechazo => (
                      <option key={rechazo.id} value={rechazo.id}>
                        {rechazo.nombre}
                      </option>
                    ))}
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
            
            {/* Lista de rechazos agregados */}
            {rechazosAgregados.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Rechazos agregados</h3>
                <div className="space-y-2">
                  {rechazosAgregados.map(rechazo => {
                    const rechazoInfo = rechazos.find(r => r.id === rechazo.tipo);
                    return (
                      <div key={rechazo.id} className="flex justify-between items-center p-2 bg-gray-50 border rounded">
                        <div className="flex-1">
                          <p className="font-medium">{rechazoInfo?.nombre || 'Rechazo'}</p>
                        </div>
                        <div className="w-1/4 text-right">
                          <p>{rechazo.cantidad} unidades</p>
                        </div>
                        <div className="ml-2">
                          <button 
                            className="text-red-500 p-1 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Paros */}
        <div className="mb-4">
          <div className="bg-blue-600 text-white py-2 px-4 font-semibold rounded-t-md">
            Paros
          </div>
          <div className="bg-white p-4 border border-gray-300 rounded-b-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 mb-4">
              {nivelesParos.map((nivel) => (
                <div 
                  key={nivel.id} 
                  className="border border-gray-300 rounded"
                >
                  <div className="bg-gray-100 p-2 text-center text-sm font-semibold border-b border-gray-300">
                    {nivel.titulo}
                  </div>
                  <div className="relative">
                    <select 
                      className="w-full border-0 p-2 appearance-none text-sm bg-white cursor-pointer"
                      name={`nivel${nivel.id}`}
                    >
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
            
            {/* Lista de paros agregados */}
            {parosSeleccionados.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Paros agregados</h3>
                <div className="space-y-2">
                  {parosSeleccionados.map(paro => (
                    <div key={paro.id} className="p-2 bg-gray-50 border rounded">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="font-medium">{paro.nivel1}</p>
                          {paro.nivel2 && <p className="text-sm text-gray-600">{paro.nivel2}</p>}
                          {paro.nivel3 && <p className="text-sm text-gray-600">{paro.nivel3}</p>}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{paro.duracion} min</p>
                        </div>
                        <div className="ml-2">
                          <button 
                            className="text-red-500 p-1 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <button 
                className="bg-blue-600 text-white px-6 py-2 rounded"
              >
                Guardar
              </button>
              <button 
                className="bg-gray-500 text-white px-6 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapturaIndicadores;