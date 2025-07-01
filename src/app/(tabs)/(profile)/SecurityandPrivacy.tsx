import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import NavHeader from "../../../components/NavHeader";
import Button from "../../../components/Button";
import { FONT } from "../../../../assets/constants/fonts";

const loginAlerts = [
  {
    device: "iPhone 15",
    date: "04/16/2025 2:19 am",
    location: "Surat, India",
    current: true,
  },
  {
    device: "iPhone 14 pro max",
    date: "03/12/2024 5:22 am",
    location: "Ahmedabad, India",
    current: false,
  },
];

const options = [
  "Blocked Users",
  "Terms & Conditions",
  "Privacy Policy",
  "Data Compliance",
];

export default function PrivacySettingsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <NavHeader title="Security & Privacy" />

      <Text style={styles.sectionTitle}>Login Alerts</Text>

      <View style={styles.card}>
        {loginAlerts.map((item, idx) => (
          <View key={idx}>
            <View style={styles.row}>
              <View style={styles.iconBox}>
                <MaterialIcons name="phone-iphone" size={20} color="#000" />
              </View>
              <View style={styles.deviceInfo}>
                <View style={styles.rowBetween}>
                  <Text style={styles.deviceName}>{item.device}</Text>
                  <Text style={styles.time}>{item.date}</Text>
                </View>
                <Text style={styles.location}>
                  {item.location}
                  {item.current && (
                    <Text style={styles.currentText}> | This device</Text>
                  )}
                </Text>
              </View>
            </View>
            {idx !== loginAlerts.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>OTHER PRIVACY</Text>

      <View style={styles.card}>
        {options.map((item, idx) => (
          <TouchableOpacity key={idx} style={styles.listItem}>
            <Text style={styles.listText}>{item}</Text>
            <MaterialIcons name="chevron-right" size={24} color="#555" />
          </TouchableOpacity>
        ))}
      </View>

      <Button label="Save settings" onPress={() => {}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: Platform.OS === "ios" ? 10 : 30,
    backgroundColor: "#3E3E3E",
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: FONT.BOLD,
    color: "#fff",
    marginTop: 16,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 15,
    fontFamily: FONT.BOLD,
    color: "#111",
  },
  time: {
    fontSize: 12,
    fontFamily: FONT.REGULAR,
    color: "#999",
  },
  location: {
    fontSize: 13,
    fontFamily: FONT.MEDIUM,
    color: "#444",
    marginTop: 2,
  },
  currentText: {
    color: "green",
    fontFamily: FONT.SEMIBOLD,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  listText: {
    fontSize: 15,
    fontFamily: FONT.MEDIUM,
    color: "#222",
  },
  saveButton: {
    backgroundColor: "#CDDC39",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: FONT.SEMIBOLD,
    color: "#000",
  },
});