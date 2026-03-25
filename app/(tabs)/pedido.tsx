import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppHeader from '../../components/AppHeader';
import InfoCard from '../../components/InfoCard';

export default function PedidoScreen() {
  const [status, setStatus] = useState('Em preparação');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('Pronto para retirada');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  function handleConfirmPickup() {
    setShowSuccess(true);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AppHeader
        title="Pedido Atual"
        subtitle="Acompanhe o status do pedido e confirme a retirada."
      />

      <InfoCard title="Detalhes do pedido">
        <Text style={styles.text}>Item principal: Combo Café + Pão de Queijo</Text>
        <Text style={styles.text}>Bebida: Suco Natural</Text>
        <Text style={styles.text}>Retirada: Cantina - Unidade Paulista</Text>
        <Text style={styles.text}>Pagamento: Pré-pagamento no app</Text>
        <Text style={styles.status}>Status: {status}</Text>
      </InfoCard>

      <InfoCard title="Ação do usuário">
        <TouchableOpacity style={styles.button} onPress={handleConfirmPickup}>
          <Text style={styles.buttonText}>Confirmar retirada</Text>
        </TouchableOpacity>

        {showSuccess ? (
          <View style={styles.feedbackBox}>
            <Text style={styles.feedbackText}>Retirada confirmada com sucesso.</Text>
          </View>
        ) : (
          <Text style={styles.text}>
            Toque no botão para simular a conclusão do pedido.
          </Text>
        )}
      </InfoCard>
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
  status: {
    color: '#ff7aa5',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#ed145b',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedbackBox: {
    backgroundColor: '#1f4d2f',
    borderRadius: 12,
    padding: 14,
  },
  feedbackText: {
    color: '#d8ffe4',
    fontSize: 15,
    fontWeight: '600',
  },
});