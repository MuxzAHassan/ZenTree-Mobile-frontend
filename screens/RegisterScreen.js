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
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLanguage } from '../context/LanguageContext.js';

export default function RegisterScreen({ navigation }) {
  const { t } = useLanguage();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: new Date(),
    phone: "",
    email: "",
    password: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || form.dateOfBirth;
    setShowDatePicker(Platform.OS === "ios");
    setForm({ ...form, dateOfBirth: currentDate });
  };

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
    button: {
      width: "100%",
      backgroundColor: "#B5651D",
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
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
  });

  const handleRegister = async () => {
    const { firstName, lastName, email, password, gender, phone } = form;

    //validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !form.dateOfBirth ||
      !gender ||
      !password
    ) {
      alert(t('register.validation_error'));
      return;
    }

    try {
      const response = await fetch(
        "https://zentree-backend-24l6.onrender.com/api/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            gender,
            dateOfBirth: form.dateOfBirth,
            phone,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(t('register.success'));
        navigation.navigate("Login");
      } else {
        alert(data.message || t('register.error_default'));
      }
    } catch (error) {
      alert("Error: " + error.message);
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
            style={styles.input}
            placeholder={t('register.firstName')}
            value={form.firstName}
            onChangeText={(text) => setForm({ ...form, firstName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder={t('register.lastName')}
            value={form.lastName}
            onChangeText={(text) => setForm({ ...form, lastName: text })}
          />

          {/*Pressable function for gender selection*/}
          <View
            style={{
              width: "100%",
              alignItems: "flex-start",
              marginBottom: 10,
            }}
          >
            <Text style={styles.label}>{t('register.gender')}</Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                onPress={() => setForm({ ...form, gender: "Male" })}
                style={[
                  styles.toggle,
                  form.gender === "Male" && styles.activeToggle,
                ]}
              >
                <Text style={styles.text}>{t('register.male')}</Text>
              </Pressable>

              <Pressable
                onPress={() => setForm({ ...form, gender: "Female" })}
                style={[
                  styles.toggle,
                  form.gender === "Female" && styles.activeToggle,
                ]}
              >
                <Text style={styles.text}>{t('register.female')}</Text>
              </Pressable>
            </View>
          </View>

          {/*Date picker function for Date of Birth selection*/}
          <Text style={styles.label}>{t('register.dob')}</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>
              {form.dateOfBirth
                ? form.dateOfBirth.toDateString()
                : t('register.dob_placeholder')}
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
            style={styles.input}
            placeholder={t('register.phone')}
            value={form.phone}
            onChangeText={(text) => setForm({ ...form, phone: text })}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder={t('register.email')}
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder={t('register.password')}
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
          />
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>{t('register.button')}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={gotoLogin}>
            <Text style={styles.link}>{t('register.login_link')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
