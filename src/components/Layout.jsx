import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Usamos 'Search' que es un estándar garantizado en Lucide
import { LayoutDashboard, Search, LogOut, Zap } from 'lucide-react';

const Layout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6 flex items-center gap-2 font-bold text-xl border-b border-slate-800">
          <Zap className="text-yellow-400" fill="currentColor" />
          <span className="tracking-tight">ChurnInsight</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-all duration-200 group">
            <LayoutDashboard size={20} className="text-slate-400 group-hover:text-white" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link to="/predict" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-all duration-200 group">
            <Search size={20} className="text-slate-400 group-hover:text-white" />
            <span className="font-medium">Predecir Churn</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="mb-4 px-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Sesión activa</p>
            <p className="text-sm font-medium text-slate-300 truncate">{user?.username || 'Analista'}</p>
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

      <main className="flex-1 overflow-y-auto bg-slate-50">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;