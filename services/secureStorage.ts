/**
 * Expo SecureStore service for storing sensitive data securely
 * Uses Keychain (iOS) and Keystore (Android) for encryption
 * Falls back to localStorage on web
 */

import { saveItem, getItem, deleteItem, clearAll as clearAllItems } from "./platformStorage";

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
    console.log(`[SECURE] Saving token with ${TOKEN_EXPIRY_DAYS}-day expiry`);
    await saveItem(TOKEN_KEY, token);
    await saveItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    console.log("[SECURE] ✓ Token saved successfully");
  } catch (error) {
    console.error("[SECURE] ✗ Error saving token:", error);
    throw error;
  }
};

/**
 * Retrieve authentication token securely
 */
export const getToken = async (): Promise<string | null> => {
  try {
    const token = await getItem(TOKEN_KEY);
    console.log(`[SECURE] Retrieved token: ${token ? "EXISTS" : "NOT_FOUND"}`);
    return token;
  } catch (error) {
    console.error("[SECURE] ✗ Error getting token:", error);
    return null;
  }
};

/**
 * Save user ID securely
 */
export const saveUserId = async (userId: string): Promise<void> => {
  try {
    console.log(`[SECURE] Saving user ID: ${userId}`);
    await saveItem(USER_ID_KEY, userId);
    console.log("[SECURE] ✓ User ID saved successfully");
  } catch (error) {
    console.error("[SECURE] ✗ Error saving user ID:", error);
    throw error;
  }
};

/**
 * Retrieve user ID securely
 */
export const getUserId = async (): Promise<string | null> => {
  try {
    const userId = await getItem(USER_ID_KEY);
    console.log(`[SECURE] Retrieved user ID: ${userId ? "EXISTS" : "NOT_FOUND"}`);
    return userId;
  } catch (error) {
    console.error("[SECURE] ✗ Error getting user ID:", error);
    return null;
  }
};

/**
 * Delete user ID
 */
export const deleteUserId = async (): Promise<void> => {
  try {
    console.log("[SECURE] Deleting user ID...");
    try {
      await deleteItem(USER_ID_KEY);
      console.log("[SECURE] ✓ User ID deleted");
    } catch (e) {
      console.warn("[SECURE] ⚠ Warning deleting user ID:", e);
    }
  } catch (error) {
    console.error("[SECURE] ✗ Error deleting user ID:", error);
  }
};

/**
 * Delete authentication token and expiry
 */
export const deleteToken = async (): Promise<void> => {
  try {
    console.log("[SECURE] Deleting token...");
    try {
      await deleteItem(TOKEN_KEY);
      console.log("[SECURE] ✓ Token deleted");
    } catch (e) {
      console.warn("[SECURE] ⚠ Warning deleting token:", e);
    }
    try {
      await deleteItem(TOKEN_EXPIRY_KEY);
      console.log("[SECURE] ✓ Token expiry deleted");
    } catch (e) {
      console.warn("[SECURE] ⚠ Warning deleting token expiry:", e);
    }
  } catch (error) {
    console.error("[SECURE] ✗ Error deleting token:", error);
  }
};

/**
 * Clear all secure storage (logout)
 */
export const clearSecureStorage = async (): Promise<void> => {
  try {
    console.log("[SECURE] Clearing all secure storage...");
    await Promise.all([deleteToken(), deleteUserId()]);
    console.log("[SECURE] ✓ All secure storage cleared");
  } catch (error) {
    console.error("[SECURE] ✗ Error clearing secure storage:", error);
    throw error;
  }
};

/**
 * Check if token exists and is valid (not expired)
 */
export const isTokenValid = async (): Promise<boolean> => {
  try {
    console.log("[SECURE] Checking token validity...");
    
    const token = await getItem(TOKEN_KEY);
    const userId = await getItem(USER_ID_KEY);
    const expiryStr = await getItem(TOKEN_EXPIRY_KEY);

    console.log(`[SECURE] Token check - Token: ${token ? "✓" : "✗"}, UserID: ${userId ? "✓" : "✗"}, Expiry: ${expiryStr ? "✓" : "✗"}`);

    if (!token || !userId || !expiryStr) {
      console.log("[SECURE] ✗ Token invalid: missing required fields");
      return false;
    }

    const expiryTime = parseInt(expiryStr, 10);
    const currentTime = new Date().getTime();
    const timeUntilExpiry = expiryTime - currentTime;

    console.log(`[SECURE] Token expires in: ${Math.floor(timeUntilExpiry / 1000 / 60 / 60 / 24)} days`);

    // Token is valid if it hasn't expired
    const isValid = currentTime < expiryTime;
    console.log(`[SECURE] Token is ${isValid ? "✓ VALID" : "✗ EXPIRED"}`);
    
    return isValid;
  } catch (error) {
    console.error("[SECURE] ✗ Error checking token validity:", error);
    return false;
  }
};
