// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { LogIn, Mail, Lock } from 'lucide-react'; // Agregué iconos para mejor UX

const LoginPage = () => {
  // 1. CAMBIO: El estado ahora maneja 'email' para coincidir con el DTO de Java
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("🚀 [Frontend] Enviando credenciales:", credentials);

    try {
      // Nota: Spring Boot espera { email: "...", password: "..." }
      const response = await api.post('/auth/login', credentials);
      
      console.log("✅ [Frontend] Login exitoso:", response.data);
      login(response.data);
      navigate('/');
      
    } catch (error) {
      console.error("❌ [Frontend] Error:", error);
      
      // Manejo de errores amigable
      if (error.response?.status === 400) {
        alert("Formato inválido. Asegúrate de enviar un correo válido.");
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Credenciales incorrectas.");
      } else {
        alert("Error de conexión con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-3 rounded-lg text-white">
            <LogIn size={32} />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">ChurnInsight</h2>
        <p className="text-center text-slate-500 mb-8">Ingresa para gestionar la retención</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* CAMPO DE EMAIL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input
                name="email"        
                type="email"        
                required
                placeholder="ejemplo@empresa.com"
                value={credentials.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* CAMPO DE PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors shadow-lg shadow-blue-200 disabled:bg-blue-300"
          >
            {loading ? 'Validando...' : 'Entrar al Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;