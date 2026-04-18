// [FIX 2026-03-29] NEW FILE — PartnerBookingsScreen: partner views and accepts/rejects booking requests
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../context/LanguageContext';
import { apiGet, apiPut } from '../../api/apiClient';

const STATUS_COLORS = {
  pending: '#f39c12',
  accepted: '#27ae60',
  rejected: '#e74c3c',
  completed: '#3498db',
  cancelled: '#95a5a6',
};

export default function PartnerBookingsScreen() {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      const data = await apiGet('/bookings/partner');
      if (data.success) setBookings(data.bookings);
    } catch (e) {
      // Silently fail
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleStatusChange = async (bookingId, status) => {
    const label = status === 'accepted' ? 'Accept' : 'Reject';
    Alert.alert(
      `${label} Booking?`,
      `Are you sure you want to ${label.toLowerCase()} this booking?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: label,
          style: status === 'rejected' ? 'destructive' : 'default',
          onPress: async () => {
            try {
              await apiPut(`/bookings/${bookingId}/status`, { status });
              fetchBookings(); // Refresh list
            } catch (e) {
              Alert.alert('Error', 'Failed to update booking status');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const renderBooking = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.userName}>{item.userName} {item.userLastName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] || '#999' }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Ionicons name="cut-outline" size={16} color="#888" />
          <Text style={styles.infoText}>{item.serviceName || item.serviceType}</Text>
        </View>
        {item.servicePrice && (
          <View style={styles.infoRow}>
            <Ionicons name="cash-outline" size={16} color="#888" />
            <Text style={styles.infoText}>RM {parseFloat(item.servicePrice).toFixed(2)}</Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#888" />
          <Text style={styles.infoText}>{formatDate(item.date)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={16} color="#888" />
          <Text style={styles.infoText}>{item.time}</Text>
        </View>
        {item.userPhone && (
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={16} color="#888" />
            <Text style={styles.infoText}>{item.userPhone}</Text>
          </View>
        )}
      </View>

      {item.status === 'pending' && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.rejectBtn]}
            onPress={() => handleStatusChange(item.id, 'rejected')}
          >
            <Ionicons name="close" size={18} color="#fff" />
            <Text style={styles.actionBtnText}>{t('partner.reject') || 'Reject'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.acceptBtn]}
            onPress={() => handleStatusChange(item.id, 'accepted')}
          >
            <Ionicons name="checkmark" size={18} color="#fff" />
            <Text style={styles.actionBtnText}>{t('partner.accept') || 'Accept'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#B5651D" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('partner.bookings_title') || 'Bookings'}</Text>

      {bookings.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="calendar-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>{t('partner.no_bookings') || 'No bookings yet'}</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderBooking}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchBookings(); }} colors={['#B5651D']} />}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f3ee', paddingTop: 50, paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#B5651D', marginBottom: 20 },
  emptyText: { fontSize: 15, color: '#999', marginTop: 15 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  userName: { fontSize: 17, fontWeight: '600', color: '#333' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  cardBody: { gap: 6 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { fontSize: 14, color: '#555' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, gap: 10 },
  actionBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingVertical: 12, borderRadius: 10 },
  rejectBtn: { backgroundColor: '#e74c3c' },
  acceptBtn: { backgroundColor: '#27ae60' },
  actionBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});
