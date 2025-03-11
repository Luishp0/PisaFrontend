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

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/i" element={<LoginPage />} />
          <Route path='/inicio' element={<PaginaPrincipal/>} />
          <Route path='/usuario' element= {<UserManagement/>} />
          <Route path='/' element= {<RegisterForm/>} />
          <Route path='/usuario2' element= {<PaginaUsuario/>} />
          <Route path='/editarIndicadores' element= {<EditarIndicador/>} />
          <Route path='/reporte1' element= {<ReportBoard1/>} />
          <Route path='/reporte2' element= {<ReportCompliance/>} />
          <Route path='/reporte3' element= {<Grafica1/>} />
          
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;