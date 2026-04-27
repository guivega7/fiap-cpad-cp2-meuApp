/**
 * Validation utilities for form fields
 */

interface ValidationErrors {
  [key: string]: string | null;
}

interface ValidationField {
  nome?: string;
  email?: string;
  senha?: string;
  confirmaSenha?: string;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateNome = (nome: string): boolean => {
  return nome.trim().length > 0;
};

export const validatePasswordMatch = (pwd1: string, pwd2: string): boolean => {
  return pwd1 === pwd2 && pwd1.length > 0;
};

export const getEmailError = (email: string): string | null => {
  if (!email) return "O e-mail é obrigatório";
  if (!validateEmail(email)) return "E-mail inválido. Use o formato: usuario@dominio.com";
  return null;
};

export const getPasswordError = (password: string): string | null => {
  if (!password) return "A senha é obrigatória";
  if (!validatePassword(password)) return "A senha deve ter pelo menos 6 caracteres";
  return null;
};

export const getNomeError = (nome: string): string | null => {
  if (!nome) return "O nome é obrigatório";
  if (nome.trim().length < 3) return "O nome deve ter pelo menos 3 caracteres";
  return null;
};

export const getPasswordMatchError = (pwd1: string, pwd2: string): string | null => {
  if (!pwd2) return "A confirmação de senha é obrigatória";
  if (!validatePasswordMatch(pwd1, pwd2)) return "As senhas não conferem";
  return null;
};

export const validateSignupForm = (
  nome: string,
  email: string,
  senha: string,
  confirmaSenha: string
): ValidationErrors => {
  return {
    nome: getNomeError(nome),
    email: getEmailError(email),
    senha: getPasswordError(senha),
    confirmaSenha: getPasswordMatchError(senha, confirmaSenha),
  };
};

export const validateLoginForm = (
  email: string,
  senha: string
): ValidationErrors => {
  return {
    email: getEmailError(email),
    senha: getPasswordError(senha),
  };
};

export const hasFormErrors = (errors: ValidationErrors): boolean => {
  return Object.values(errors).some((error) => error !== null);
};
