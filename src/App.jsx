import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Predictor from './pages/Predictor';
import BatchPredictor from './pages/BatchPredictor';
import HistoryView from './pages/HistoryView';
import BatchHistoryView from './pages/BatchHistoryView';
import ResultsView from './pages/ResultsView';


function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas Protegidas para ANALYST y ADMIN */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_ADMIN', 'ROLE_ANALYST']} />}>
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/predict" element={<Layout><Predictor /></Layout>} />
        <Route path="/batch" element={<Layout><BatchPredictor /></Layout>} />
        <Route path="/history" element={<Layout><HistoryView /></Layout>} />
        <Route path="/batch-history" element={<Layout><BatchHistoryView /></Layout>} />
        <Route path="/resultados" element={<Layout><ResultsView /></Layout>}  />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;