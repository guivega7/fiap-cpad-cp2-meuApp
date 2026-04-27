/**
 * Signup Screen
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useAuth } from "../../context/AuthContext";
import { ValidatedInput } from "../../components/ValidatedInput";
import { ErrorCard } from "../../components/ErrorCard";
import { SuccessMessage } from "../../components/SuccessMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { validateSignupForm } from "../../utils/validation";

export default function SignupScreen() {
  const { signup, error, isSigningUp, clearError } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors = validateSignupForm(nome, email, senha, confirmaSenha);
    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === null);
  };

  const handleFieldChange = (field: string, value: string) => {
    switch (field) {
      case "nome":
        setNome(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "senha":
        setSenha(value);
        break;
      case "confirmaSenha":
        setConfirmaSenha(value);
        break;
    }

    // Validate on change if field was touched
    if (touched[field]) {
      const newErrors = validateSignupForm(nome, email, senha, confirmaSenha);
      setErrors(newErrors);
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validateSignupForm(nome, email, senha, confirmaSenha);
    setErrors(newErrors);
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      clearError();
      await signup(nome, email, senha);
      setSuccessMessage("Cadastro realizado com sucesso! Faça login para continuar.");
      setNome("");
      setEmail("");
      setSenha("");
      setConfirmaSenha("");
      setTouched({});

      // Navigate to login after 2 seconds
      setTimeout(() => {
        router.replace("/(auth)/login");
      }, 2000);
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  const hasFormErrors = Object.values(errors).some((err) => err !== null);
  const isFormValid = nome && email && senha && confirmaSenha && !hasFormErrors;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="food-fork-drink" size={48} color="#ed145b" />
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Junte-se à Cantina FIAP</Text>
        </View>

        <View style={styles.form}>
          <ErrorCard message={error} onDismiss={clearError} />
          <SuccessMessage
            message={successMessage}
            duration={2000}
            onDismiss={() => setSuccessMessage("")}
          />

          <ValidatedInput
            label="Nome completo"
            placeholder="Seu nome completo"
            value={nome}
            type="text"
            onChangeText={(value) => handleFieldChange("nome", value)}
            onBlur={() => handleFieldBlur("nome")}
            error={touched.nome ? errors.nome : null}
            editable={!isSigningUp}
          />

          <ValidatedInput
            label="E-mail"
            placeholder="seu@email.com"
            value={email}
            type="email"
            onChangeText={(value) => handleFieldChange("email", value)}
            onBlur={() => handleFieldBlur("email")}
            error={touched.email ? errors.email : null}
            editable={!isSigningUp}
          />

          <ValidatedInput
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            value={senha}
            type="password"
            onChangeText={(value) => handleFieldChange("senha", value)}
            onBlur={() => handleFieldBlur("senha")}
            error={touched.senha ? errors.senha : null}
            editable={!isSigningUp}
          />

          <ValidatedInput
            label="Confirmar senha"
            placeholder="Repita sua senha"
            value={confirmaSenha}
            type="password"
            onChangeText={(value) => handleFieldChange("confirmaSenha", value)}
            onBlur={() => handleFieldBlur("confirmaSenha")}
            error={touched.confirmaSenha ? errors.confirmaSenha : null}
            editable={!isSigningUp}
          />

          <TouchableOpacity
            style={[styles.button, !isFormValid && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={!isFormValid || isSigningUp}
          >
            {isSigningUp ? (
              <LoadingSpinner size="small" containerStyle={styles.spinnerContainer} />
            ) : (
              <Text style={styles.buttonText}>Cadastrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem conta? </Text>
            <TouchableOpacity onPress={() => router.back()} disabled={isSigningUp}>
              <Text style={styles.link}>Faça login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0b",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 8,
  },
  form: {
    gap: 16,
  },
  button: {
    height: 48,
    backgroundColor: "#ed145b",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "#6b7280",
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  spinnerContainer: {
    paddingVertical: 0,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: "#9ca3af",
  },
  link: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ed145b",
  },
});
