import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import BookingScreen from '../screens/BookingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext.js';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
    const { t } = useLanguage();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = 'home-outline';
                    } else if (route.name === 'Booking') {
                        iconName = 'calendar-outline';
                    } else if (route.name === 'Profile') {
                        iconName = 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#B5651D',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ tabBarLabel: t('tabs.home') }}
            />
            <Tab.Screen
                name="Booking"
                component={BookingScreen}
                options={{ tabBarLabel: t('tabs.booking') }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ tabBarLabel: t('tabs.profile') }}
            />
        </Tab.Navigator>
    );
}