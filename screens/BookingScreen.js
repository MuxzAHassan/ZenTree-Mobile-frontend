// [FIX 2026-03-29] Rewritten BookingScreen — GPS location, real API search, partner services, booking flow
import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, Modal, ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { apiGet, apiPost } from '../api/apiClient';

export default function BookingScreen() {
  const { t } = useLanguage();

  // State
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Selected partner + services
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // Booking form
  const [selectedService, setSelectedService] = useState(null);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Get user's GPS location on mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError(t('booking.location_denied') || 'Location permission denied');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    })();
  }, []);

  // Search for nearby partners
  const searchPartners = async () => {
    setLoading(true);
    try {
      const query = userLocation ? `?lat=${userLocation.lat}&lng=${userLocation.lng}` : '';
      const data = await apiGet(`/partners/nearby${query}`);
      if (data.success) {
        setPartners(data.massagers);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to fetch partners');
    } finally {
      setLoading(false);
    }
  };

  // When user taps a partner, fetch their services
  const selectPartner = async (partner) => {
    setSelectedPartner(partner);
    setLoadingServices(true);
    try {
      const data = await apiGet(`/services/partner/${partner.id}`);
      if (data.success) {
        setServices(data.services);
      }
    } catch (e) {
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  // Open booking modal for a service
  const openBookingModal = (service) => {
    setSelectedService(service);
    setDate(new Date());
    setTime(new Date());
    setBookingModalVisible(true);
  };

  // Submit booking
  const handleBooking = async () => {
    setSubmitting(true);
    try {
      const dateStr = date.toISOString().split('T')[0];
      const timeStr = time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

      const data = await apiPost('/bookings', {
        massagerId: selectedPartner.id,
        serviceId: selectedService.id,
        serviceType: selectedService.name,
        date: dateStr,
        time: timeStr,
      });

      if (data.success) {
        Alert.alert(
          t('booking.success_title') || 'Success',
          `${t('booking.success_message')?.replace('{name}', selectedPartner.firstName) || `Your booking with ${selectedPartner.firstName} is confirmed!`}\n\n📅 ${dateStr}\n🕐 ${timeStr}\n💆 ${selectedService.name}\n💰 RM ${parseFloat(selectedService.price).toFixed(2)}`
        );
        setBookingModalVisible(false);
        setSelectedPartner(null);
        setSelectedService(null);
        setServices([]);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ===== Render partner card =====
  const renderPartner = ({ item }) => (
    <TouchableOpacity style={styles.partnerCard} onPress={() => selectPartner(item)}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={28} color="#B5651D" />
      </View>
      <View style={styles.partnerInfo}>
        <Text style={styles.partnerName}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.partnerDetail}>{item.serviceCount || 0} services available</Text>
      </View>
      {item.distance != null && (
        <View style={styles.distanceBadge}>
          <Ionicons name="location" size={14} color="#B5651D" />
          <Text style={styles.distanceText}>{item.distance} km</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  // ===== Render service card =====
  const renderService = ({ item }) => (
    <TouchableOpacity style={styles.serviceCard} onPress={() => openBookingModal(item)}>
      <View style={{ flex: 1 }}>
        <Text style={styles.serviceName}>{item.name}</Text>
        {item.description ? <Text style={styles.serviceDesc}>{item.description}</Text> : null}
        <Text style={styles.serviceDuration}>{item.duration} min</Text>
      </View>
      <View style={styles.priceSection}>
        <Text style={styles.servicePrice}>RM {parseFloat(item.price).toFixed(2)}</Text>
        <Text style={styles.bookLabel}>{t('booking.book_now') || 'Book'}</Text>
      </View>
    </TouchableOpacity>
  );

  // ===== MAIN RENDER =====

  // If a partner is selected, show their services
  if (selectedPartner) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => { setSelectedPartner(null); setServices([]); }}>
          <Ionicons name="arrow-back" size={22} color="#B5651D" />
          <Text style={styles.backText}>{t('booking.back') || 'Back'}</Text>
        </TouchableOpacity>

        <View style={styles.partnerHeader}>
          <View style={styles.bigAvatar}>
            <Ionicons name="person" size={40} color="#B5651D" />
          </View>
          <Text style={styles.partnerHeaderName}>{selectedPartner.firstName} {selectedPartner.lastName}</Text>
          {selectedPartner.distance != null && (
            <Text style={styles.partnerHeaderDistance}>📍 {selectedPartner.distance} km away</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>{t('booking.available_services') || 'Available Services'}</Text>

        {loadingServices ? (
          <ActivityIndicator size="large" color="#B5651D" style={{ marginTop: 30 }} />
        ) : services.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cut-outline" size={50} color="#ccc" />
            <Text style={styles.emptyText}>{t('booking.no_services') || 'No services listed yet'}</Text>
          </View>
        ) : (
          <FlatList data={services} keyExtractor={(item) => String(item.id)} renderItem={renderService} />
        )}

        {/* Booking Modal */}
        <Modal visible={bookingModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t('booking.confirm_booking') || 'Confirm Booking'}</Text>

              {selectedService && (
                <View style={styles.bookingSummary}>
                  <Text style={styles.summaryItem}>💆 {selectedService.name}</Text>
                  <Text style={styles.summaryItem}>💰 RM {parseFloat(selectedService.price).toFixed(2)}</Text>
                  <Text style={styles.summaryItem}>⏱ {selectedService.duration} minutes</Text>
                </View>
              )}

              <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowDatePicker(true)}>
                <Ionicons name="calendar-outline" size={20} color="#B5651D" />
                <Text style={styles.pickerText}>📅 {date.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker value={date} mode="date" minimumDate={new Date()}
                  onChange={(e, d) => { setShowDatePicker(false); if (d) setDate(d); }} />
              )}

              <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowTimePicker(true)}>
                <Ionicons name="time-outline" size={20} color="#B5651D" />
                <Text style={styles.pickerText}>🕐 {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker value={time} mode="time"
                  onChange={(e, d) => { setShowTimePicker(false); if (d) setTime(d); }} />
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setBookingModalVisible(false)}>
                  <Text style={styles.cancelBtnText}>{t('booking.cancel') || 'Cancel'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmBtn} onPress={handleBooking} disabled={submitting}>
                  {submitting ? <ActivityIndicator color="#fff" /> :
                    <Text style={styles.confirmBtnText}>{t('booking.confirm') || 'Confirm'}</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Default view: search for partners
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('booking.title') || 'NakUrut Booking'}</Text>

      {locationError && (
        <View style={styles.warningBox}>
          <Ionicons name="warning" size={18} color="#e67e22" />
          <Text style={styles.warningText}>{locationError}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.searchBtn} onPress={searchPartners} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : (
          <>
            <Ionicons name="search" size={20} color="#fff" />
            <Text style={styles.searchBtnText}>{t('booking.search_button') || 'Search Nearby Massagers'}</Text>
          </>
        )}
      </TouchableOpacity>

      {partners.length === 0 && !loading ? (
        <View style={styles.emptyState}>
          <Ionicons name="location-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>{t('booking.empty_state') || 'Tap "Search" to find nearby massagers'}</Text>
        </View>
      ) : (
        <FlatList data={partners} keyExtractor={(item) => String(item.id)} renderItem={renderPartner}
          contentContainerStyle={{ paddingBottom: 30 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f3ee', paddingTop: 50, paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#B5651D', marginBottom: 16 },
  searchBtn: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    backgroundColor: '#B5651D', paddingVertical: 14, borderRadius: 12, marginBottom: 20,
  },
  searchBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  warningBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff3cd',
    padding: 12, borderRadius: 8, marginBottom: 12,
  },
  warningText: { color: '#856404', fontSize: 13, flex: 1 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 15, color: '#999', marginTop: 12, textAlign: 'center' },
  // Partner cards
  partnerCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 12, padding: 16, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  avatar: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#fff3e0',
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  partnerInfo: { flex: 1 },
  partnerName: { fontSize: 16, fontWeight: '600', color: '#333' },
  partnerDetail: { fontSize: 13, color: '#888', marginTop: 2 },
  distanceBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#fff3e0', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12,
  },
  distanceText: { fontSize: 13, fontWeight: '600', color: '#B5651D' },
  // Back button + partner header
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  backText: { fontSize: 16, color: '#B5651D', fontWeight: '600' },
  partnerHeader: { alignItems: 'center', marginBottom: 24 },
  bigAvatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff3e0',
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  partnerHeaderName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  partnerHeaderDistance: { fontSize: 14, color: '#888', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#B5651D', marginBottom: 12 },
  // Service cards
  serviceCard: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 16,
    marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  serviceName: { fontSize: 16, fontWeight: '600', color: '#333' },
  serviceDesc: { fontSize: 13, color: '#666', marginTop: 4 },
  serviceDuration: { fontSize: 13, color: '#888', marginTop: 4 },
  priceSection: { justifyContent: 'center', alignItems: 'center' },
  servicePrice: { fontSize: 17, fontWeight: 'bold', color: '#B5651D' },
  bookLabel: { fontSize: 12, color: '#B5651D', fontWeight: '600', marginTop: 4 },
  // Modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#B5651D', marginBottom: 16 },
  bookingSummary: { backgroundColor: '#f9f3ee', borderRadius: 10, padding: 14, marginBottom: 16, gap: 6 },
  summaryItem: { fontSize: 15, color: '#555' },
  pickerBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: '#ddd',
    borderRadius: 10, padding: 14, marginBottom: 10, backgroundColor: '#fafafa',
  },
  pickerText: { fontSize: 15, color: '#333' },
  modalButtons: { flexDirection: 'row', gap: 10, marginTop: 16 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: '#f0f0f0', alignItems: 'center' },
  cancelBtnText: { color: '#666', fontWeight: '600', fontSize: 16 },
  confirmBtn: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: '#B5651D', alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
