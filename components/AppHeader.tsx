import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

type AppHeaderProps = {
  title: string;
  subtitle?: string | null;
  showUser?: boolean;
};

export default function AppHeader({ title, subtitle = null, showUser = true }: AppHeaderProps) {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoAndTitle}>
          <Image
            source={require('../assets/images/fiap-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>{title}</Text>
        </View>
        {showUser && user && (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.nome.split(' ')[0]}</Text>
          </View>
        )}
      </View>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoAndTitle: {
    flex: 1,
  },
  logo: {
    width: 90,
    height: 36,
    marginBottom: 8,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: 14,
    lineHeight: 20,
  },
  userInfo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ed145b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});