import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on app start
  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const userData = await AsyncStorage.getItem('auth_user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Failed to restore token', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData) => {
    const { token, user: userObj } = userData;
    const authData = {
      token,
      id: userObj.id,
      email: userObj.email,
      role: userObj.role,
      firstName: userObj.firstName,
      lastName: userObj.lastName,
    };
    setUser(authData);
    await AsyncStorage.setItem('auth_user', JSON.stringify(authData));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
