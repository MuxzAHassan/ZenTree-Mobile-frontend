// [FIX 2026-03-29] NEW FILE — PartnerTabs: bottom tab navigation for partners
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PartnerDashboard from '../screens/PartnerDashboard';
import PartnerBookingsScreen from '../screens/PartnerBookingsScreen';
import ManageServicesScreen from '../screens/ManageServicesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

const Tab = createBottomTabNavigator();

export default function PartnerTabs() {
  const { t } = useLanguage();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = 'grid-outline';
          else if (route.name === 'Bookings') iconName = 'calendar-outline';
          else if (route.name === 'Services') iconName = 'cut-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#B5651D',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={PartnerDashboard}
        options={{ tabBarLabel: t('partner.dashboard_tab') || 'Dashboard' }} />
      <Tab.Screen name="Bookings" component={PartnerBookingsScreen}
        options={{ tabBarLabel: t('partner.bookings_tab') || 'Bookings' }} />
      <Tab.Screen name="Services" component={ManageServicesScreen}
        options={{ tabBarLabel: t('partner.services_tab') || 'Services' }} />
      <Tab.Screen name="Profile" component={ProfileScreen}
        options={{ tabBarLabel: t('tabs.profile') || 'Profile' }} />
    </Tab.Navigator>
  );
}
