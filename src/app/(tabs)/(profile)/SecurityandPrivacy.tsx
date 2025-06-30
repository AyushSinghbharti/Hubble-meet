import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import NavHeader from "../../../components/NavHeader";
import { Platform } from "react-native";

const options = [
  "Blocked Users",
  "Terms & Conditions",
  "Privacy policy",
  "Data compliance",
];

export default function PrivacySettingsScreen() {
  return (
    <ScrollView style={styles.container}>
      <NavHeader title="Security & Privacy" />
      <Text style={styles.sectionTitle}>Login Alerts</Text>

      <View style={styles.loginBox}>
        <View style={styles.loginRow}>
          <MaterialIcons name="phone-iphone" size={24} color="#333" />
          <View style={styles.loginDetails}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.deviceTitle}>iPhone 15</Text>
              <Text style={styles.timestamp}>04/16/2025 2:19 am</Text>
            </View>

            <Text style={styles.subText}>
              Surat, India |{" "}
              <Text style={styles.activeDevice}>This device</Text>
            </Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.loginRow}>
          <MaterialIcons name="phone-iphone" size={24} color="#333" />
          <View style={styles.loginDetails}>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.deviceTitle}>iPhone 15</Text>
                <Text style={styles.timestamp}>04/16/2025 2:19 am</Text>
              </View>
            </View>

            <Text style={styles.subText}>Ahmedabad, India</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Other Privacy</Text>

      <View style={styles.privacyList}>
        {options.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.listItem,
              idx === options.length - 1 && { borderBottomWidth: 0 }]}
          >
            <Text style={styles.listText}>{item}</Text>
            <MaterialIcons name="chevron-right" size={24} color="#555" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f5f7",
    paddingTop: Platform.OS === "ios" ? 10 : 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A5C2D",
    marginBottom: 8,
    marginTop: 16,
  },
  loginBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  loginRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  loginDetails: {
    marginLeft: 10,
    flex: 1,
  },
  deviceTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
  },
  subText: {
    fontSize: 13,
    color: "#555",
  },
  activeDevice: {
    color: "green",
    fontWeight: "600",
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  privacyList: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 4,
    marginBottom: 24,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  listText: {
    fontSize: 15,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
