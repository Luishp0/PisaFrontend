import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';  // Ajusta la ruta según tu estructura de archivos
import PaginaPrincipal from './pages/PaginaPrincipal.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/inicio" element={<PaginaPrincipal/>} />
      
    </Routes>
  );
}

export default App;