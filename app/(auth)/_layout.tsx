/**
 * Authentication Routes Layout
 * Handles navigation for login and signup screens
 */

import React from "react";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
        }}
      />
      <Stack.Screen
        name="cadastro"
        options={{
          title: "Cadastro",
        }}
      />
    </Stack>
  );
}
