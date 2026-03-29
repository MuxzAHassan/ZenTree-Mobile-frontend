// [FIX 2026-03-29] NEW FILE — ManageServicesScreen: Partner adds/edits their services with prices
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { apiGet, apiPost, apiPut, apiDelete } from '../api/apiClient';

export default function ManageServicesScreen() {
  const { t } = useLanguage();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null); // null = adding, object = editing
  const [form, setForm] = useState({ name: '', price: '', duration: '60', description: '' });
  const [saving, setSaving] = useState(false);

  const fetchServices = useCallback(async () => {
    try {
      const data = await apiGet('/services/mine');
      if (data.success) setServices(data.services);
    } catch (e) {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const openAddModal = () => {
    setEditing(null);
    setForm({ name: '', price: '', duration: '60', description: '' });
    setModalVisible(true);
  };

  const openEditModal = (service) => {
    setEditing(service);
    setForm({
      name: service.name,
      price: String(service.price),
      duration: String(service.duration),
      description: service.description || '',
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price.trim()) {
      Alert.alert('Error', 'Name and price are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        price: parseFloat(form.price),
        duration: parseInt(form.duration) || 60,
        description: form.description.trim() || null,
      };

      if (editing) {
        await apiPut(`/services/${editing.id}`, payload);
      } else {
        await apiPost('/services', payload);
      }
      setModalVisible(false);
      fetchServices();
    } catch (e) {
      Alert.alert('Error', 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (service) => {
    Alert.alert(
      'Delete Service',
      `Are you sure you want to delete "${service.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: async () => {
            try {
              await apiDelete(`/services/${service.id}`);
              fetchServices();
            } catch (e) {
              Alert.alert('Error', 'Failed to delete service');
            }
          },
        },
      ]
    );
  };

  const renderService = ({ item }) => (
    <View style={styles.serviceCard}>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.servicePrice}>RM {parseFloat(item.price).toFixed(2)}</Text>
        <Text style={styles.serviceDuration}>{item.duration} min</Text>
        {item.description ? <Text style={styles.serviceDesc}>{item.description}</Text> : null}
      </View>
      <View style={styles.serviceActions}>
        <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editBtn}>
          <Ionicons name="pencil" size={18} color="#B5651D" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteBtn}>
          <Ionicons name="trash" size={18} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#B5651D" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('partner.manage_services') || 'My Services'}</Text>

      {services.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="cut-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>{t('partner.no_services') || 'No services yet. Add your first service!'}</Text>
        </View>
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderService}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={openAddModal}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editing ? 'Edit Service' : 'Add Service'}</Text>

            <Text style={styles.label}>Service Name</Text>
            <TextInput style={styles.input} value={form.name}
              onChangeText={(v) => setForm({ ...form, name: v })} placeholder="e.g., Full Body Massage" />

            <Text style={styles.label}>Price (RM)</Text>
            <TextInput style={styles.input} value={form.price}
              onChangeText={(v) => setForm({ ...form, price: v })} placeholder="80.00"
              keyboardType="numeric" />

            <Text style={styles.label}>Duration (minutes)</Text>
            <TextInput style={styles.input} value={form.duration}
              onChangeText={(v) => setForm({ ...form, duration: v })} placeholder="60"
              keyboardType="numeric" />

            <Text style={styles.label}>Description (optional)</Text>
            <TextInput style={[styles.input, { height: 80 }]} value={form.description}
              onChangeText={(v) => setForm({ ...form, description: v })} placeholder="Describe your service..."
              multiline />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f3ee', paddingTop: 50, paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#B5651D', marginBottom: 20 },
  emptyText: { fontSize: 15, color: '#999', marginTop: 15, textAlign: 'center' },
  serviceCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: 17, fontWeight: '600', color: '#333' },
  servicePrice: { fontSize: 16, fontWeight: 'bold', color: '#B5651D', marginTop: 4 },
  serviceDuration: { fontSize: 13, color: '#888', marginTop: 2 },
  serviceDesc: { fontSize: 13, color: '#666', marginTop: 4 },
  serviceActions: { flexDirection: 'row', gap: 12 },
  editBtn: { padding: 8, backgroundColor: '#fff3e0', borderRadius: 8 },
  deleteBtn: { padding: 8, backgroundColor: '#fde8e8', borderRadius: 8 },
  fab: {
    position: 'absolute', bottom: 30, right: 20, width: 56, height: 56,
    borderRadius: 28, backgroundColor: '#B5651D', justifyContent: 'center',
    alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4,
  },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#B5651D', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12,
    fontSize: 15, backgroundColor: '#fafafa',
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  cancelBtn: { flex: 1, marginRight: 8, padding: 14, borderRadius: 10, backgroundColor: '#f0f0f0', alignItems: 'center' },
  cancelBtnText: { color: '#666', fontWeight: '600', fontSize: 16 },
  saveBtn: { flex: 1, marginLeft: 8, padding: 14, borderRadius: 10, backgroundColor: '#B5651D', alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
