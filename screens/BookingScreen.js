import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Button,
  Alert,
  Modal,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext.js';

const BookingScreen = () => {
  const { t } = useLanguage();
  const [searching, setSearching] = useState(false);
  const [massagers, setMassagers] = useState([]);
  const [selectedMassager, setSelectedMassager] = useState(null);
  const [serviceType, setServiceType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const dummyMassagers = [
    { id: 1, name: 'Alice', distance: 2.5, price: 50 },
    { id: 2, name: 'Bob', distance: 5.0, price: 40 },
    { id: 3, name: 'Charlie', distance: 7.8, price: 60 },
  ];

  const handleSearch = () => {
    setSearching(true);
    setMassagers([]);
    setSelectedMassager(null);

    // Simulate searching with timeout
    setTimeout(() => {
      setMassagers(dummyMassagers);
      setSearching(false);
    }, 1500);
  };

  const handleSelectMassager = (massager) => {
    setSelectedMassager(massager);
    setModalVisible(true);
  };

  const handleBooking = () => {
    if (!serviceType || !date || !time) {
      Alert.alert(t('booking.error_title'), t('booking.error_fill_all'));
      return;
    }

    const bookingData = {
      massager: selectedMassager.name,
      serviceType,
      date,
      time,
    };

    console.log('Booking data:', bookingData);
    Alert.alert(
      t('booking.success_title'),
      t('booking.success_message').replace('{name}', selectedMassager.name)
    );
    setModalVisible(false);
    setServiceType('');
    setDate('');
    setTime('');
    setSelectedMassager(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{t('booking.title')}</Text>

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchText}>{t('booking.search_button')}</Text>
      </TouchableOpacity>

      {searching && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}

      {!searching && massagers.length > 0 && (
        <FlatList
          style={{ marginTop: 20 }}
          data={massagers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.massagerCard}
              onPress={() => handleSelectMassager(item)}
            >
              <Text style={styles.massagerName}>{item.name}</Text>
              <Text>{t('booking.distance')}: {item.distance.toFixed(1)} {t('booking.km')}</Text>
              <Text>{t('booking.price')}: ${item.price}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Booking Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>{t('booking.book_with')} {selectedMassager?.name}</Text>

            <TextInput
              style={styles.input}
              placeholder={t('booking.service_type')}
              value={serviceType}
              onChangeText={setServiceType}
            />
            <TextInput
              style={styles.input}
              placeholder={t('booking.date')}
              value={date}
              onChangeText={setDate}
            />
            <TextInput
              style={styles.input}
              placeholder={t('booking.time')}
              value={time}
              onChangeText={setTime}
            />

            <Button title={t('booking.confirm')} onPress={handleBooking} />
            <Button title={t('booking.cancel')} color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  searchButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchText: { color: '#fff', fontWeight: 'bold' },
  massagerCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    marginBottom: 10,
  },
  massagerName: { fontSize: 16, fontWeight: 'bold' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
  },
  modalHeading: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#aaa', borderRadius: 8, padding: 10, marginBottom: 10 },
});
