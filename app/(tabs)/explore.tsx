import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader';
import InfoCard from '../../components/InfoCard';
import MenuItemCard from '../../components/MenuItemCard';
import { useOrder } from '../../context/OrderContext';

const MENU_ITEMS = [
  { id: '1', name: 'Combo Cafe + Pao de Queijo', price: 12.00 },
  { id: '2', name: 'Sanduiche Natural', price: 15.00 },
  { id: '3', name: 'Suco Natural', price: 8.00 },
  { id: '4', name: 'Salgado + Refrigerante', price: 14.00 },
];

export default function MenuScreen() {
  const { items, addItem, total } = useOrder();

  const handleAddItem = (id: string, name: string, price: number) => {
    addItem({ id, name, price });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppHeader
          title="Cardapio da Cantina"
          subtitle="Escolha os itens do seu pedido antecipado."
        />

        <InfoCard title="Resumo do carrinho">
          <Text style={styles.text}>Itens adicionados: {items.length}</Text>
          <Text style={styles.text}>Total: R$ {total.toFixed(2)}</Text>
        </InfoCard>

        {MENU_ITEMS.map((item) => (
          <MenuItemCard
            key={item.id}
            name={item.name}
            price={`R$ ${item.price.toFixed(2)}`}
            onAdd={() => handleAddItem(item.id, item.name, item.price)}
          />
        ))}
      </ScrollView>

      {items.length > 0 && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => router.push('/(tabs)/carrinho')}
        >
          <MaterialCommunityIcons name="cart" size={24} color="#ffffff" />
          <Text style={styles.buttonText}>{items.length}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  text: {
    color: '#f2f2f2',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 6,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#ed145b',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
