import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import AppHeader from '../../components/AppHeader';
import InfoCard from '../../components/InfoCard';
import MenuItemCard from '../../components/MenuItemCard';

export default function MenuScreen() {
  const [selectedCount, setSelectedCount] = useState(0);

  function handleAddItem() {
    setSelectedCount((prev) => prev + 1);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AppHeader
        title="Cardápio da Cantina"
        subtitle="Escolha os itens do seu pedido antecipado."
      />

      <InfoCard title="Resumo do carrinho">
        <Text style={styles.text}>Itens adicionados: {selectedCount}</Text>
        <Text style={styles.text}>
          Toque em “Adicionar” para simular um pedido funcional.
        </Text>
      </InfoCard>

      <MenuItemCard
        name="Combo Café + Pão de Queijo"
        price="R$ 12,00"
        onAdd={handleAddItem}
      />
      <MenuItemCard
        name="Sanduíche Natural"
        price="R$ 15,00"
        onAdd={handleAddItem}
      />
      <MenuItemCard
        name="Suco Natural"
        price="R$ 8,00"
        onAdd={handleAddItem}
      />
      <MenuItemCard
        name="Salgado + Refrigerante"
        price="R$ 14,00"
        onAdd={handleAddItem}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b',
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },
  text: {
    color: '#f2f2f2',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 6,
  },
});