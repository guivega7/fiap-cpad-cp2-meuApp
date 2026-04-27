/**
 * ValidatedInput Component
 * Text input with validation and error messaging
 */

import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  KeyboardTypeOptions,
} from "react-native";

interface ValidatedInputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  error?: string | null;
  type?: "email" | "password" | "text" | "phone";
  containerStyle?: any;
  inputStyle?: any;
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  label,
  error,
  type = "text",
  placeholder,
  containerStyle,
  inputStyle,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getKeyboardType = (): KeyboardTypeOptions => {
    switch (type) {
      case "email":
        return "email-address";
      case "password":
        return "default";
      case "phone":
        return "phone-pad";
      default:
        return "default";
    }
  };

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error && styles.inputError,
          inputStyle,
        ]}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        keyboardType={getKeyboardType()}
        secureTextEntry={type === "password"}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#ffffff",
    backgroundColor: "#1f2937",
  },
  inputFocused: {
    borderColor: "#ed145b",
    backgroundColor: "#111827",
  },
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#7f1d1d15",
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 6,
    fontWeight: "500",
  },
});
