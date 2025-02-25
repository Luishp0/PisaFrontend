import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './components/NotificationProvider';
import LoginPage from './pages/LoginPage';
import PaginaPrincipal from '../src/pages/PaginaPrincipal.jsx'
import UserManagement from '../src/components/UserManagement.jsx'
import RegisterForm from './components/RegisterForm.jsx'

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path='/inicio' element={<PaginaPrincipal/>} />
          <Route path='/usuario' element= {<UserManagement/>} />
          <Route path='/usuarioRegistrado' element= {<RegisterForm/>} />
          
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;