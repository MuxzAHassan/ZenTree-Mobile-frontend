import React, { useEffect, useRef } from "react";
import { ActivityIndicator, View, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import LoginScreen from "./screens/auth/LoginScreen";
import RegisterScreen from "./screens/auth/RegisterScreen";
import MainTabs from "./navigation/MainTabs";
// [FIX 2026-03-29] Use PartnerTabs instead of single PartnerDashboard screen
import PartnerTabs from "./navigation/PartnerTabs";
import { LanguageProvider } from "./context/LanguageContext.js";
import { AuthProvider, useAuth } from "./context/AuthContext.js";
import ErrorBoundary from "./components/ErrorBoundary.js";
import { apiPost } from "./api/apiClient";

// [FIX 2026-03-29] Configure push notification handling for foreground
// Wrapped in try/catch — may not be available in all environments (e.g., Expo Go)
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch (e) {
  // Notifications not supported in this environment
}

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { user, isLoading } = useAuth();
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // [FIX 2026-03-29] Only set up push notifications on real devices
    // Expo Go and emulators don't fully support notification APIs
    if (user && Device.isDevice) {
      registerForPushNotifications();

      try {
        notificationListener.current =
          Notifications.addNotificationReceivedListener((notification) => {
            // Notification received while app is open
          });
        responseListener.current =
          Notifications.addNotificationResponseReceivedListener((response) => {
            // User tapped a notification
          });
      } catch (e) {
        // Notification listeners not supported in this environment
      }
    }

    return () => {
      try {
        if (notificationListener.current) notificationListener.current.remove();
        if (responseListener.current) responseListener.current.remove();
      } catch (e) {
        // Cleanup failed silently
      }
    };
  }, [user]);

  const registerForPushNotifications = async () => {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") return;

      // Set notification channel for Android
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#B5651D",
        });
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: "72896770-481d-4b7c-a2b6-08f36036a981",
      });
      await apiPost("/users/push-token", { pushToken: tokenData.data });
    } catch (e) {
      // Push token registration is best-effort
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#B5651D" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={
        user ? (user.role === "partner" ? "PartnerTabs" : "MainTabs") : "Login"
      }
    >
      {!user ? (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ animation: "none" }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ animation: "none" }}
          />
        </>
      ) : user.role === "partner" ? (
        // [FIX 2026-03-29] Partners get tabbed navigation instead of single dashboard
        <Stack.Screen name="PartnerTabs" component={PartnerTabs} />
      ) : (
        <Stack.Screen name="MainTabs" component={MainTabs} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
