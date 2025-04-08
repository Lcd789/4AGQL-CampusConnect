// src/context/AuthContext.tsx
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { decodeJWT } from "../utils/jwt";

type User = {
  id: string;
  email: string;
  role: "student" | "professor";
  name: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          // Vérifier si le token est valide
          const decoded = decodeJWT(token);
          
          // Vérifier si le token n'est pas expiré
          if (decoded.exp * 1000 < Date.now()) {
            const refreshed = await refreshToken();
            if (!refreshed) {
              handleLogout();
            }
          } else {
            setUser({
              id: decoded.sub,
              email: decoded.email,
              role: decoded.role,
              name: decoded.name
            });
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Token invalide", error);
          handleLogout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    
    const decoded = decodeJWT(newToken);
    setUser({
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name
    });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      // Appel à votre API pour rafraîchir le token
      const response = await fetch('YOUR_API_URL/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Pour inclure les cookies
      });
      
      if (!response.ok) {
        throw new Error('Échec du rafraîchissement du token');
      }
      
      const data = await response.json();
      login(data.token);
      return true;
    } catch (error) {
      console.error("Erreur lors du rafraîchissement du token", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout: handleLogout,
        refreshToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};