import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNotification } from '../components/NotificationProvider.jsx';
import statisticsImage from '../img/fondoUsuario.png';
import Navbar from './Navbar';

const RegisterForm = () => {
  const { showSuccess, showError } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [isVerifyingUser, setIsVerifyingUser] = useState(false);

  // Opciones para el selector de puesto
  const tipoUsuarioOptions = [
    { value: '', label: 'Selecciona una opción' },
    { value: 'Usuario', label: 'Usuario' },
    { value: 'Administrador', label: 'Administrador' }
  ];

  // Schema de validación con Yup
  const validationSchema = Yup.object({
    nombreUsuario: Yup.string()
      .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
      .max(20, 'El nombre de usuario no debe exceder los 20 caracteres')
      .matches(
        /^[a-zA-Z0-9._-]+$/,
        'El nombre de usuario solo puede contener letras, números, puntos, guiones y guiones bajos'
      )
      .test(
        'no-spaces',
        'El nombre de usuario no puede contener espacios',
        value => !value || !value.includes(' ')
      )
      .test(
        'not-only-numbers',
        'El nombre de usuario no puede contener solo números',
        value => !value || !/^\d+$/.test(value)
      )
      .required('El nombre de usuario es obligatorio'),
    contrasena: Yup.string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial'
      )
      .required('La contraseña es obligatoria'),
    familia: Yup.string()
      .required('La familia es obligatoria'),
    puesto: Yup.string()
      .required('Debes seleccionar un puesto')
  });

  // Función para verificar disponibilidad de nombre de usuario
  const checkUsernameTaken = async (username, setFieldError) => {
    // Validación de formato antes de consultar la base de datos
    try {
      await validationSchema.fields.nombreUsuario.validate(username);
    } catch (error) {
      setFieldError('nombreUsuario', error.message);
      return false;
    }

    setIsVerifyingUser(true);
    
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/usuario/check-username?username=${encodeURIComponent(username)}`);
      
      if (!response.ok) {
        throw new Error('Error al verificar nombre de usuario');
      }
      
      const data = await response.json();
      
      if (data.disponible) {
        showSuccess(data.mensaje || 'Nombre de usuario disponible');
        setIsUserVerified(true);
        return true;
      } else {
        showError(data.mensaje || 'El nombre de usuario ya está en uso');
        setFieldError('nombreUsuario', data.mensaje || 'Este nombre de usuario ya está en uso');
        setIsUserVerified(false);
        return false;
      }
    } catch (error) {
      console.error('Error al verificar nombre de usuario:', error);
      showError('No se pudo verificar la disponibilidad del nombre de usuario');
      setIsUserVerified(false);
      return false;
    } finally {
      setIsVerifyingUser(false);
    }
  };

  const handleSubmit = async (values, { resetForm, setFieldError, setSubmitting }) => {
    // Verificar si el usuario ha sido verificado antes de enviar
    if (!isUserVerified) {
      showError('Por favor, verifica la disponibilidad del nombre de usuario primero');
      return;
    }

    setIsLoading(true);
    
    try {
      // Mapear el valor del puesto al idRol correspondiente
      const idRol = values.puesto === 'Usuario' ? '67b3ef205de7d75b4cd02e5d' : 
                   values.puesto === 'Administrador' ? '67b3ee195de7d75b4cd02e56' : '';
      
      // Preparar datos para enviar al servidor
      const formData = {
        nombreUsuario: values.nombreUsuario,
        contrasena: values.contrasena,
        familia: values.familia,
        idRol: idRol
      };
      
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/usuario`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData)
      });
      
      // Log the full response for debugging
      const responseText = await response.text();
      console.log('Server Response:', {
        status: response.status,
        body: responseText
      });

      // Procesar la respuesta
      if (!response.ok) {
        // Intentar parsear el mensaje de error
        let errorMessage = 'Error al registrar usuario';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.mensaje || errorMessage;
        } catch {
          errorMessage = responseText || errorMessage;
        }

        showError(errorMessage);
        throw new Error(errorMessage);
      }

      // Parsear respuesta exitosa
      const data = JSON.parse(responseText);
      
      showSuccess(data.mensaje || 'Usuario registrado exitosamente');
      resetForm();
      setIsUserVerified(false);
    } catch (error) {
      console.error('Error de registro completo:', error);
      
      // Mostrar mensaje de error más detallado
      showError(error.message || 'Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar/>
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl mx-auto my-10">
        {/* Sección de la imagen */}
        <div className="md:w-1/2 bg-blue-50">
          <div className="h-full flex items-center justify-center p-6">
            <img 
              src={statisticsImage} 
              alt="Estadísticas" 
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>
        
        {/* Sección del formulario */}
        <div className="md:w-1/2 p-8">
          <Formik
            initialValues={{
              nombreUsuario: '',
              contrasena: '',
              familia: '',
              puesto: ''
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, isSubmitting, setFieldValue, setFieldError }) => (
              <Form className="space-y-6">
                <h1 className="text-2xl font-bold text-blue-700 mb-6">Registrar Usuario</h1>
                
                <div className="space-y-2">
                  <label htmlFor="nombreUsuario" className="block text-sm font-medium text-gray-700">
                    Usuario
                  </label>
                  <div className="flex items-center space-x-2">
                    <Field
                      type="text"
                      id="nombreUsuario"
                      name="nombreUsuario"
                      className={`flex-grow px-3 py-2 border ${
                        (errors.nombreUsuario && touched.nombreUsuario)
                          ? 'border-red-500' 
                          : isUserVerified
                          ? 'border-green-500'
                          : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                      onChange={(e) => {
                        const username = e.target.value;
                        setFieldValue('nombreUsuario', username);
                        setIsUserVerified(false);
                      }}
                    />
                    {/* Modificación para mostrar el botón cuando hay texto */}
                    {values.nombreUsuario.length >= 3 && !isUserVerified && (
                      <button
                        type="button"
                        onClick={() => checkUsernameTaken(values.nombreUsuario, setFieldError)}
                        disabled={isVerifyingUser} 
                        className={`px-4 py-2 rounded-md transition duration-150 ease-in-out ${
                          isVerifyingUser
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isVerifyingUser ? 'Verificando...' : 'Verificar'}
                      </button>
                    )}
                    {isUserVerified && (
                      <span className="text-green-600 font-medium ml-2">
                        ✓ Verificado
                      </span>
                    )}
                  </div>
                  <ErrorMessage 
                    name="nombreUsuario" 
                    component="div" 
                    className="text-red-500 text-sm mt-1" 
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">
                    Contraseña
                  </label>
                  <Field
                    type="password"
                    id="contrasena"
                    name="contrasena"
                    className={`w-full px-3 py-2 border ${
                      errors.contrasena && touched.contrasena ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  />
                  <ErrorMessage 
                    name="contrasena" 
                    component="div" 
                    className="text-red-500 text-sm mt-1" 
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="familia" className="block text-sm font-medium text-gray-700">
                    Familia
                  </label>
                  <Field
                    type="text"
                    id="familia"
                    name="familia"
                    className={`w-full px-3 py-2 border ${
                      errors.familia && touched.familia ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  />
                  <ErrorMessage 
                    name="familia" 
                    component="div" 
                    className="text-red-500 text-sm mt-1" 
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="puesto" className="block text-sm font-medium text-gray-700">
                    Tipo de usuario
                  </label>
                  <Field
                    as="select"
                    id="puesto"
                    name="puesto"
                    className={`w-full px-3 py-2 border ${
                      errors.puesto && touched.puesto ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white`}
                  >
                    {tipoUsuarioOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage 
                    name="puesto" 
                    component="div" 
                    className="text-red-500 text-sm mt-1" 
                  />
                </div>

                <button 
                  type="submit" 
                  className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out mt-6 shadow-md ${
                    (isLoading || isSubmitting || !isUserVerified) 
                      ? 'opacity-70 cursor-not-allowed' 
                      : ''
                  }`}
                  style={{
                    backgroundColor: '#2563EB',
                    fontWeight: '500'
                  }}
                  disabled={isLoading || isSubmitting || !isUserVerified}
                >
                  {(isLoading || isSubmitting) ? 'Registrando...' : 'Registrar'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;