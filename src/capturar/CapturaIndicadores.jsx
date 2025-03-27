import React, { useState, useEffect } from 'react';
import { ProduccionProvider, useProduccion } from '../context/ProduccionContext';
import DatosGenerales from './DatosGenerales.jsx';
import DatosIndicador from './DatosIndicador.jsx';
import Rechazos from './Rechazos.jsx';
import Paros from './Paros.jsx';
import { Save } from 'lucide-react';

// Componente interno que tiene acceso al contexto
const CapturaIndicadoresContent = () => {
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const { produccionId, guardadoCompleto, resetearProduccion } = useProduccion();
  
  const indicadorRef = React.useRef();
  const generalesRef = React.useRef();

  // Este efecto se activará cuando el ID de producción cambie
  useEffect(() => {
    const guardarDatosGenerales = async () => {
      // Solo proceder si tenemos un ID de producción y guardadoCompleto es true
      if (produccionId && guardadoCompleto && generalesRef.current && generalesRef.current.handleSubmit) {
        try {
          console.log('Guardando datos generales con produccionId:', produccionId);
          const event = new Event('submit', { cancelable: true });
          await generalesRef.current.handleSubmit(event);
          
          setMensaje({
            texto: 'Todos los datos fueron guardados correctamente',
            tipo: 'success'
          });
        } catch (error) {
          console.error('Error al guardar datos generales:', error);
          setMensaje({
            texto: 'Error al guardar los datos generales: ' + (error.message || 'Error desconocido'),
            tipo: 'error'
          });
        } finally {
          setGuardando(false);
          // Limpiamos el mensaje después de 3 segundos
          setTimeout(() => {
            setMensaje({ texto: '', tipo: '' });
          }, 3000);
        }
      }
    };

    guardarDatosGenerales();
  }, [produccionId, guardadoCompleto]);

  const handleGuardarTodo = async () => {
    try {
      setGuardando(true);
      resetearProduccion(); // Resetear el estado del contexto antes de comenzar
      
      // Solo guardar DatosIndicador - DatosGenerales se guardará automáticamente después
      if (indicadorRef.current && indicadorRef.current.handleSubmit) {
        console.log('Guardando datos del indicador...');
        const event = new Event('submit', { cancelable: true });
        await indicadorRef.current.handleSubmit(event);
      }
    } catch (error) {
      console.error('Error en el proceso de guardado:', error);
      setMensaje({
        texto: 'Error al guardar los datos: ' + (error.message || 'Error desconocido'),
        tipo: 'error'
      });
      setGuardando(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">
            Captura de Indicadores
          </h1>
          <button
            onClick={handleGuardarTodo}
            disabled={guardando}
            className={`flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ${
              guardando ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <Save className="h-5 w-5" />
            {guardando ? 'Guardando...' : 'Guardar Todo'}
          </button>
        </div>

        {mensaje.texto && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              mensaje.tipo === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {mensaje.texto}
          </div>
        )}
         <DatosGenerales ref={generalesRef} />
        <DatosIndicador ref={indicadorRef} />
       
        <Rechazos />
        <Paros />
      </div>
    </div>
  );
};

// Componente principal que envuelve el contenido con el proveedor
const CapturaIndicadores = () => {
  return (
    <ProduccionProvider>
      <CapturaIndicadoresContent />
    </ProduccionProvider>
  );
};

export default CapturaIndicadores;