import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './components/NotificationProvider';
import LoginPage from './pages/LoginPage';
import PaginaPrincipal from '../src/pages/PaginaPrincipal.jsx'
import UserManagement from '../src/components/UserManagement.jsx'
import RegisterForm from './components/RegisterForm.jsx'
import PaginaUsuario from './pages/PaginaUsuario.jsx';
import EditarIndicador from './pages/EditarIndicador.jsx';
import ReportBoard1 from './pages/ReportBoard1.jsx';
import ReportCompliance from './pages/ReportCompliance.jsx';
import Grafica1 from './pages/Grafica1.jsx';
import { AuthProvider } from './context/AuthContext';
import { ProduccionProvider } from './context/ProduccionContext.jsx';

function App() {
  return (
    <AuthProvider>
        <ProduccionProvider>
         <NotificationProvider>
          <BrowserRouter>
        
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path='/inicio' element={<PaginaPrincipal/>} />
              <Route path='/usuario' element= {<UserManagement/>} />
              <Route path='/usuarioRegistrado' element= {<RegisterForm/>} />
              <Route path='/paginaUsuario' element= {<PaginaUsuario/>} />
              <Route path='/editarIndicadores' element= {<EditarIndicador/>} />
              <Route path='/reporte1' element= {<ReportBoard1/>} />
              <Route path='/reporte2' element= {<ReportCompliance/>} />
              <Route path='/reporte3' element= {<Grafica1/>} />
              
            </Routes>

          </BrowserRouter>
       </NotificationProvider>
      </ProduccionProvider>
    </AuthProvider>
  );
}

export default App;