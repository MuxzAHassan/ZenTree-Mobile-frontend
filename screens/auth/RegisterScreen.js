import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  ScrollView,
  Modal,
  ActivityIndicator,
  FlatList,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LogoWithText from "../../assets/LogowithText.svg";
import { useLanguage } from "../../context/LanguageContext.js";
import LanguageSelector from "../../components/LanguageSelector.js";
import { registerUser } from "../../api/auth";
import Snackbar from "../../components/Snackbar";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - i);
const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

const STEPS = [
  { title: "Personal Info", subtitle: "Tell us about yourself" },
  { title: "Account Type", subtitle: "How will you use NakUrut?" },
  { title: "Contact & Security", subtitle: "How can we reach you?" },
];

export default function RegisterScreen({ navigation }) {
  const { t } = useLanguage();

  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    role: "",
    gender: "",
    dateOfBirth: null,
    phone: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ visible: false, message: "", type: "error" });
  const [tooltipVisible, setTooltipVisible] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const showSnackbar = (message, type = "error") =>
    setSnackbar({ visible: true, message, type });
  const hideSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, visible: false }));

  // Date picker temp state
  const DEFAULT_DATE = new Date();
  const [tempDay, setTempDay] = useState(1);
  const [tempMonth, setTempMonth] = useState(0);
  const [tempYear, setTempYear] = useState(2000);
  const sheetAnim = useRef(new Animated.Value(400)).current;

  const openDatePicker = () => {
    const ref = form.dateOfBirth || DEFAULT_DATE;
    setTempDay(ref.getDate());
    setTempMonth(ref.getMonth());
    setTempYear(ref.getFullYear());
    setShowDatePicker(true);
    Animated.spring(sheetAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
      speed: 20,
    }).start();
  };

  const closeDatePicker = () => {
    Animated.timing(sheetAnim, {
      toValue: 400,
      duration: 220,
      useNativeDriver: true,
    }).start(() => setShowDatePicker(false));
  };

  const confirmDate = () => {
    const safeDay = Math.min(tempDay, getDaysInMonth(tempMonth, tempYear));
    setForm({ ...form, dateOfBirth: new Date(tempYear, tempMonth, safeDay), });
    Animated.timing(sheetAnim, {
      toValue: 400,
      duration: 220,
      useNativeDriver: true,
    }).start(() => setShowDatePicker(false));
  };

  const formatDate = (date) =>
    `${String(date.getDate()).padStart(2, "0")} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;

  // Per-step validation
  const required = (label) => `${label} is required`;

  const validateStep = () => {
    const newErrors = {};
    if (step === 0) {
      if (!form.firstName.trim()) newErrors.firstName = required("First name");
      if (!form.lastName.trim()) newErrors.lastName = required("Last name");
      if (!form.gender) newErrors.gender = required("Gender");
    }
    if (step === 1) {
      if (!form.role) newErrors.role = required("Account type");
    }
    if (step === 2) {
      const phoneRegex = /^(\+?60|0)\d{9,10}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!form.phone.trim()) newErrors.phone = required("Phone number");
      else if (!phoneRegex.test(form.phone.replace(/[\s-]/g, "")))
        newErrors.phone = t("register.error_phone_format");
      if (!form.email.trim()) newErrors.email = required("Email");
      else if (!emailRegex.test(form.email))
        newErrors.email = t("register.error_email_format");
      if (!form.password) newErrors.password = required("Password");
      else if (form.password.length < 6)
        newErrors.password = t("register.error_password_length");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setErrors({});
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const handleRegister = async () => {
    if (!validateStep()) return;
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await registerUser({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        phone: form.phone,
        role: form.role.toLowerCase(),
      });
      const data = await response.json();
      if (response.ok) {
        showSnackbar(t("register.success"), "success");
        await new Promise((resolve) => setTimeout(resolve, 1200));
        navigation.navigate("Login");
      } else {
        showSnackbar(data.message || t("register.error_default"), "error");
      }
    } catch (error) {
      console.error("Register error:", error);
      showSnackbar(t("register.error_default"), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <LanguageSelector />

      {/* Fixed header — logo + progress */}
      <View style={styles.header}>
        <LogoWithText width={180} height={180} />
        <View style={styles.progressRow}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i === step && styles.progressDotActive,
                i < step && styles.progressDotDone,
              ]}
            />
          ))}
        </View>
        <Text style={styles.stepTitle}>{STEPS[step].title}</Text>
        <Text style={styles.stepSubtitle}>{STEPS[step].subtitle}</Text>
      </View>

      {/* Scrollable form area */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.formContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Step 0: Personal Info ── */}
          {step === 0 && (
            <>
              <Field
                icon="person-outline"
                placeholder={t("register.firstName")}
                value={form.firstName}
                onChangeText={(text) => {
                  setForm({ ...form, firstName: text });
                  if (errors.firstName)
                    setErrors({ ...errors, firstName: null });
                }}
                error={errors.firstName}
              />
              <Field
                icon="person-outline"
                placeholder={t("register.lastName")}
                value={form.lastName}
                onChangeText={(text) => {
                  setForm({ ...form, lastName: text });
                  if (errors.lastName) setErrors({ ...errors, lastName: null });
                }}
                error={errors.lastName}
              />

              <Text style={styles.label}>{t("register.gender")}</Text>
              <View style={styles.toggleRow}>
                {["Male", "Female"].map((g) => (
                  <Pressable
                    key={g}
                    style={[
                      styles.toggle,
                      form.gender === g && styles.toggleActive,
                    ]}
                    onPress={() => {
                      setForm({ ...form, gender: g });
                      if (errors.gender) setErrors({ ...errors, gender: null });
                    }}
                  >
                    <Text
                      style={[
                        styles.toggleText,
                        form.gender === g && styles.toggleTextActive,
                      ]}
                    >
                      {t(`register.${g.toLowerCase()}`)}
                    </Text>
                  </Pressable>
                ))}
              </View>
              {errors.gender && (
                <Text style={styles.errorText}>{errors.gender}</Text>
              )}

              <Text style={styles.label}>{t("register.dob")}</Text>
              <TouchableOpacity
                style={styles.fieldWrapper}
                onPress={openDatePicker}
              >
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color="#BDBDBD"
                  style={styles.inputIcon}
                />
                <Text
                  style={[
                    styles.fieldInput,
                    { paddingVertical: 13, color: form.dateOfBirth ? "#1A1A1A" : "#BDBDBD" },
                  ]}
                >
                  {form.dateOfBirth ? formatDate(form.dateOfBirth) : t("register.dob") || "Date of Birth"}
                </Text>
                <Ionicons
                  name="chevron-down-outline"
                  size={16}
                  color="#BDBDBD"
                />
              </TouchableOpacity>
            </>
          )}

          {/* ── Step 1: Role ── */}
          {step === 1 && (
            <>
              <Text style={styles.label}>{t("register.role_title")}</Text>
              <View style={styles.roleRow}>
                {[
                  {
                    value: "Partner",
                    icon: "briefcase-outline",
                    tooltip: "partner",
                  },
                  {
                    value: "User",
                    icon: "person-circle-outline",
                    tooltip: "user",
                  },
                ].map(({ value, icon, tooltip }) => (
                  <Pressable
                    key={value}
                    style={[
                      styles.roleCard,
                      form.role === value && styles.roleCardActive,
                    ]}
                    onPress={() => {
                      setForm({ ...form, role: value });
                      if (errors.role) setErrors({ ...errors, role: null });
                    }}
                  >
                    <Ionicons
                      name={icon}
                      size={32}
                      color={form.role === value ? "#B5651D" : "#BDBDBD"}
                    />
                    <Text
                      style={[
                        styles.roleCardText,
                        form.role === value && styles.roleCardTextActive,
                      ]}
                    >
                      {t(`register.role_${value.toLowerCase()}`)}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setTooltipVisible(tooltip)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      style={styles.roleInfoBtn}
                    >
                      <Ionicons
                        name="information-circle-outline"
                        size={18}
                        color={form.role === value ? "#B5651D" : "#BDBDBD"}
                      />
                    </TouchableOpacity>
                  </Pressable>
                ))}
              </View>
              {errors.role && (
                <Text style={styles.errorText}>{errors.role}</Text>
              )}
            </>
          )}

          {/* ── Step 2: Contact & Security ── */}
          {step === 2 && (
            <>
              <Field
                icon="call-outline"
                placeholder={t("register.phone")}
                value={form.phone}
                onChangeText={(text) => {
                  setForm({ ...form, phone: text });
                  if (errors.phone) setErrors({ ...errors, phone: null });
                }}
                keyboardType="phone-pad"
                error={errors.phone}
              />
              <Field
                icon="mail-outline"
                placeholder={t("register.email")}
                value={form.email}
                onChangeText={(text) => {
                  setForm({ ...form, email: text });
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />
              <PasswordField
                placeholder={t("register.password")}
                value={form.password}
                onChangeText={(text) => {
                  setForm({ ...form, password: text });
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
                showPassword={showPassword}
                toggleShow={() => setShowPassword((v) => !v)}
                error={errors.password}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed bottom navigation */}
      <View style={styles.navRow}>
        {step > 0 ? (
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Ionicons name="arrow-back-outline" size={18} color="#B5651D" />
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.navigate("Login")}
          >
            <Ionicons name="arrow-back-outline" size={18} color="#B5651D" />
            <Text style={styles.backBtnText}>Sign in</Text>
          </TouchableOpacity>
        )}

        {step < STEPS.length - 1 ? (
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={styles.nextBtnText}>Next</Text>
            <Ionicons name="arrow-forward-outline" size={18} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.nextBtn, isSubmitting && { opacity: 0.6 }]}
            onPress={handleRegister}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.nextBtnText}>{t("register.button")}</Text>
                <Ionicons name="checkmark-outline" size={18} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Tooltip Modal */}
      <Modal
        visible={tooltipVisible !== null}
        transparent
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

      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onHide={hideSnackbar}
      />

      {/* Date picker bottom sheet */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="none"
        onRequestClose={closeDatePicker}
      >
        <Pressable style={styles.dateOverlay} onPress={closeDatePicker}>
          <Animated.View
            style={[
              styles.dateSheet,
              { transform: [{ translateY: sheetAnim }] },
            ]}
          >
            <Pressable>
              <View style={styles.dateSheetHeader}>
                <TouchableOpacity onPress={closeDatePicker}>
                  <Text style={styles.dateSheetCancel}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.dateSheetTitle}>{t("register.dob")}</Text>
                <TouchableOpacity onPress={confirmDate}>
                  <Text style={styles.dateSheetDone}>Done</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.pickerRow}>
                <PickerColumn
                  label="Day"
                  data={Array.from(
                    { length: getDaysInMonth(tempMonth, tempYear) },
                    (_, i) => i + 1,
                  )}
                  selected={tempDay}
                  onSelect={setTempDay}
                  format={(v) => String(v).padStart(2, "0")}
                />
                <PickerColumn
                  label="Month"
                  data={MONTHS}
                  selected={tempMonth}
                  onSelect={setTempMonth}
                  indexMode
                />
                <PickerColumn
                  label="Year"
                  data={YEARS}
                  selected={tempYear}
                  onSelect={setTempYear}
                />
              </View>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
}

// ── Reusable field components ──

function Field({ icon, error, ...props }) {
  return (
    <>
      <View style={[styles.fieldWrapper, error && styles.fieldError]}>
        <Ionicons
          name={icon}
          size={20}
          color="#BDBDBD"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.fieldInput}
          placeholderTextColor="#BDBDBD"
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );
}

function PasswordField({ showPassword, toggleShow, error, ...props }) {
  return (
    <>
      <View style={[styles.fieldWrapper, error && styles.fieldError]}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#BDBDBD"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.fieldInput}
          placeholderTextColor="#BDBDBD"
          secureTextEntry={!showPassword}
          {...props}
        />
        <TouchableOpacity
          onPress={toggleShow}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={20}
            color="#BDBDBD"
          />
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );
}

function PickerColumn({ label, data, selected, onSelect, format, indexMode }) {
  const initialIndex = indexMode ? selected : data.indexOf(selected);
  return (
    <View style={styles.pickerCol}>
      <Text style={styles.pickerColLabel}>{label}</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item)}
        showsVerticalScrollIndicator={false}
        style={styles.pickerList}
        initialScrollIndex={Math.max(0, initialIndex)}
        getItemLayout={(_, index) => ({
          length: 44,
          offset: 44 * index,
          index,
        })}
        renderItem={({ item, index }) => {
          const isActive = indexMode ? selected === index : selected === item;
          return (
            <TouchableOpacity
              style={[styles.pickerItem, isActive && styles.pickerItemActive]}
              onPress={() => onSelect(indexMode ? index : item)}
            >
              <Text
                style={[
                  styles.pickerItemText,
                  isActive && styles.pickerItemTextActive,
                ]}
              >
                {format ? format(item) : item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FAF9F6",
  },

  // Fixed header
  header: {
    alignItems: "center",
    paddingTop: 150,
    paddingBottom: 16,
    paddingHorizontal: 28,
    backgroundColor: "#FAF9F6",
  },
  progressRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    marginBottom: 12,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
  },
  progressDotActive: {
    width: 24,
    backgroundColor: "#B5651D",
  },
  progressDotDone: {
    backgroundColor: "#D4A574",
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  stepSubtitle: {
    fontSize: 13,
    color: "#9E9E9E",
  },

  // Form
  formContainer: {
    paddingHorizontal: 28,
    paddingTop: 8,
    paddingBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
    alignSelf: "flex-start",
    marginBottom: 8,
    marginTop: 4,
  },

  // Field wrapper
  fieldWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#FAFAFA",
  },
  fieldError: {
    borderColor: "#E63946",
  },
  inputIcon: {
    marginRight: 10,
  },
  fieldInput: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: "#1A1A1A",
  },
  errorText: {
    color: "#E63946",
    fontSize: 12,
    alignSelf: "flex-start",
    marginTop: -8,
    marginBottom: 8,
  },

  // Gender toggle
  toggleRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    marginBottom: 12,
  },
  toggle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingVertical: 12,
    backgroundColor: "#FAFAFA",
  },
  toggleActive: {
    borderColor: "#B5651D",
    backgroundColor: "#FFF3E6",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#9E9E9E",
  },
  toggleTextActive: {
    color: "#B5651D",
    fontWeight: "700",
  },

  // Role cards
  roleRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginBottom: 12,
  },
  roleCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 14,
    backgroundColor: "#FAFAFA",
    gap: 8,
  },
  roleCardActive: {
    borderColor: "#B5651D",
    backgroundColor: "#FFF3E6",
  },
  roleCardText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9E9E9E",
  },
  roleCardTextActive: {
    color: "#B5651D",
  },
  roleInfoBtn: {
    position: "absolute",
    top: 8,
    right: 8,
  },

  // Bottom nav
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingVertical: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    backgroundColor: "#FAF9F6",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  backBtnText: {
    fontSize: 15,
    color: "#B5651D",
    fontWeight: "600",
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#B5651D",
    paddingVertical: 13,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  nextBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },

  // Tooltip
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

  // Date picker
  dateOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  dateSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 36,
  },
  dateSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  dateSheetTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  dateSheetCancel: {
    fontSize: 15,
    color: "#9E9E9E",
  },
  dateSheetDone: {
    fontSize: 15,
    fontWeight: "700",
    color: "#B5651D",
  },
  pickerRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  pickerCol: {
    flex: 1,
    alignItems: "center",
  },
  pickerColLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#BDBDBD",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  pickerList: {
    height: 220,
    width: "100%",
  },
  pickerItem: {
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 4,
    marginVertical: 2,
  },
  pickerItemActive: {
    backgroundColor: "#FFF3E6",
  },
  pickerItemText: {
    fontSize: 16,
    color: "#9E9E9E",
  },
  pickerItemTextActive: {
    fontSize: 17,
    fontWeight: "700",
    color: "#B5651D",
  },
});
