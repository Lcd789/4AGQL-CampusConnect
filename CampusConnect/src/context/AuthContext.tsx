// src/context/AuthContext.tsx
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { decodeJWT } from "../utils/jwt";
import { useValidateToken } from "../api/auth/authQueries";
import { useRefreshToken} from "../api/auth/authMutations.ts";
import { User } from "../api/types";

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

  // Utiliser la requête validateToken pour vérifier le token côté serveur
  const { data: tokenData, loading: tokenLoading, error: tokenError } =
      useValidateToken(token || "");

  const [refreshTokenMutation] = useRefreshToken();

  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Vérification côté client pour détecter les tokens expirés
        const decoded = decodeJWT(token);

        // Si le token est expiré, essayer de le rafraîchir
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          const refreshed = await refreshToken();
          if (!refreshed) {
            handleLogout();
          }
          setLoading(false);
          return;
        }

        // Si validateToken a réussi, on utilise les données du serveur
        if (tokenData && tokenData.validateToken) {
          setUser(tokenData.validateToken);
          setIsAuthenticated(true);
        } else if (tokenError) {
          // Si validateToken échoue, essayer de rafraîchir le token
          const refreshed = await refreshToken();
          if (!refreshed) {
            handleLogout();
          }
        }
      } catch (error) {
        console.error("Erreur d'authentification", error);
        handleLogout();
      }

      setLoading(false);
    };

    if (!tokenLoading) {
      initAuth();
    }
  }, [token, tokenData, tokenLoading, tokenError]);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    try {
      const decoded = decodeJWT(newToken);
      setUser({
        id: decoded.userId || decoded.sub,
        email: decoded.email,
        role: decoded.role,
        username: decoded.username || decoded.name || ''
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Erreur lors du décodage du token", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      // Utilisation du endpoint GraphQL pour rafraîchir le token
      const { data } = await refreshTokenMutation({
        context: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      });

      if (data?.refreshToken?.token) {
        login(data.refreshToken.token);
        return true;
      }
      return false;
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