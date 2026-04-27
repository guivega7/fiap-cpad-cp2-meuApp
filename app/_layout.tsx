/**
 * Root Layout
 * Handles conditional navigation based on authentication status
 */

import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { View } from "react-native";

function RootLayoutNav() {
  const { user, isLoading } = useAuth();

  // Show loading while checking session
  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0b0b0b", justifyContent: "center" }}>
        <LoadingSpinner message="Carregando..." />
      </View>
    );
  }

  // Show appropriate layout based on auth state
  if (!user) {
    // User not authenticated - show auth screens
    return (
      <Stack>
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    );
  }

  // User authenticated - show main app
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
