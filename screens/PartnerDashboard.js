import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useAuth } from "../context/AuthContext.js";
import { useLanguage } from "../context/LanguageContext.js";
import { Ionicons } from "@expo/vector-icons";

export default function PartnerDashboard({ navigation }) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = async () => {
    await logout();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      paddingHorizontal: 20,
    },
    header: {
      marginTop: 40,
      marginBottom: 30,
      alignItems: "center",
    },
    logo: {
      width: 100,
      height: 100,
      marginBottom: 20,
    },
    greeting: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#B5651D",
      marginBottom: 8,
    },
    email: {
      fontSize: 14,
      color: "#666",
      marginBottom: 4,
    },
    role: {
      fontSize: 12,
      backgroundColor: "#E8D4B8",
      color: "#B5651D",
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: "center",
      marginTop: 8,
    },
    section: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#333",
      marginBottom: 15,
    },
    card: {
      backgroundColor: "#F5F5F5",
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
    },
    cardIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "#E8D4B8",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    cardContent: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: "#333",
      marginBottom: 4,
    },
    cardDescription: {
      fontSize: 13,
      color: "#666",
    },
    button: {
      backgroundColor: "#B5651D",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 20,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/NakUrut Logo only.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.greeting}>Welcome, {user?.firstName}!</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.role}>Partner</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Listings</Text>
        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <Ionicons name="home-outline" size={24} color="#B5651D" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Manage Properties</Text>
            <Text style={styles.cardDescription}>
              Add, edit, and manage your listings
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bookings</Text>
        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <Ionicons name="calendar-outline" size={24} color="#B5651D" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>View Bookings</Text>
            <Text style={styles.cardDescription}>
              See upcoming bookings and reservations
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <Ionicons name="person-outline" size={24} color="#B5651D" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Edit Profile</Text>
            <Text style={styles.cardDescription}>Update your information</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
