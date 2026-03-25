import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type AppHeaderProps = {
  title: string;
  subtitle: string;
};

export default function AppHeader({ title, subtitle }: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/fiap-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 20,
  },
  logo: {
    width: 90,
    height: 36,
    marginBottom: 14,
  },
  title: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#cfcfcf',
    fontSize: 16,
    lineHeight: 22,
  },
});