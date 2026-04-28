/**
 * Login Screen
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Link, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useAuth } from "../../context/AuthContext";
import { ValidatedInput } from "../../components/ValidatedInput";
import { ErrorCard } from "../../components/ErrorCard";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { validateLoginForm } from "../../utils/validation";

export default function LoginScreen() {
  const { login, error, isLoggingIn, clearError, user } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateForm = () => {
    const newErrors = validateLoginForm(email, senha);
    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === null);
  };

  const handleFieldChange = (field: string, value: string) => {
    if (field === "email") setEmail(value);
    if (field === "senha") setSenha(value);

    // Validate on change if field was touched
    if (touched[field]) {
      const newErrors = validateLoginForm(email, senha);
      setErrors(newErrors);
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validateLoginForm(email, senha);
    setErrors(newErrors);
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      clearError();
      await login(email, senha);
      // Navigation happens automatically via root layout check
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const hasFormErrors = Object.values(errors).some((err) => err !== null);
  const isFormValid = email && senha && !hasFormErrors;

  useEffect(() => {
    if (user) {
      router.replace("/(tabs)");
    }
  }, [user]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="food-fork-drink" size={48} color="#ed145b" />
          <Text style={styles.title}>Cantina FIAP</Text>
          <Text style={styles.subtitle}>Faça login para continuar</Text>
        </View>

        <View style={styles.form}>
          <ErrorCard message={error} onDismiss={clearError} />

          <ValidatedInput
            label="E-mail"
            placeholder="seu@email.com"
            value={email}
            type="email"
            onChangeText={(value) => handleFieldChange("email", value)}
            onBlur={() => handleFieldBlur("email")}
            error={touched.email ? errors.email : null}
            editable={!isLoggingIn}
          />

          <ValidatedInput
            label="Senha"
            placeholder="••••••••"
            value={senha}
            type="password"
            onChangeText={(value) => handleFieldChange("senha", value)}
            onBlur={() => handleFieldBlur("senha")}
            error={touched.senha ? errors.senha : null}
            editable={!isLoggingIn}
          />

          <TouchableOpacity
            style={[styles.button, !isFormValid && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={!isFormValid || isLoggingIn}
          >
            {isLoggingIn ? (
              <LoadingSpinner size="small" containerStyle={styles.spinnerContainer} />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Não tem conta? </Text>
            <Link href="/(auth)/cadastro" asChild>
              <TouchableOpacity disabled={isLoggingIn}>
                <Text style={styles.link}>Criar conta</Text>
              </TouchableOpacity>
            </Link>
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
    marginBottom: 48,
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
