// src/App.jsx
// Archivo principal que define las rutas de la aplicación
 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminPanel  from './pages/AdminPanel';
 
function App() {
  return (
    // BrowserRouter habilita la navegación entre páginas
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz: muestra la Landing Page */}
        <Route path='/'      element={<LandingPage />} />
        {/* Ruta /admin: muestra el Panel de Administración */}
        <Route path='/admin' element={<AdminPanel />}  />
      </Routes>
    </BrowserRouter>
  );
}
 
export default App;

