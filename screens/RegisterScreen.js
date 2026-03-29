import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  Platform,
  ScrollView,
  Modal,
  // [FIX] Added ActivityIndicator for button loading state
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLanguage } from "../context/LanguageContext.js";
import { registerUser } from "../api/auth";

export default function RegisterScreen({ navigation }) {
  const { t } = useLanguage();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    role: "",
    gender: "",
    dateOfBirth: new Date(),
    phone: "",
    email: "",
    password: "",
  });

  const [tooltipVisible, setTooltipVisible] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  // [FIX] Added loading state to prevent double-tap during registration
  const [isSubmitting, setIsSubmitting] = useState(false);
  // [FIX] Added inline validation errors instead of using alert()
  const [errors, setErrors] = useState({});

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || form.dateOfBirth;
    setShowDatePicker(Platform.OS === "ios");
    setForm({ ...form, dateOfBirth: currentDate });
  };

  // [FIX] Added email format validation helper
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // [FIX] Added phone number format validation helper (Malaysian format)
  const isValidPhone = (phone) => {
    const phoneRegex = /^(\+?60|0)\d{9,10}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ""));
  };

  // [FIX] Added comprehensive form validation with per-field error messages
  const validateForm = () => {
    const newErrors = {};
    const { firstName, lastName, email, password, gender, phone, role } = form;

    if (!firstName.trim()) newErrors.firstName = t("register.error_required");
    if (!lastName.trim()) newErrors.lastName = t("register.error_required");
    if (!role) newErrors.role = t("register.error_required");
    if (!gender) newErrors.gender = t("register.error_required");
    if (!phone.trim()) {
      newErrors.phone = t("register.error_required");
    } else if (!isValidPhone(phone)) {
      newErrors.phone = t("register.error_phone_format");
    }
    if (!email.trim()) {
      newErrors.email = t("register.error_required");
    } else if (!isValidEmail(email)) {
      newErrors.email = t("register.error_email_format");
    }
    if (!password) {
      newErrors.password = t("register.error_required");
    } else if (password.length < 6) {
      newErrors.password = t("register.error_password_length");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    // [FIX] Use proper validation instead of simple truthy check
    if (!validateForm()) return;
    // [FIX] Prevent double submission
    if (isSubmitting) return;
    setIsSubmitting(true);

    const { firstName, lastName, email, password, gender, phone, role } = form;

    try {
      const roleValue = role.toLowerCase();

      const response = await registerUser({
        firstName,
        lastName,
        email,
        password,
        gender,
        dateOfBirth: form.dateOfBirth,
        phone,
        role: roleValue,
      });

      const data = await response.json();

      if (response.ok) {
        alert(t("register.success"));
        navigation.navigate("Login");
      } else {
        alert(data.message || t("register.error_default"));
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      // [FIX] Always re-enable button after attempt completes
      setIsSubmitting(false);
    }
  };

  const gotoLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Image
            source={require("../assets/NakUrut Logo only.png")}
            style={{ width: 150, height: 150, marginBottom: 15 }}
            resizeMode="contain"
          />
          <TextInput
            style={[styles.input, errors.firstName && styles.inputError]}
            placeholder={t("register.firstName")}
            value={form.firstName}
            onChangeText={(text) => {
              setForm({ ...form, firstName: text });
              // [FIX] Clear error when user starts typing
              if (errors.firstName) setErrors({ ...errors, firstName: null });
            }}
          />
          {/* [FIX] Show inline error message below field */}
          {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

          <TextInput
            style={[styles.input, errors.lastName && styles.inputError]}
            placeholder={t("register.lastName")}
            value={form.lastName}
            onChangeText={(text) => {
              setForm({ ...form, lastName: text });
              if (errors.lastName) setErrors({ ...errors, lastName: null });
            }}
          />
          {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

          {/*Pressable function for role selection*/}
          <View
            style={{
              width: "100%",
              alignItems: "flex-start",
              marginBottom: 10,
            }}
          >
            <Text style={styles.label}>{t("register.role_title")}</Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                onPress={() => {
                  setForm({ ...form, role: "Partner" });
                  if (errors.role) setErrors({ ...errors, role: null });
                }}
                style={[
                  styles.toggle,
                  form.role === "Partner" && styles.activeToggle,
                ]}
              >
                <Text style={styles.text}>{t("register.role_partner")}</Text>
                <TouchableOpacity onPress={() => setTooltipVisible("partner")}>
                  <Text style={styles.tooltipIcon}>ⓘ</Text>
                </TouchableOpacity>
              </Pressable>

              <Pressable
                onPress={() => {
                  setForm({ ...form, role: "User" });
                  if (errors.role) setErrors({ ...errors, role: null });
                }}
                style={[
                  styles.toggle,
                  form.role === "User" && styles.activeToggle,
                ]}
              >
                <Text style={styles.text}>{t("register.role_user")}</Text>
                <TouchableOpacity onPress={() => setTooltipVisible("user")}>
                  <Text style={styles.tooltipIcon}>ⓘ</Text>
                </TouchableOpacity>
              </Pressable>
            </View>
            {/* [FIX] Show inline error for role selection */}
            {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}
          </View>

          {/* Tooltip Modal */}
          <Modal
            visible={tooltipVisible !== null}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setTooltipVisible(null)}
          >
            <Pressable
              style={styles.tooltipOverlay}
              onPress={() => setTooltipVisible(null)}
            >
              <View style={styles.tooltipBox}>
                <Text style={styles.tooltipTitle}>
                  {tooltipVisible === "partner"
                    ? t("register.role_partner")
                    : t("register.role_user")}
                </Text>
                <Text style={styles.tooltipText}>
                  {tooltipVisible === "partner"
                    ? t("register.role_partner_tooltip")
                    : t("register.role_user_tooltip")}
                </Text>
                <TouchableOpacity
                  style={styles.tooltipClose}
                  onPress={() => setTooltipVisible(null)}
                >
                  <Text style={styles.tooltipCloseText}>OK</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Modal>

          {/*Pressable function for gender selection*/}
          <View
            style={{
              width: "100%",
              alignItems: "flex-start",
              marginBottom: 10,
            }}
          >
            <Text style={styles.label}>{t("register.gender")}</Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                onPress={() => {
                  setForm({ ...form, gender: "Male" });
                  if (errors.gender) setErrors({ ...errors, gender: null });
                }}
                style={[
                  styles.toggle,
                  form.gender === "Male" && styles.activeToggle,
                ]}
              >
                <Text style={styles.text}>{t("register.male")}</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setForm({ ...form, gender: "Female" });
                  if (errors.gender) setErrors({ ...errors, gender: null });
                }}
                style={[
                  styles.toggle,
                  form.gender === "Female" && styles.activeToggle,
                ]}
              >
                <Text style={styles.text}>{t("register.female")}</Text>
              </Pressable>
            </View>
            {/* [FIX] Show inline error for gender selection */}
            {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
          </View>

          {/*Date picker function for Date of Birth selection*/}
          <Text style={styles.label}>{t("register.dob")}</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>
              {form.dateOfBirth
                ? form.dateOfBirth.toDateString()
                : t("register.dob_placeholder")}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={form.dateOfBirth}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}

          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            placeholder={t("register.phone")}
            value={form.phone}
            onChangeText={(text) => {
              setForm({ ...form, phone: text });
              if (errors.phone) setErrors({ ...errors, phone: null });
            }}
            keyboardType="phone-pad"
          />
          {/* [FIX] Show inline error for phone */}
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder={t("register.email")}
            value={form.email}
            onChangeText={(text) => {
              setForm({ ...form, email: text });
              if (errors.email) setErrors({ ...errors, email: null });
            }}
            // [FIX] Set keyboard type for email input
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {/* [FIX] Show inline error for email */}
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder={t("register.password")}
            value={form.password}
            onChangeText={(text) => {
              setForm({ ...form, password: text });
              if (errors.password) setErrors({ ...errors, password: null });
            }}
            // [FIX] Mask password input — was previously visible as plain text
            secureTextEntry={true}
          />
          {/* [FIX] Show inline error for password */}
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          {/* [FIX] Disable button and show spinner while submitting */}
          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{t("register.button")}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={gotoLogin}>
            <Text style={styles.link}>{t("register.login_link")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// [FIX] Moved StyleSheet.create outside component — avoids re-creating styles on every render
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#B5651D",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  // [FIX] Added error state style for input fields with validation errors
  inputError: {
    borderColor: "#E63946",
    borderWidth: 1.5,
  },
  // [FIX] Added error text style for inline validation messages
  errorText: {
    color: "#E63946",
    fontSize: 12,
    alignSelf: "flex-start",
    marginTop: -10,
    marginBottom: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#B5651D",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  // [FIX] Added disabled button style for visual feedback
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    color: "#2E86C1",
    alignSelf: "flex-start",
  },
  label: {
    fontSize: 16,
    fontWeight: "normal",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  toggle: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  activeToggle: {
    backgroundColor: "#d3d3d3",
    borderColor: "#d3d3d3",
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  tooltipIcon: {
    fontSize: 16,
    color: "#888",
  },
  tooltipOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  tooltipBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  tooltipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#B5651D",
    marginBottom: 8,
  },
  tooltipText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  tooltipClose: {
    marginTop: 14,
    alignSelf: "flex-end",
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: "#B5651D",
    borderRadius: 6,
  },
  tooltipCloseText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
});
