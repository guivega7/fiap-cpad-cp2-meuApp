/**
 * ErrorCard Component
 * Global error message display
 */

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ErrorCardProps {
  message?: string | null;
  onDismiss?: () => void;
  autoDismiss?: boolean;
  duration?: number;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({
  message,
  onDismiss,
  autoDismiss = false,
  duration = 4000,
}) => {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    setVisible(!!message);

    if (message && autoDismiss) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, autoDismiss, duration, onDismiss]);

  if (!visible || !message) return null;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <MaterialCommunityIcons name="alert-circle" size={20} color="#ef4444" />
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity onPress={handleDismiss} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <MaterialCommunityIcons name="close" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#7f1d1d",
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: "#fecaca",
    fontWeight: "500",
  },
});
