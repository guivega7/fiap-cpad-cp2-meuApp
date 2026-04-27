/**
 * SuccessMessage Component
 * Success feedback with auto-dismiss
 */

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface SuccessMessageProps {
  message?: string | null;
  duration?: number;
  onDismiss?: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  duration = 3000,
  onDismiss,
}) => {
  const [visible, setVisible] = useState(!!message);
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (message) {
      setVisible(true);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setVisible(false);
          onDismiss?.();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, slideAnim, onDismiss]);

  if (!visible || !message) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: slideAnim,
          transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [-50, 0] }) }],
        },
      ]}
    >
      <View style={styles.card}>
        <MaterialCommunityIcons name="check-circle" size={20} color="#10b981" />
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#064e3b",
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
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
    color: "#a7f3d0",
    fontWeight: "500",
  },
});
