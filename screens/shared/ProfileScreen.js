import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../context/LanguageContext.js';
// [FIX] Import useAuth to display actual logged-in user data instead of hardcoded values
import { useAuth } from '../../context/AuthContext.js';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { t } = useLanguage();
  // [FIX] Get user data and logout from AuthContext — was previously hardcoded to 'Muaz Abu Hassan'
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  }

  // [FIX] Added placeholder for Edit Profile navigation (was previously missing onPress handler)
  const handleEditProfile = () => {
    // TODO: Navigate to an Edit Profile screen when implemented
    alert(t('profile.edit_coming_soon'));
  };

  return (
    <View style={styles.container}>
      {/* [FIX] Display actual user name from auth context */}
      <Text style={styles.name}>
        {user?.firstName || ''} {user?.lastName || ''}
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>{t('profile.email')}</Text>
        {/* [FIX] Display actual user email from auth context */}
        <Text style={styles.value}>{user?.email || '-'}</Text>

        <Text style={styles.label}>{t('profile.phone')}</Text>
        {/* [FIX] Display actual user phone from auth context (if available) */}
        <Text style={styles.value}>{user?.phone || '-'}</Text>

        <Text style={styles.label}>{t('profile.gender')}</Text>
        {/* [FIX] Display actual user gender from auth context (if available) */}
        <Text style={styles.value}>{user?.gender || '-'}</Text>

        <Text style={styles.label}>{t('profile.dob')}</Text>
        {/* [FIX] Display actual user DOB from auth context (if available) */}
        <Text style={styles.value}>{user?.dateOfBirth || '-'}</Text>
      </View>

      {/* [FIX] Added onPress handler — was previously a no-op button */}
      <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
        <Text style={styles.editText}>{t('profile.edit')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>{t('profile.logout')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#B5651D',
    marginBottom: 20,
  },
  infoBox: {
    width: '80%',
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  label: {
    color: '#888',
    fontSize: 14,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
  editButton: {
    backgroundColor: '#B5651D',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  editText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#E63946',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 15,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
