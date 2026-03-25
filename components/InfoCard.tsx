import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type InfoCardProps = {
  title: string;
  children: React.ReactNode;
};

export default function InfoCard({ title, children }: InfoCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#2b2b2b',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  title: {
    color: '#ed145b',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});