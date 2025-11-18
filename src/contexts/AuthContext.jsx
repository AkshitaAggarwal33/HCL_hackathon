import { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'hw_auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
        setToken(parsed.token);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = (authData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
    setUser(authData.user);
    setToken(authData.token);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// THIS MUST EXIST — your error says it didn't
export function useAuth() {
  return useContext(AuthContext);
}
