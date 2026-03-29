// HomeScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLanguage } from '../context/LanguageContext.js';
// [FIX] Import useAuth to get the logged-in user's name instead of hardcoding it
import { useAuth } from '../context/AuthContext.js';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { t } = useLanguage();
  // [FIX] Get user data from AuthContext — previously the greeting was hardcoded to "Hi Muaz"
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const categories = [
    { name: t('home.cat_full_body'), icon: "💆‍♂️" },
    { name: t('home.cat_foot'), icon: "🦶" },
    { name: t('home.cat_therapeutic'), icon: "👐" },
    { name: t('home.cat_home_service'), icon: "🏠" },
  ];

  const featured = [
    {
      id: 1,
      name: "Ain Therapist",
      rating: 4.8,
      price: "RM80/hour",
      image:
        "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 2,
      name: "Hafiz Masseur",
      rating: 4.6,
      price: "RM70/hour",
      image:
        "https://images.unsplash.com/photo-1600948836101-d5117b4c2e00?auto=format&fit=crop&w=500&q=60",
    },
  ];

  // [FIX] Filter featured masseurs based on search input (was previously non-functional)
  const filteredFeatured = featured.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // [FIX] Filter categories based on search input
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          {/* [FIX] Dynamic greeting using user's first name from AuthContext */}
          <Text style={styles.greeting}>{t('home.greeting').replace('{name}', user?.firstName || '')} 👋</Text>
          <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image
            source={{
              uri: "https://i.pravatar.cc/100",
            }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder={t('home.search_placeholder')}
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />

      {/* Categories */}
      <Text style={styles.sectionTitle}>{t('home.services')}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {/* [FIX] Use filtered categories instead of all categories */}
        {filteredCategories.map((cat, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryCard}
            onPress={() =>
              navigation.navigate("Booking", { category: cat.name })
            }
          >
            <Text style={styles.categoryIcon}>{cat.icon}</Text>
            <Text style={styles.categoryText}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* [FIX] Show empty state when no categories match search */}
      {filteredCategories.length === 0 && search.length > 0 && (
        <Text style={styles.emptyText}>{t('home.no_results')}</Text>
      )}

      {/* Featured Masseurs */}
      <Text style={styles.sectionTitle}>{t('home.top_rated')}</Text>
      {/* [FIX] Use filtered list instead of full list */}
      {filteredFeatured.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.masseurCard}
          onPress={() =>
            navigation.navigate("Booking", { masseur: item.name })
          }
        >
          <Image source={{ uri: item.image }} style={styles.masseurImage} />
          <View style={styles.masseurInfo}>
            <Text style={styles.masseurName}>{item.name}</Text>
            <Text style={styles.masseurRating}>⭐ {item.rating}</Text>
            <Text style={styles.masseurPrice}>{item.price}</Text>
          </View>
        </TouchableOpacity>
      ))}
      {/* [FIX] Show empty state when no masseurs match search */}
      {filteredFeatured.length === 0 && search.length > 0 && (
        <Text style={styles.emptyText}>{t('home.no_results')}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 50,
  },
  searchBar: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 25,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  categoriesContainer: {
    flexDirection: "row",
    marginBottom: 25,
  },
  categoryCard: {
    backgroundColor: "#e6f3f2",
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginRight: 12,
    alignItems: "center",
  },
  categoryIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
  },
  masseurCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
    marginBottom: 15,
    overflow: "hidden",
  },
  masseurImage: {
    width: 90,
    height: 90,
  },
  masseurInfo: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  masseurName: {
    fontSize: 16,
    fontWeight: "600",
  },
  masseurRating: {
    fontSize: 14,
    color: "#666",
  },
  masseurPrice: {
    fontSize: 14,
    color: "#008080",
    fontWeight: "500",
  },
  // [FIX] Added empty state text style for search with no results
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
    marginVertical: 10,
  },
});
