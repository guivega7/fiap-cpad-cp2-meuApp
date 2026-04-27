import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useOrder, OrderItem } from '../../context/OrderContext';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export default function CarrinhoScreen() {
  const { items, removeItem, clearOrder, total, completeOrder } = useOrder();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirmOrder = async () => {
    if (items.length === 0) {
      Alert.alert('Carrinho vazio', 'Adicione itens antes de confirmar');
      return;
    }

    setIsConfirming(true);
    try {
      await completeOrder();
      router.replace('/(tabs)/pedido');
    } catch (error) {
      Alert.alert('Erro', 'Erro: ' + String(error));
    } finally {
      setIsConfirming(false);
    }
  };

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="Carrinho vazio"
          message="Adicione itens no cardapio"
          icon="cart-remove"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Seu Carrinho</Text>
        <Text style={styles.subtitle}>{items.length} item(ns)</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>R$ {item.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <MaterialCommunityIcons name="trash-can" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false}
      />

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Total:</Text>
          <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, isConfirming && styles.buttonDisabled]}
          onPress={handleConfirmOrder}
          disabled={isConfirming}
        >
          {isConfirming ? (
            <LoadingSpinner size="small" containerStyle={{ paddingVertical: 0 }} />
          ) : (
            <Text style={styles.buttonText}>Confirmar Pedido</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearBtn} onPress={clearOrder}>
          <Text style={styles.clearBtnText}>Limpar Carrinho</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0b' },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  title: { fontSize: 24, fontWeight: '600', color: '#ffffff' },
  subtitle: { fontSize: 12, color: '#9ca3af', marginTop: 4 },
  listContent: { paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  itemCard: {
    backgroundColor: '#1f2937',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#ed145b',
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#ffffff' },
  itemPrice: { fontSize: 12, color: '#ed145b', marginTop: 4, fontWeight: '600' },
  summary: {
    backgroundColor: '#1f2937',
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 16, fontWeight: '700', color: '#ffffff' },
  totalValue: { fontSize: 16, fontWeight: '700', color: '#ed145b' },
  button: {
    backgroundColor: '#ed145b',
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { fontSize: 14, fontWeight: '700', color: '#ffffff' },
  clearBtn: {
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearBtnText: { fontSize: 14, fontWeight: '600', color: '#9ca3af' },
});
