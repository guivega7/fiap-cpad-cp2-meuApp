/**
 * Platform-aware storage service
 * Uses localStorage on web, SecureStore on native platforms
 */

import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

// Detect platform
const isWeb = Platform.OS === "web";

// Mobile platforms (iOS, Android)
const isNative = Platform.OS === "ios" || Platform.OS === "android";

console.log(`[STORAGE] Platform detected: ${Platform.OS} (isWeb: ${isWeb}, isNative: ${isNative})`);

/**
 * Save item securely
 * Web: localStorage
 * Native (iOS/Android): SecureStore (encrypted in keychain/keystore)
 */
export const saveItem = async (key: string, value: string): Promise<void> => {
  try {
    if (isWeb) {
      // Web: Use localStorage
      localStorage.setItem(key, value);
      console.log(`[STORAGE] ✓ Web: saved "${key}" to localStorage`);
    } else if (isNative) {
      // Native: Use SecureStore (encrypted)
      await SecureStore.setItemAsync(key, value);
      console.log(`[STORAGE] ✓ Native: saved "${key}" to SecureStore (encrypted)`);
    } else {
      // Fallback for other platforms
      localStorage.setItem(key, value);
      console.log(`[STORAGE] ℹ Fallback: saved "${key}" to localStorage`);
    }
  } catch (error) {
    console.error(`[STORAGE] ✗ Error saving "${key}":`, error);
    throw error;
  }
};

/**
 * Get item securely
 */
export const getItem = async (key: string): Promise<string | null> => {
  try {
    if (isWeb) {
      // Web: Use localStorage
      const value = localStorage.getItem(key);
      console.log(`[STORAGE] ✓ Web: retrieved "${key}" from localStorage (${value ? "found" : "empty"})`);
      return value;
    } else if (isNative) {
      // Native: Use SecureStore
      const value = await SecureStore.getItemAsync(key);
      console.log(`[STORAGE] ✓ Native: retrieved "${key}" from SecureStore (${value ? "found" : "empty"})`);
      return value || null;
    } else {
      // Fallback
      const value = localStorage.getItem(key);
      console.log(`[STORAGE] ℹ Fallback: retrieved "${key}" from localStorage (${value ? "found" : "empty"})`);
      return value;
    }
  } catch (error) {
    console.error(`[STORAGE] ✗ Error getting "${key}":`, error);
    return null;
  }
};

/**
 * Delete item securely
 */
export const deleteItem = async (key: string): Promise<void> => {
  try {
    if (isWeb) {
      // Web: Use localStorage
      localStorage.removeItem(key);
      console.log(`[STORAGE] ✓ Web: deleted "${key}" from localStorage`);
    } else if (isNative) {
      // Native: Use SecureStore
      await SecureStore.deleteItemAsync(key);
      console.log(`[STORAGE] ✓ Native: deleted "${key}" from SecureStore`);
    } else {
      // Fallback
      localStorage.removeItem(key);
      console.log(`[STORAGE] ℹ Fallback: deleted "${key}" from localStorage`);
    }
  } catch (error) {
    console.error(`[STORAGE] ✗ Error deleting "${key}":`, error);
    // Continue even if delete fails
  }
};

/**
 * Clear all items
 */
export const clearAll = async (keys: string[]): Promise<void> => {
  try {
    for (const key of keys) {
      await deleteItem(key);
    }
    console.log(`[STORAGE] ✓ Cleared ${keys.length} items`);
  } catch (error) {
    console.error(`[STORAGE] ✗ Error clearing items:`, error);
  }
};
