import { Tabs } from 'expo-router';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: '#ed145b',
          tabBarInactiveTintColor: '#999999',
          tabBarLabelStyle: {
            fontSize: 11,
            marginTop: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Início',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Cardápio',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="food-fork-drink" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="carrinho"
          options={{
            title: 'Carrinho',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="cart" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="pedido"
          options={{
            title: 'Pedido',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="truck" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="historico"
          options={{
            title: 'Histórico',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="history" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account" size={24} color={color} />,
          }}
        />
      </Tabs>
    </OrderProvider>
  );
}