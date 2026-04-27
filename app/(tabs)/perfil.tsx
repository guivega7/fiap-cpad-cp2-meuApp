/**
 * Profile Screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from "../../context/AuthContext";
import { ValidatedInput } from "../../components/ValidatedInput";
import { ErrorCard } from "../../components/ErrorCard";
import { SuccessMessage } from "../../components/SuccessMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { validateNome, getNomeError, getEmailError, getPasswordError } from "../../utils/validation";

export default function PerfilScreen() {
  const { user, logout, updateProfile, changePassword, error, clearError } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [editNome, setEditNome] = useState(user?.nome || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Usuário não autenticado</Text>
      </View>
    );
  }

  const getInitials = () => {
    const names = user.nome.split(' ');
    return (names[0][0] + (names[1]?.[0] || '')).toUpperCase();
  };

  const handleUpdateProfile = async () => {
    const nomeError = getNomeError(editNome);
    const emailError = getEmailError(editEmail);

    if (nomeError || emailError) {
      setErrors({ nome: nomeError, email: emailError });
      return;
    }

    try {
      setIsLoading(true);
      clearError();
      await updateProfile(editNome, editEmail);
      setSuccessMessage('Perfil atualizado com sucesso!');
      setEditMode(false);
      setErrors({});
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    const currentPasswordError = getPasswordError(currentPassword);
    const newPasswordError = getPasswordError(newPassword);

    if (currentPasswordError || newPasswordError) {
      setErrors({ currentPassword: currentPasswordError, newPassword: newPasswordError });
      return;
    }

    try {
      setIsLoading(true);
      clearError();
      await changePassword(currentPassword, newPassword);
      setSuccessMessage('Senha alterada com sucesso!');
      setChangePasswordMode(false);
      setCurrentPassword('');
      setNewPassword('');
      setErrors({});
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Change password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Fazer Logout?', 'Você realmente deseja sair da sua conta?', [
      {
        text: 'Cancelar',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            await logout();
          } catch (err) {
            Alert.alert('Erro', 'Erro ao fazer logout. Tente novamente.');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SuccessMessage message={successMessage} />

        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
          <Text style={styles.userName}>{user.nome}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        {/* Profile Info */}
        {!editMode && !changePasswordMode && (
          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="account" size={20} color="#ed145b" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nome</Text>
                <Text style={styles.infoValue}>{user.nome}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="email" size={20} color="#ed145b" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>E-mail</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.actionButton} onPress={() => setEditMode(true)}>
              <MaterialCommunityIcons name="pencil" size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>Editar Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { marginTop: 8 }]}
              onPress={() => setChangePasswordMode(true)}
            >
              <MaterialCommunityIcons name="lock-reset" size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>Alterar Senha</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.logoutButton]}
              onPress={handleLogout}
            >
              <MaterialCommunityIcons name="logout" size={20} color="#ef4444" />
              <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>Fazer Logout</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Edit Profile Modal */}
        {editMode && (
          <View style={styles.editSection}>
            <Text style={styles.sectionTitle}>Editar Perfil</Text>
            <ErrorCard message={error} onDismiss={clearError} />

            <ValidatedInput
              label="Nome"
              value={editNome}
              onChangeText={setEditNome}
              error={errors.nome}
              editable={!isLoading}
            />

            <ValidatedInput
              label="E-mail"
              value={editEmail}
              type="email"
              onChangeText={setEditEmail}
              error={errors.email}
              editable={!isLoading}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => {
                  setEditMode(false);
                  setEditNome(user.nome);
                  setEditEmail(user.email);
                  setErrors({});
                  clearError();
                }}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.buttonSave, isLoading && styles.buttonDisabled]}
                onPress={handleUpdateProfile}
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner size="small" containerStyle={styles.spinnerContainer} />
                ) : (
                  <Text style={styles.buttonText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Change Password Modal */}
        {changePasswordMode && (
          <View style={styles.editSection}>
            <Text style={styles.sectionTitle}>Alterar Senha</Text>
            <ErrorCard message={error} onDismiss={clearError} />

            <ValidatedInput
              label="Senha Atual"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              error={errors.currentPassword}
              editable={!isLoading}
            />

            <ValidatedInput
              label="Nova Senha"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChangeText={setNewPassword}
              error={errors.newPassword}
              editable={!isLoading}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => {
                  setChangePasswordMode(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setErrors({});
                  clearError();
                }}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.buttonSave, isLoading && styles.buttonDisabled]}
                onPress={handleChangePassword}
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner size="small" containerStyle={styles.spinnerContainer} />
                ) : (
                  <Text style={styles.buttonText}>Alterar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b',
  },
  scrollContent: {
    paddingVertical: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ed145b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
  userEmail: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  infoSection: {
    marginHorizontal: 16,
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#9ca3af',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#f3f4f6',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#374151',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  logoutButton: {
    marginTop: 16,
    backgroundColor: '#7f1d1d',
  },
  editSection: {
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: '#374151',
  },
  buttonSave: {
    backgroundColor: '#ed145b',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  spinnerContainer: {
    paddingVertical: 0,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
});
