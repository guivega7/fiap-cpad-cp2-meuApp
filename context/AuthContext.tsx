/**
 * Authentication Context
 * Manages global authentication state
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Alert } from "react-native";

import { User, getUserByEmail, addUser, getUsers, updateUser, clearActiveUser } from "../services/storage";
import {
  saveToken,
  getToken,
  saveUserId,
  getUserId,
  clearSecureStorage,
  isTokenValid,
} from "../services/secureStorage";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  error: string | null;
  signup: (nome: string, email: string, senha: string) => Promise<void>;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  clearError: () => void;
  updateProfile: (nome: string, email: string) => Promise<void>;
  changePassword: (senhaAtual: string, novaSenha: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in (on app start)
  const checkSession = async () => {
    try {
      setIsLoading(true);
      console.log("[AUTH] Starting session check...");
      
      const isValid = await isTokenValid();
      console.log("[AUTH] Token valid:", isValid);

      if (isValid) {
        const storedUserId = await getUserId();
        console.log("[AUTH] Stored user ID:", storedUserId ? "YES" : "NO");
        
        if (storedUserId) {
          const users = await getUsers();
          console.log("[AUTH] Total users in storage:", users.length);
          
          const foundUser = users.find((u) => u.id === storedUserId);
          if (foundUser) {
            console.log("[AUTH] User found! Setting user state:", foundUser.email);
            setUser(foundUser);
          } else {
            console.log("[AUTH] User not found in storage, clearing session");
            // User not found in storage, clear session
            await clearSecureStorage();
            setUser(null);
          }
        }
      } else {
        console.log("[AUTH] Token expired or invalid, clearing session");
        // Token expired or invalid, clear session
        await clearSecureStorage();
        setUser(null);
      }
    } catch (err) {
      console.error("[AUTH] Session check error:", err);
      setUser(null);
      // On error, clear session to be safe
      try {
        await clearSecureStorage();
      } catch (e) {
        console.error("[AUTH] Error clearing session on error:", e);
      }
    } finally {
      console.log("[AUTH] Session check complete, isLoading = false");
      setIsLoading(false);
    }
  };

  // Initialize session check on mount
  useEffect(() => {
    checkSession();
  }, []);

  const signup = async (nome: string, email: string, senha: string): Promise<void> => {
    try {
      setError(null);
      setIsSigningUp(true);

      // Check if email already exists
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        throw new Error("Este e-mail já está cadastrado");
      }

      // Create new user
      const newUser: User = {
        id: generateUserId(),
        nome,
        email,
        senha, // In production, this should be hashed
      };

      // Save to storage
      await addUser(newUser);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao cadastrar. Tente novamente.";
      setError(errorMessage);
      throw err;
    } finally {
      setIsSigningUp(false);
    }
  };

  const login = async (email: string, senha: string): Promise<void> => {
    try {
      setError(null);
      setIsLoggingIn(true);

      console.log("[AUTH] Login attempt for:", email);

      // Clear any expired session first
      const isValid = await isTokenValid();
      if (!isValid) {
        console.log("[AUTH] Previous session invalid, clearing");
        await clearSecureStorage();
      }

      // Find user with matching credentials
      const foundUser = await getUserByEmail(email);
      if (!foundUser) {
        console.log("[AUTH] User not found:", email);
        throw new Error("E-mail não encontrado");
      }

      if (foundUser.senha !== senha) {
        console.log("[AUTH] Password incorrect for:", email);
        throw new Error("Senha incorreta");
      }

      console.log("[AUTH] Credentials valid, saving session for:", email);
      
      // Save secure tokens with expiration
      const token = `token_${foundUser.id}_${Date.now()}`;
      await saveToken(token);
      await saveUserId(foundUser.id);

      // Update user state
      console.log("[AUTH] Setting user:", foundUser.email);
      setUser(foundUser);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao fazer login. Tente novamente.";
      console.error("[AUTH] Login error:", errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log("[AUTH] Logout requested");
      setIsLoading(true);
      await clearSecureStorage();
      
      // Also clear legacy active user key if it exists
      try {
        await clearActiveUser();
        console.log("[AUTH] Cleared active user key");
      } catch (e) {
        console.warn("[AUTH] clearActiveUser not available or failed");
      }
      
      console.log("[AUTH] Session cleared, setting user to null");
      setUser(null);
      setError(null);
    } catch (err) {
      console.error("[AUTH] Logout error:", err);
      throw err;
    } finally {
      setIsLoading(false);
      console.log("[AUTH] Logout complete");
    }
  };

  const updateProfile = async (nome: string, email: string): Promise<void> => {
    try {
      if (!user) throw new Error("Usuário não autenticado");

      // Check if new email already exists (and is different from current)
      if (email !== user.email) {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
          throw new Error("Este e-mail já está em uso");
        }
      }

      // Update user data
      const updatedUser: User = {
        ...user,
        nome,
        email,
      };

      await updateUser(updatedUser);
      setUser(updatedUser);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar perfil";
      setError(errorMessage);
      throw err;
    }
  };

  const changePassword = async (senhaAtual: string, novaSenha: string): Promise<void> => {
    try {
      if (!user) throw new Error("Usuário não autenticado");

      // Verify current password
      if (user.senha !== senhaAtual) {
        throw new Error("Senha atual incorreta");
      }

      // Update password
      const updatedUser: User = {
        ...user,
        senha: novaSenha,
      };

      await updateUser(updatedUser);
      setUser(updatedUser);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao alterar senha";
      setError(errorMessage);
      throw err;
    }
  };

  const clearError = () => setError(null);

  const value: AuthContextType = {
    user,
    isLoading,
    isSigningUp,
    isLoggingIn,
    error,
    signup,
    login,
    logout,
    checkSession,
    clearError,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
