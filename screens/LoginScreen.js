import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useLanguage } from '../context/LanguageContext.js';
import { useAuth } from '../context/AuthContext.js';
import LanguageSelector from '../components/LanguageSelector.js';
import { loginUser } from '../api/auth';

export default function LoginScreen({ navigation }) {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 40,
      color: '#B5651D',
    },
    input: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 12,
      marginBottom: 15,
    },
    button: {
      width: '100%',
      backgroundColor: '#B5651D',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    link: {
      marginTop: 15,
      color: '#2E86C1',
      alignSelf: 'flex-start',
    },
  });

  const handleLogin = async () => {
    try {
      const response = await loginUser(email, password);
      const data = await response.json();

      if (data.success) {
        // Store auth data in context
        await login(data);
        // Navigation is handled automatically by RootNavigator based on user role
      } else {
        alert(data.message || t('login.error_invalid'));
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(t('login.error_generic'));
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  }

  return (
    <View style={styles.container}>
      <LanguageSelector />
      <Image source={require('../assets/NakUrut Logo.png')} style={{ width: 150, height: 150 }} resizeMode='contain' />
      <TextInput
        style={styles.input}
        placeholder={t('login.email')}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder={t('login.password')}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>{t('login.button')}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleRegister}>
        <Text style={styles.link}>{t('login.register_link')}</Text>
      </TouchableOpacity>

    </View>
  );
}