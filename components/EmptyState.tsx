/**
 * EmptyState Component
 * Display when there's no data to show
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  containerStyle?: any;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon = "inbox",
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <MaterialCommunityIcons name={icon} size={48} color="#6b7280" />
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 16,
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 4,
  },
});
