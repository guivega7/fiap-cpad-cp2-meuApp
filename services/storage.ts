/**
 * Persistent storage for app data
 * Uses platform-aware storage to avoid direct dependency on legacy AsyncStorage APIs.
 */

import { deleteItem, getItem, saveItem } from "./platformStorage";

const USERS_KEY = "app_users";
const ORDERS_KEY = "app_orders";
const ACTIVE_USER_KEY = "app_active_user";

export interface User {
  id: string;
  nome: string;
  email: string;
  senha: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "em_preparacao" | "pronto" | "retirado";
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
}

const readJson = async <T>(key: string, fallback: T): Promise<T> => {
  const data = await getItem(key);
  if (!data) return fallback;

  try {
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error parsing storage key "${key}":`, error);
    return fallback;
  }
};

const writeJson = async (key: string, value: unknown): Promise<void> => {
  await saveItem(key, JSON.stringify(value));
};

/**
 * Users Management
 */
export const saveUsers = async (users: User[]): Promise<void> => {
  try {
    await writeJson(USERS_KEY, users);
  } catch (error) {
    console.error("Error saving users:", error);
    throw error;
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    return await readJson<User[]>(USERS_KEY, []);
  } catch (error) {
    console.error("Error loading users:", error);
    return [];
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const users = await getUsers();
    return users.find((u) => u.email === email) || null;
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  }
};

export const addUser = async (user: User): Promise<void> => {
  try {
    const users = await getUsers();
    users.push(user);
    await saveUsers(users);
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

export const updateUser = async (user: User): Promise<void> => {
  try {
    const users = await getUsers();
    const index = users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      await saveUsers(users);
    }
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

/**
 * Active User Session - DEPRECATED: Use secureStorage instead
 * Keeping for backward compatibility but not recommended for new code
 */
export const clearActiveUser = async (): Promise<void> => {
  try {
    await deleteItem(ACTIVE_USER_KEY);
  } catch (error) {
    console.error("Error clearing active user:", error);
    throw error;
  }
};

/**
 * Orders Management
 */
export const saveOrders = async (orders: Order[]): Promise<void> => {
  try {
    await writeJson(ORDERS_KEY, orders);
  } catch (error) {
    console.error("Error saving orders:", error);
    throw error;
  }
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    return await readJson<Order[]>(ORDERS_KEY, []);
  } catch (error) {
    console.error("Error loading orders:", error);
    return [];
  }
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const orders = await getOrders();
    return orders.filter((o) => o.userId === userId);
  } catch (error) {
    console.error("Error getting user orders:", error);
    return [];
  }
};

export const addOrder = async (order: Order): Promise<void> => {
  try {
    const orders = await getOrders();
    orders.push(order);
    await saveOrders(orders);
  } catch (error) {
    console.error("Error adding order:", error);
    throw error;
  }
};

export const updateOrder = async (order: Order): Promise<void> => {
  try {
    const orders = await getOrders();
    const index = orders.findIndex((o) => o.id === order.id);
    if (index !== -1) {
      orders[index] = order;
      await saveOrders(orders);
    }
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await Promise.all([deleteItem(USERS_KEY), deleteItem(ORDERS_KEY), deleteItem(ACTIVE_USER_KEY)]);
  } catch (error) {
    console.error("Error clearing all data:", error);
    throw error;
  }
};
