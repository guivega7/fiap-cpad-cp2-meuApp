import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { deleteItem, getItem, saveItem } from '../services/platformStorage';

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity?: number;
};

export type CompletedOrder = {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'em_preparacao' | 'pronto' | 'retirado';
  createdAt: string;
  updatedAt?: string;
};

type OrderContextType = {
  items: OrderItem[];
  addItem: (item: OrderItem) => void;
  removeItem: (itemId: string) => void;
  clearOrder: () => void;
  total: number;
  orderHistory: CompletedOrder[];
  currentOrder: CompletedOrder | null;
  completeOrder: () => Promise<void>;
  loadOrderHistory: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: CompletedOrder['status']) => Promise<void>;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);
const ORDERS_HISTORY_KEY = 'app_orders_history';

const readOrdersHistory = async (): Promise<CompletedOrder[]> => {
  const data = await getItem(ORDERS_HISTORY_KEY);
  if (!data) return [];

  try {
    return JSON.parse(data) as CompletedOrder[];
  } catch (error) {
    console.error('Error parsing order history:', error);
    return [];
  }
};

const writeOrdersHistory = async (orders: CompletedOrder[]): Promise<void> => {
  await saveItem(ORDERS_HISTORY_KEY, JSON.stringify(orders));
};

export function OrderProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [orderHistory, setOrderHistory] = useState<CompletedOrder[]>([]);
  const [currentOrder, setCurrentOrder] = useState<CompletedOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Calcular total
  const total = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  // Load order history when user changes
  useEffect(() => {
    if (user) {
      loadOrderHistory();
    }
  }, [user]);

  async function loadOrderHistory() {
    try {
      setIsLoading(true);
      const allOrders = await readOrdersHistory();
      const userOrders = allOrders.filter(order => order.id.includes(user?.id || ''));
      setOrderHistory(userOrders);
    } catch (error) {
      console.error('Error loading order history:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveOrderHistory(orders: CompletedOrder[]) {
    try {
      await writeOrdersHistory(orders);
    } catch (error) {
      console.error('Error saving order history:', error);
    }
  }

  function addItem(item: OrderItem) {
    setItems((prev) => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i =>
          i.id === item.id
            ? { ...i, quantity: (i.quantity || 1) + (item.quantity || 1) }
            : i
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  }

  function removeItem(itemId: string) {
    setItems((prev) => prev.filter(i => i.id !== itemId));
  }

  function clearOrder() {
    setItems([]);
  }

  async function completeOrder() {
    if (items.length === 0) {
      throw new Error('Carrinho vazio');
    }

    if (!user) {
      throw new Error('Usuario nao autenticado');
    }

    try {
      const newOrder: CompletedOrder = {
        id: `${user.id}_${Date.now()}`,
        items: items,
        total: total,
        status: 'em_preparacao',
        createdAt: new Date().toISOString(),
      };

      setCurrentOrder(newOrder);

  const allOrders = await readOrdersHistory();
      const updatedAllOrders = [...allOrders, newOrder];

      await saveOrderHistory(updatedAllOrders);
      const userOrders = updatedAllOrders.filter(order => order.id.includes(user.id));
      setOrderHistory(userOrders);
      clearOrder();
    } catch (error) {
      console.error('Error completing order:', error);
      throw error;
    }
  }

  async function updateOrderStatus(orderId: string, status: CompletedOrder['status']) {
    if (!user) {
      throw new Error('Usuario nao autenticado');
    }

    try {
      const allOrders = await readOrdersHistory();
      const updatedAllOrders = allOrders.map((order) =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      );

      await saveOrderHistory(updatedAllOrders);
      const userOrders = updatedAllOrders.filter((order) => order.id.includes(user.id));
      setOrderHistory(userOrders);

      if (currentOrder?.id === orderId) {
        setCurrentOrder((prev) => (prev ? { ...prev, status, updatedAt: new Date().toISOString() } : prev));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  return (
    <OrderContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearOrder,
        total,
        orderHistory,
        currentOrder,
        completeOrder,
        loadOrderHistory,
        updateOrderStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error('useOrder deve ser usado dentro de OrderProvider');
  }

  return context;
}