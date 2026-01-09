import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Search, LogOut, Zap, FileSpreadsheet } from 'lucide-react';

const Layout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Para saber en qué ruta estamos

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Función para estilos activos
  const activeClass = (path) => 
    location.pathname === path 
      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
      : "text-slate-400 hover:bg-slate-800 hover:text-white";

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        {/* Logo */}
        <div className="p-6 flex items-center gap-2 font-bold text-xl border-b border-slate-800">
          <Zap className="text-yellow-400" fill="currentColor" />
          <span className="tracking-tight">ChurnInsight</span>
        </div>
        
        {/* Navegación */}
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/" className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${activeClass('/')}`}>
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link to="/predict" className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${activeClass('/predict')}`}>
            <Search size={20} />
            <span className="font-medium">Análisis Individual</span>
          </Link>

          {/* NUEVO: Enlace para Carga Batch */}
          <Link to="/batch" className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${activeClass('/batch')}`}>
            <FileSpreadsheet size={20} />
            <span className="font-medium">Carga Masiva (.csv)</span>
          </Link>
        </nav>

        {/* Perfil y Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="mb-4 px-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Sesión activa</p>
            <p className="text-sm font-medium text-slate-300 truncate">{user?.username || 'Analista'}</p>
            <span className="text-[9px] bg-slate-800 text-blue-400 px-2 py-0.5 rounded-full border border-blue-900/30 capitalize">
               {user?.role?.replace('ROLE_', '').toLowerCase() || 'invitado'}
            </span>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
          >
            <LogOut size={18} />
            <span className="font-semibold text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <header className="bg-white border-b border-slate-200 py-4 px-8 flex justify-between items-center sticky top-0 z-10">
           <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
             {location.pathname === '/' ? 'Resumen General' : 'Módulo de Predicción'}
           </h2>
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Sistema Online</span>
           </div>
        </header>
        
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;