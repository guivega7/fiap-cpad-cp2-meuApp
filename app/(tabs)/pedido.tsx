import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader';
import InfoCard from '../../components/InfoCard';
import { useOrder, CompletedOrder } from '../../context/OrderContext';
import { EmptyState } from '../../components/EmptyState';

export default function PedidoScreen() {
  const { orderHistory, currentOrder, loadOrderHistory } = useOrder();
  const [currentOrderState, setCurrentOrderState] = useState<CompletedOrder | null>(null);
  const [status, setStatus] = useState('em_preparacao');
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    loadOrderHistory();
  }, []);

  useEffect(() => {
    const activeOrder = currentOrder || (orderHistory.length > 0 ? orderHistory[orderHistory.length - 1] : null);

    if (activeOrder) {
      setCurrentOrderState(activeOrder);
      setStatus(activeOrder.status);

      // Auto-update status after 3 seconds
      const timer = setTimeout(() => {
        setStatus('pronto');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [currentOrder, orderHistory]);

  const getStatusColor = (st: string) => {
    switch (st) {
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

  const getStatusLabel = (st: string) => {
    switch (st) {
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

  const handleConfirmPickup = async () => {
    if (!currentOrderState) return;

    setIsConfirming(true);
    try {
      setStatus('retirado');
      Alert.alert('Sucesso!', 'Pedido retirado com sucesso! Veja seu historico.', [
        {
          text: 'OK',
          onPress: () => {
            router.push('/(tabs)/historico');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao confirmar retirada. Tente novamente.');
    } finally {
      setIsConfirming(false);
    }
  };

  if (!currentOrder) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="Nenhum pedido ativo"
          message="Faca um pedido no cardapio para acompanha-lo aqui"
          icon="package-variant"
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AppHeader
        title="Pedido Atual"
        subtitle="Acompanhe o status do pedido e confirme a retirada."
      />

      {/* Status Timeline */}
      <View style={styles.timeline}>
        <View style={styles.timelineItem}>
          <View
            style={[
              styles.timelineDot,
              { backgroundColor: getStatusColor('em_preparacao') },
            ]}
          >
            <MaterialCommunityIcons name="chef-hat" size={16} color="#ffffff" />
          </View>
          <Text
            style={[
              styles.timelineLabel,
              status === 'em_preparacao' && styles.timelineLabelActive,
            ]}
          >
            Em preparacao
          </Text>
        </View>

        <View style={styles.timelineConnector} />

        <View style={styles.timelineItem}>
          <View
            style={[
              styles.timelineDot,
              { backgroundColor: status === 'pronto' || status === 'retirado' ? '#10b981' : '#4b5563' },
            ]}
          >
            <MaterialCommunityIcons name="check-circle" size={16} color="#ffffff" />
          </View>
          <Text
            style={[
              styles.timelineLabel,
              (status === 'pronto' || status === 'retirado') && styles.timelineLabelActive,
            ]}
          >
            Pronto
          </Text>
        </View>

        <View style={styles.timelineConnector} />

        <View style={styles.timelineItem}>
          <View
            style={[
              styles.timelineDot,
              { backgroundColor: status === 'retirado' ? '#8b5cf6' : '#4b5563' },
            ]}
          >
            <MaterialCommunityIcons name="package-variant" size={16} color="#ffffff" />
          </View>
          <Text
            style={[
              styles.timelineLabel,
              status === 'retirado' && styles.timelineLabelActive,
            ]}
          >
            Retirado
          </Text>
        </View>
      </View>

      {/* Items */}
      <InfoCard title="Itens do pedido">
        {currentOrderState.items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>R$ {item.price.toFixed(2)}</Text>
          </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.itemRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>R$ {currentOrderState.total.toFixed(2)}</Text>
        </View>
      </InfoCard>

      {/* Details */}
      <InfoCard title="Detalhes do pedido">
        <Text style={styles.text}>Data: {new Date(currentOrderState.createdAt).toLocaleString('pt-BR')}</Text>
        <Text style={styles.text}>Retirada: Cantina - Unidade Paulista</Text>
        <Text style={styles.text}>Pagamento: Pre-pagamento no app</Text>
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
            {getStatusLabel(status)}
          </Text>
        </View>
      </InfoCard>

      {/* Action */}
      {status === 'pronto' && (
        <InfoCard title="Confirmar retirada">
          <TouchableOpacity
            style={[styles.button, isConfirming && styles.buttonDisabled]}
            onPress={handleConfirmPickup}
            disabled={isConfirming}
          >
            {isConfirming ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <>
                <MaterialCommunityIcons name="check-circle" size={20} color="#ffffff" />
                <Text style={styles.buttonText}>Confirmar retirada</Text>
              </>
            )}
          </TouchableOpacity>
        </InfoCard>
      )}

      {status === 'retirado' && (
        <InfoCard title="Pedido concluido">
          <View style={styles.successBox}>
            <MaterialCommunityIcons name="check-circle" size={32} color="#10b981" />
            <Text style={styles.successText}>Pedido retirado com sucesso!</Text>
          </View>
        </InfoCard>
      )}
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
  timeline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  timelineItem: {
    alignItems: 'center',
    flex: 1,
  },
  timelineDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  timelineLabel: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  timelineLabelActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  timelineConnector: {
    width: 20,
    height: 2,
    backgroundColor: '#374151',
    marginBottom: 30,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemName: {
    fontSize: 14,
    color: '#f3f4f6',
  },
  itemPrice: {
    fontSize: 14,
    color: '#ed145b',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#374151',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ed145b',
  },
  text: {
    color: '#f2f2f2',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1f2937',
    borderRadius: 6,
    alignSelf: 'flex-start',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#ed145b',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  successText: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '600',
  },
});
