/**
 * Authentication Context
 * Manages global authentication state
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Alert } from "react-native";
import { v4 as uuidv4 } from "uuid";

import { User, getUserByEmail, addUser, getUsers, updateUser } from "../services/storage";
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
      const isValid = await isTokenValid();

      if (isValid) {
        const storedUserId = await getUserId();
        if (storedUserId) {
          const users = await getUsers();
          const foundUser = users.find((u) => u.id === storedUserId);
          if (foundUser) {
            setUser(foundUser);
          } else {
            // User not found in storage, clear session
            await clearSecureStorage();
          }
        }
      } else {
        // Token expired or invalid, clear session
        await clearSecureStorage();
      }
    } catch (err) {
      console.error("Session check error:", err);
      // On error, clear session to be safe
      try {
        await clearSecureStorage();
      } catch (e) {
        console.error("Error clearing session on error:", e);
      }
    } finally {
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
        id: uuidv4(),
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

      // Clear any expired session first
      const isValid = await isTokenValid();
      if (!isValid) {
        await clearSecureStorage();
      }

      // Find user with matching credentials
      const foundUser = await getUserByEmail(email);
      if (!foundUser) {
        throw new Error("E-mail não encontrado");
      }

      if (foundUser.senha !== senha) {
        throw new Error("Senha incorreta");
      }

      // Save secure tokens with expiration
      const token = `token_${foundUser.id}_${Date.now()}`;
      await saveToken(token);
      await saveUserId(foundUser.id);

      // Update user state
      setUser(foundUser);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao fazer login. Tente novamente.";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await clearSecureStorage();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error("Logout error:", err);
      throw err;
    } finally {
      setIsLoading(false);
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
