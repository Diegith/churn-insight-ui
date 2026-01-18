import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. INICIALIZACIÓN SEGURA
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error leyendo sesión:", error);
      localStorage.removeItem('user'); // Si está corrupto, lo borramos
      return null;
    }
  });

  const login = (userData) => {
    console.log("📥 Recibiendo datos de login del Backend:", userData);

    // 2. NORMALIZACIÓN DE DATOS (El truco mágico)
    // Buscamos el ID en cualquier variante posible que mande Java
    const normalizedUser = {
      ...userData,
      id: userData.id || userData.userId || userData.id_usuario || userData.sub,
    };

    if (!normalizedUser.id) {
      console.error("⚠️ ALERTA CRÍTICA: El backend no devolvió un ID de usuario.");
      console.warn("Revisa tu AuthController en Java.");
    }

    localStorage.setItem('user', JSON.stringify(normalizedUser));
    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Utilidad para verificar roles
  const hasRole = (rolesPermitidos) => {
    const userRole = user?.rol || user?.role || user?.roles?.[0]; // Soporte para array o string
    if (!user || !userRole) return false;
    
    // Si rolesPermitidos es array, usamos includes. Si es string, comparamos directo.
    if (Array.isArray(rolesPermitidos)) {
        return rolesPermitidos.includes(userRole);
    }
    return userRole === rolesPermitidos;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);