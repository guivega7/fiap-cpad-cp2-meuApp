import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type MenuItemCardProps = {
  name: string;
  price: string;
  onAdd: () => void;
};

export default function MenuItemCard({
  name,
  price,
  onAdd,
}: MenuItemCardProps) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.price}>{price}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={onAdd}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1d1d1d',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    maxWidth: 180,
  },
  price: {
    color: '#ff7aa5',
    fontSize: 15,
  },
  button: {
    backgroundColor: '#ed145b',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});