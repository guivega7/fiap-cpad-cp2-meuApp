import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AppHeader from '../../components/AppHeader';
import InfoCard from '../../components/InfoCard';

export default function HomeScreen() {
  const [currentTime, setCurrentTime] = useState('');
  const [peakMessage, setPeakMessage] = useState('Carregando status da cantina...');

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setCurrentTime(formatted);

    const hour = now.getHours();
    if (hour >= 12 && hour <= 14) {
      setPeakMessage('Horário de pico: filas maiores na cantina.');
    } else {
      setPeakMessage('Horário mais tranquilo para retirada.');
    }
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AppHeader
        title="Fila Zero FIAP"
        subtitle="MVP para reduzir filas na cantina com pedido antecipado e retirada mais rápida."
      />

      <View style={styles.highlight}>
        <Text style={styles.highlightTitle}>Problema real da FIAP</Text>
        <Text style={styles.highlightText}>
          Muitos alunos enfrentam filas longas na cantina, especialmente entre aulas e nos horários de pico.
        </Text>
      </View>

      <InfoCard title="Solução proposta">
        <Text style={styles.text}>
          O aplicativo permite visualizar o cardápio, adicionar itens ao pedido e acompanhar o status de retirada.
        </Text>
      </InfoCard>

      <InfoCard title="Status do momento">
        <Text style={styles.text}>Horário atual: {currentTime}</Text>
        <Text style={styles.text}>{peakMessage}</Text>
      </InfoCard>

      <InfoCard title="Integrantes">
        <Text style={styles.text}>• Luiz Henrique Araujo da Silva — RM: 563795</Text>
        <Text style={styles.text}>• Gabriel Pereira do Nascimento — RM: 563571</Text>
        <Text style={styles.text}>• Guilherme Vega Gomes — RM: 562655</Text>
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
  highlight: {
    backgroundColor: '#ed145b',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  highlightTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  highlightText: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 22,
  },
  text: {
    color: '#f2f2f2',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 6,
  },
});