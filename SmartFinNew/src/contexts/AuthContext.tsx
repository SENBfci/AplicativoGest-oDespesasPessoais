import React, { createContext, useContext, useState } from 'react';

interface AuthContextData {
  user: any;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  const signIn = async (email: string, password: string) => {
    // TODO: Implementar autenticação real
    console.log('Sign in:', email, password);
    setUser({ id: 1, name: 'Test User', email });
  };

  const signUp = async (name: string, email: string, password: string) => {
    // TODO: Implementar registro real
    console.log('Sign up:', name, email, password);
    setUser({ id: 1, name, email });
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 