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

  console.log("[LAYOUT] user:", user?.email || "null", "isLoading:", isLoading);

  // Show loading while checking session
  if (isLoading) {
    console.log("[LAYOUT] Rendering: LoadingSpinner (session check in progress)");
    return (
      <View style={{ flex: 1, backgroundColor: "#0b0b0b", justifyContent: "center" }}>
        <LoadingSpinner message="Carregando..." />
      </View>
    );
  }

  // Show appropriate layout based on auth state
  if (!user) {
    // User not authenticated - show auth screens
    console.log("[LAYOUT] Rendering: Auth screens (no user)");
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
  console.log("[LAYOUT] Rendering: Main app (user authenticated)");
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
