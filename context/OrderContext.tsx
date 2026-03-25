import React, { createContext, useContext, useState } from 'react';

type OrderItem = {
  name: string;
  price: number;
};

type OrderContextType = {
  items: OrderItem[];
  addItem: (item: OrderItem) => void;
  clearOrder: () => void;
  total: number;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>([]);

  function addItem(item: OrderItem) {
    setItems((prev) => [...prev, item]);
  }

  function clearOrder() {
    setItems([]);
  }

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <OrderContext.Provider value={{ items, addItem, clearOrder, total }}>
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