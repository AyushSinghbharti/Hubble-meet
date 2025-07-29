import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import NavHeader from "../../../components/NavHeader";
import Button from "../../../components/Button";
import { FONT } from "../../../../assets/constants/fonts";
import { router } from "expo-router";

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

const privacyPolicyContent = `A privacy policy explains how your website, products, and services collect, use, and protect user information. It outlines the types of data gathered, why it is collected, and how it is stored or shared, ensuring compliance with privacy laws.
This document is sometimes referred to as a data protection policy or a privacy statement. Its purpose remains the same: to inform users of their rights and how their personal information is handled.
By using your website, products, or services, customers acknowledge and agree to your your privacy `;

const termsAndConditionsContent = `Terms and conditions outline what users can and cannot do with your website, products, and services. They lay out the rules to protect you in case of misuse and enable you to take action if it becomes necessary.

It's also referred to by other names such as terms of service (ToS) and terms of use (ToU). Even though they have different names, in fact – there is no difference.

In order to use your website, products, or services, your customers usually must agree to abide by your terms and conditions first.`;

export default function PrivacySettingsScreen() {
  const [isPrivacyModalVisible, setIsPrivacyModalVisible] = useState(false);
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);

  const handleOptionPress = (option) => {
    switch (option) {
      case "Privacy Policy":
        setIsPrivacyModalVisible(true);
        break;
      case "Terms & Conditions":
        setIsTermsModalVisible(true);
        break;
      case "Blocked Users":
        router.push('/BlockedUsers')
        break;
      case "Data Compliance":
        console.log("Navigating to Data Compliance screen");
        break;
      default:
        console.log(`Pressed: ${option}`);
    }
  };


  const closePrivacyModal = () => {
    setIsPrivacyModalVisible(false);
  };

  const closeTermsModal = () => {
    setIsTermsModalVisible(false);
  };

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
          <TouchableOpacity
            key={idx}
            style={styles.listItem}
            onPress={() => handleOptionPress(item)}
          >
            <Text style={styles.listText}>{item}</Text>
            <MaterialIcons name="chevron-right" size={24} color="#555" />
          </TouchableOpacity>
        ))}
      </View>

      <Button label="Save settings" onPress={() => { }} />

      {/* Privacy Policy Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPrivacyModalVisible}
        onRequestClose={closePrivacyModal}
        presentationStyle="overFullScreen"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Privacy Policy</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closePrivacyModal}
              >
                <MaterialIcons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalContent}
              contentContainerStyle={styles.modalContentContainer}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              <Text style={styles.modalText}>{privacyPolicyContent}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Terms & Conditions Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isTermsModalVisible}
        onRequestClose={closeTermsModal}
        presentationStyle="overFullScreen"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Terms & Conditions</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeTermsModal}
              >
                <MaterialIcons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalContent}
              contentContainerStyle={styles.modalContentContainer}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              <Text style={styles.modalText}>{termsAndConditionsContent}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: '100%',
    height: '80%', // Changed from maxHeight to height
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FONT.BOLD,
    color: "#000",
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalContentContainer: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1, // Added this
  },
  modalText: {
    fontSize: 16,
    fontFamily: FONT.REGULAR,
    color: "#333",
    lineHeight: 24,
    textAlign: 'justify', // Added this for better text formatting
  },
});