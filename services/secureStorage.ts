/**
 * Expo SecureStore service for storing sensitive data securely
 * Uses Keychain (iOS) and Keystore (Android) for encryption
 */

import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "app_auth_token";
const USER_ID_KEY = "app_user_id";
const TOKEN_EXPIRY_KEY = "app_auth_token_expiry";
const TOKEN_EXPIRY_DAYS = 7;

/**
 * Save authentication token securely with expiration
 */
export const saveToken = async (token: string): Promise<void> => {
  try {
    const expiryTime = new Date().getTime() + TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(TOKEN_EXPIRY_KEY, expiryTime.toString());
  } catch (error) {
    console.error("Error saving token:", error);
    throw error;
  }
};

/**
 * Retrieve authentication token securely
 */
export const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

/**
 * Delete authentication token and expiry
 */
export const deleteToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(TOKEN_EXPIRY_KEY);
  } catch (error) {
    console.error("Error deleting token:", error);
    throw error;
  }
};

/**
 * Save user ID securely
 */
export const saveUserId = async (userId: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(USER_ID_KEY, userId);
  } catch (error) {
    console.error("Error saving user ID:", error);
    throw error;
  }
};

/**
 * Retrieve user ID securely
 */
export const getUserId = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(USER_ID_KEY);
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
};

/**
 * Delete user ID
 */
export const deleteUserId = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(USER_ID_KEY);
  } catch (error) {
    console.error("Error deleting user ID:", error);
    throw error;
  }
};

/**
 * Clear all secure storage (logout)
 */
export const clearSecureStorage = async (): Promise<void> => {
  try {
    await Promise.all([deleteToken(), deleteUserId()]);
  } catch (error) {
    console.error("Error clearing secure storage:", error);
    throw error;
  }
};

/**
 * Check if token exists and is valid (not expired)
 */
export const isTokenValid = async (): Promise<boolean> => {
  try {
    const token = await getToken();
    const userId = await getUserId();
    const expiryStr = await SecureStore.getItemAsync(TOKEN_EXPIRY_KEY);

    if (!token || !userId || !expiryStr) {
      return false;
    }

    const expiryTime = parseInt(expiryStr, 10);
    const currentTime = new Date().getTime();

    // Token is valid if it hasn't expired
    return currentTime < expiryTime;
  } catch (error) {
    console.error("Error checking token validity:", error);
    return false;
  }
};
