/**
 * Order History Screen
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useOrder } from '../../context/OrderContext';
import { EmptyState } from '../../components/EmptyState';

export default function HistoricoScreen() {
  const { orderHistory, loadOrderHistory } = useOrder();

  useEffect(() => {
    loadOrderHistory();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em_preparacao':
        return '#f59e0b';
      case 'pronto':
        return '#10b981';
      case 'retirado':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'em_preparacao':
        return 'Em preparação';
      case 'pronto':
        return 'Pronto para retirada';
      case 'retirado':
        return 'Retirado';
      default:
        return 'Pendente';
    }
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
          <Text style={styles.orderTotal}>Total: R$ {item.total.toFixed(2)}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + '20', borderColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <Text style={styles.itemsLabel}>Itens:</Text>
        {item.items.map((product: any) => (
          <View key={product.id} style={styles.itemRow}>
            <Text style={styles.itemName}>{product.name}</Text>
            <Text style={styles.itemPrice}>
              {product.quantity ? `${product.quantity}x ` : ''}R$ {product.price.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  if (orderHistory.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="Nenhum pedido ainda"
          message="Você ainda não fez nenhum pedido. Vá ao cardápio e crie seu primeiro pedido!"
          icon="clipboard-list"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orderHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  orderCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ed145b',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    paddingBottom: 12,
  },
  orderDate: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ed145b',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  itemsContainer: {
    gap: 8,
  },
  itemsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d1d5db',
    textTransform: 'uppercase',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemName: {
    fontSize: 13,
    color: '#f3f4f6',
    flex: 1,
  },
  itemPrice: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '500',
  },
});
