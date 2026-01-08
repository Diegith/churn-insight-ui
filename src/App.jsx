import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Predictor from './pages/Predictor';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas Protegidas para ANALYST y ADMIN */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_ADMIN', 'ROLE_ANALYST']} />}>
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/predict" element={<Layout><Predictor /></Layout>} />
        {/* Aquí puedes añadir la ruta del predictor después */}
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;