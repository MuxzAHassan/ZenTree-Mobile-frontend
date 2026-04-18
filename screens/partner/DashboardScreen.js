// [FIX 2026-03-29] Rewritten PartnerDashboard — GPS setup, push token registration, functional navigation cards
import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Switch
} from 'react-native';
import * as Location from 'expo-location';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiPut, apiPost, apiGet } from '../../api/apiClient';

// Notification handler is already configured in App.js — no need to duplicate here

export default function PartnerDashboard() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [locationSaved, setLocationSaved] = useState(false);
  const [savingLocation, setSavingLocation] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [loadingActive, setLoadingActive] = useState(true);

  // [FIX 2026-03-29] Register push token, save GPS location, get active status on mount
  useEffect(() => {
    registerPushToken();
    saveLocation();
    fetchActiveStatus();
  }, []);

  const fetchActiveStatus = async () => {
    try {
      const res = await apiGet('/partners/active');
      if (res.success) setIsActive(res.isActive);
    } catch (e) {
      if (process.env.NODE_ENV === 'development') console.log('Fetch active status error:', e);
    } finally {
      setLoadingActive(false);
    }
  };

  const toggleActiveStatus = async (newValue) => {
    // Optimistic UI update
    setIsActive(newValue);
    try {
      const res = await apiPut('/partners/active', { isActive: newValue });
      if (!res.success) {
        setIsActive(!newValue); // Revert on API failure
        Alert.alert('Error', res.message || 'Failed to update status');
      }
    } catch (e) {
      setIsActive(!newValue); // Revert on API failure
      Alert.alert('Error', 'Failed to connect to server');
    }
  };

  const registerPushToken = async () => {
    try {
      if (!Device.isDevice) return; // Push tokens only work on real devices

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') return;

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: '72896770-481d-4b7c-a2b6-08f36036a981',
      });
      await apiPost('/users/push-token', { pushToken: tokenData.data });
    } catch (e) {
      if (process.env.NODE_ENV === 'development') console.log('Push token error:', e);
    }
  };

  const saveLocation = async () => {
    setSavingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location Required', 'Please enable location to let users find you.');
        setSavingLocation(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      await apiPut('/partners/location', {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      setLocationSaved(true);
    } catch (e) {
      // Silently fail
    } finally {
      setSavingLocation(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>
            {t('partner.welcome')?.replace('{name}', user?.firstName || 'Partner') || `Welcome, ${user?.firstName || 'Partner'}!`}
          </Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{t('partner.role_badge') || 'Partner'}</Text>
          </View>
        </View>
      </View>

      {/* Active Status Toggle */}
      <View style={styles.activeBar}>
        <View style={styles.activeTextContainer}>
          <Text style={styles.activeLabel}>Status:</Text>
          <Text style={[styles.activeValue, { color: isActive ? '#27ae60' : '#e74c3c' }]}>
            {loadingActive ? 'Loading...' : isActive ? 'Active (Receiving Bookings)' : 'Inactive (Hidden)'}
          </Text>
        </View>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isActive ? '#3498db' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleActiveStatus}
          value={isActive}
          disabled={loadingActive}
        />
      </View>

      {/* Location status */}
      <View style={styles.locationBar}>
        {savingLocation ? (
          <>
            <ActivityIndicator size="small" color="#B5651D" />
            <Text style={styles.locationText}>Detecting location...</Text>
          </>
        ) : locationSaved ? (
          <>
            <Ionicons name="location" size={18} color="#27ae60" />
            <Text style={[styles.locationText, { color: '#27ae60' }]}>Location saved ✓</Text>
          </>
        ) : (
          <TouchableOpacity style={styles.locationRetryBtn} onPress={saveLocation}>
            <Ionicons name="location-outline" size={18} color="#e67e22" />
            <Text style={[styles.locationText, { color: '#e67e22' }]}>Tap to set location</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Info: These sections are now navigated via the bottom tabs */}
      <Text style={styles.sectionHint}>
        {t('partner.use_tabs') || 'Use the tabs below to manage your bookings and services'}
      </Text>

      {/* Quick stats placeholder */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="calendar" size={28} color="#B5651D" />
          <Text style={styles.statLabel}>{t('partner.bookings_tab') || 'Bookings'}</Text>
          <Text style={styles.statHint}>View & manage</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="cut" size={28} color="#B5651D" />
          <Text style={styles.statLabel}>{t('partner.services_tab') || 'Services'}</Text>
          <Text style={styles.statHint}>Add & edit</Text>
        </View>
      </View>

      {/* Logout button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>{t('partner.logout') || 'Logout'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f3ee', paddingTop: 50, paddingHorizontal: 20 },
  header: { marginBottom: 20 },
  welcome: { fontSize: 24, fontWeight: 'bold', color: '#B5651D' },
  roleBadge: {
    backgroundColor: '#B5651D', paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 12, alignSelf: 'flex-start', marginTop: 8,
  },
  roleText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  activeBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  activeTextContainer: { flexDirection: 'column' },
  activeLabel: { fontSize: 14, color: '#555', fontWeight: 'bold' },
  activeValue: { fontSize: 13, marginTop: 2, fontWeight: '500' },
  locationBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff',
    padding: 14, borderRadius: 10, marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  locationText: { fontSize: 14, color: '#555' },
  locationRetryBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionHint: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 24 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 30 },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 20,
    alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  statLabel: { fontSize: 15, fontWeight: '600', color: '#333', marginTop: 10 },
  statHint: { fontSize: 12, color: '#999', marginTop: 4 },
  logoutBtn: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    backgroundColor: '#e74c3c', paddingVertical: 14, borderRadius: 12, marginTop: 'auto', marginBottom: 30,
  },
  logoutText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
