import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TYPES = {
  success: {
    accent: "#2E7D32",
    iconBg: "#E8F5E9",
    icon: "checkmark-circle",
    label: "Success",
  },
  error: {
    accent: "#C62828",
    iconBg: "#FFEBEE",
    icon: "close-circle",
    label: "Error",
  },
};

export default function Snackbar({ visible, message, type = "error", duration = 3000, onHide }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-30)).current;

  useEffect(() => {
    if (!visible) return;

    opacity.setValue(0);
    translateY.setValue(-30);

    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 6 }),
    ]).start();

    const timer = setTimeout(() => dismiss(), duration);
    return () => clearTimeout(timer);
  }, [visible, message]);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -30, duration: 250, useNativeDriver: true }),
    ]).start(() => onHide?.());
  };

  const { accent, iconBg, icon, label } = TYPES[type] ?? TYPES.error;

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={[styles.container, { opacity, transform: [{ translateY }] }]}
    >
      <View style={[styles.accentBar, { backgroundColor: accent }]} />
      <View style={[styles.iconWrapper, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={22} color={accent} />
      </View>
      <View style={styles.textWrapper}>
        <Text style={[styles.label, { color: accent }]}>{label}</Text>
        <Text style={styles.message} numberOfLines={2}>{message}</Text>
      </View>
      <TouchableOpacity onPress={dismiss} style={styles.closeBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Ionicons name="close" size={18} color="#9E9E9E" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 56,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    overflow: "hidden",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    zIndex: 9999,
  },
  accentBar: {
    width: 5,
    alignSelf: "stretch",
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  textWrapper: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    color: "#424242",
    fontWeight: "500",
    lineHeight: 18,
  },
  closeBtn: {
    paddingRight: 14,
    paddingLeft: 4,
  },
});
