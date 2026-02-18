import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext.js';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { t } = useLanguage();

  const [user, setUser] = useState({
    name: 'Muaz Abu Hassan',
    email: 'muxzahassan@gmail.com',
    phoneNumber: '+60142659148',
    gender: 'Male',
    dateofBirth: '13/03/2002',
  });

  const handleLogout = () => {
    // Handle logout logic here
    navigation.replace('Login');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user.name}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>{t('profile.email')}</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Text style={styles.label}>{t('profile.phone')}</Text>
        <Text style={styles.value}>{user.phoneNumber}</Text>

        <Text style={styles.label}>{t('profile.gender')}</Text>
        <Text style={styles.value}>{user.gender}</Text>

        <Text style={styles.label}>{t('profile.dob')}</Text>
        <Text style={styles.value}>{user.dateofBirth}</Text>

      </View>

      <TouchableOpacity style={styles.editButton}>
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
