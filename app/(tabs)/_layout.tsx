import { Tabs } from 'expo-router';
import React from 'react';
import { OrderProvider } from '../../context/OrderContext';

export default function TabLayout() {
  return (
    <OrderProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#111111',
            borderTopColor: '#2a2a2a',
          },
          tabBarActiveTintColor: '#ed145b',
          tabBarInactiveTintColor: '#999999',
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Início' }} />
        <Tabs.Screen name="explore" options={{ title: 'Cardápio' }} />
        <Tabs.Screen name="pedido" options={{ title: 'Pedido' }} />
      </Tabs>
    </OrderProvider>
  );
}