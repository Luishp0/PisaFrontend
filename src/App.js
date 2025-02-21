import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';  // Ajusta la ruta según tu estructura de archivos
import PaginaPrincipal from './pages/PaginaPrincipal.jsx'
import UserManagement from './components/UserManagement.jsx';
import RegisterForm from './components/RegisterForm.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/inicio" element={<PaginaPrincipal/>} />
      <Route path='/usuario' element={<UserManagement/>} />
      <Route path='/usuarioRegistro' element={<RegisterForm/>} />
      
    </Routes>
  );
}

export default App;