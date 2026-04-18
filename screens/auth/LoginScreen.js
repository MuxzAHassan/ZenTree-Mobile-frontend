import React, { useState } from "react";
// [FIX] Added ActivityIndicator for button loading state
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import LogoWithText from "../../assets/LogowithText.svg";
import { useLanguage } from "../../context/LanguageContext.js";
import { useAuth } from "../../context/AuthContext.js";
import LanguageSelector from "../../components/LanguageSelector.js";
import { Ionicons } from "@expo/vector-icons";
import { loginUser } from "../../api/auth";
import Snackbar from "../../components/Snackbar";

export default function LoginScreen({ navigation }) {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // [FIX] Added loading state to prevent double-tap and show feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    type: "error",
  });

  const showSnackbar = (message, type = "error") =>
    setSnackbar({ visible: true, message, type });
  const hideSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, visible: false }));

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) newErrors.email = t("login.error_email_required");
    else if (!emailRegex.test(email))
      newErrors.email = t("login.error_email_format");
    if (!password) newErrors.password = t("login.error_password_required");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    // [FIX] Prevent submitting while already in progress
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await loginUser(email, password);
      const data = await response.json();

      if (data.success) {
        showSnackbar(t("login.success"), "success");
        await new Promise((resolve) => setTimeout(resolve, 1200));
        await login(data);
      } else {
        showSnackbar(data.message || t("login.error_invalid"), "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      showSnackbar(t("login.error_generic"), "error");
    } finally {
      // [FIX] Always re-enable button after attempt completes
      setIsSubmitting(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FAF9F6" }}>
      <LanguageSelector />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LogoWithText width={180} height={180} style={styles.logo} />

          <View style={styles.form}>
            <View
              style={[
                styles.passwordWrapper,
                errors.email && styles.inputError,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color="#BDBDBD"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.passwordInput}
                placeholder={t("login.email")}
                placeholderTextColor="#BDBDBD"
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <View
              style={[
                styles.passwordWrapper,
                errors.password && styles.inputError,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#BDBDBD"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.passwordInput}
                placeholder={t("login.password")}
                placeholderTextColor="#BDBDBD"
                value={password}
                onChangeText={(v) => {
                  setPassword(v);
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#BDBDBD"
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* [FIX] Disable button and show spinner while submitting */}
          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{t("login.button")}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>New to NakUrut?</Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.link}>{t("login.register_link")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onHide={hideSnackbar}
      />
    </View>
  );
}

// [FIX] Moved StyleSheet.create outside component — avoids re-creating styles on every render
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAF9F6",
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  logo: {
    marginBottom: 20,
  },
  appName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#B5651D",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  greeting: {
    fontSize: 14,
    color: "#9E9E9E",
    marginBottom: 36,
  },
  form: {
    width: "100%",
    marginBottom: 4,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 15,
    color: "#1A1A1A",
    backgroundColor: "#FAFAFA",
  },
  passwordWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
    backgroundColor: "#FAFAFA",
  },
  inputError: {
    borderColor: "#E63946",
  },
  inputIcon: {
    marginRight: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: "#1A1A1A",
  },
  errorText: {
    color: "#E63946",
    fontSize: 12,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#B5651D",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  // [FIX] Added disabled button style for visual feedback
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  registerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
  },
  registerText: {
    fontSize: 14,
    color: "#9E9E9E",
  },
  link: {
    fontSize: 14,
    color: "#B5651D",
    fontWeight: "700",
    marginLeft: 5,
  },
});
