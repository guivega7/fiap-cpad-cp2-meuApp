/**
 * AsyncStorage service for persisting data
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

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

/**
 * Users Management
 */
export const saveUsers = async (users: User[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Error saving users:", error);
    throw error;
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const data = await AsyncStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
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
 * Active User Session
 */
export const saveActiveUser = async (userId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(ACTIVE_USER_KEY, userId);
  } catch (error) {
    console.error("Error saving active user:", error);
    throw error;
  }
};

export const getActiveUser = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(ACTIVE_USER_KEY);
  } catch (error) {
    console.error("Error getting active user:", error);
    return null;
  }
};

export const clearActiveUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ACTIVE_USER_KEY);
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
    await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error("Error saving orders:", error);
    throw error;
  }
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    const data = await AsyncStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data) : [];
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
    await AsyncStorage.multiRemove([USERS_KEY, ORDERS_KEY, ACTIVE_USER_KEY]);
  } catch (error) {
    console.error("Error clearing all data:", error);
    throw error;
  }
};
