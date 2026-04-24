import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    const savedToken = localStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

    if (savedToken) {
      try {
        const res = await fetch(`${apiUrl}/api/session`, {
          headers: {
            "Authorization": `Bearer ${savedToken}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          setUser({
            id: data.id,
            nombre: data.nombre,
            email: data.sub,
            rol: data.rol
          });
        } else {
          logout();
        }
      } catch (error) {
        console.error("Error validando sesión:", error);
        setUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
